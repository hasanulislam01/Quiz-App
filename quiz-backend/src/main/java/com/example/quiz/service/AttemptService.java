package com.example.quiz.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.example.quiz.dto.*;
import com.example.quiz.entity.*;
import com.example.quiz.exception.ApiException;
import com.example.quiz.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AttemptService {
    private static final long GRACE_SECONDS = 10;

    private final AttemptRepository attemptRepo;
    private final UserRepository userRepo;
    private final CategoryRepository categoryRepo;
    private final QuestionRepository questionRepo;
    private final ExamSettingsService settingsService;

    // 1. Start an exam: pick random questions and fix the expiry time on the server
    @Transactional
    public AttemptDetail start(String email, Long categoryId) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "User not found"));
        Category category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Category not found"));
        ExamSettings s = settingsService.get();

        if (questionRepo.countByCategoryId(categoryId) < s.getQuestionCount()) {
            throw new ApiException(HttpStatus.CONFLICT,
                    "This category doesn't have enough questions yet");
        }

        Instant now = Instant.now();
        Attempt a = new Attempt();
        a.setUser(user);
        a.setCategory(category);
        a.setStartedAt(now);
        a.setExpiresAt(now.plus(Duration.ofMinutes(s.getDurationMinutes())));
        a.setStatus(AttemptStatus.IN_PROGRESS);
        a.setTotal(s.getQuestionCount());
        a.getQuestions().addAll(questionRepo.findRandomByCategory(categoryId, s.getQuestionCount()));
        attemptRepo.save(a);
        return toDetail(a);
    }

    // 2. Resume or review an attempt
    @Transactional
    public AttemptDetail get(Long id, String email, boolean admin) {
        Attempt a = load(id, email, admin);
        if (a.getStatus() == AttemptStatus.IN_PROGRESS && pastGrace(a)) {
            expire(a);
        }
        return toDetail(a);
    }

    // 3. Submit answers and score them on the server
    @Transactional
    public AttemptDetail submit(Long id, String email, SubmitRequest req) {
        Attempt a = load(id, email, false);
        if (a.getStatus() != AttemptStatus.IN_PROGRESS) {
            throw new ApiException(HttpStatus.CONFLICT, "This attempt is already finished");
        }
        if (pastGrace(a)) {
            expire(a);
            return toDetail(a);
        }

        Map<Long, Long> chosen = new HashMap<>();
        for (AnswerDto d : req.answers()) {
            chosen.put(d.questionId(), d.optionId());
        }
        int score = 0;
        for (Question q : a.getQuestions()) {
            Long optionId = chosen.get(q.getId());
            QuizOption selected = q.getOptions().stream()
                    .filter(o -> o.getId().equals(optionId))
                    .findFirst().orElse(null);
            boolean correct = selected != null && selected.isCorrect();
            a.getAnswers().add(newAnswer(a, q, selected, correct));
            if (correct) score++;
        }
        a.setScore(score);
        a.setTotal(a.getQuestions().size());
        a.setStatus(AttemptStatus.SUBMITTED);
        return toDetail(a);
    }

    @Transactional(readOnly = true)
    public List<AttemptSummary> mine(String email) {
        return attemptRepo.findByUserEmailOrderByStartedAtDesc(email).stream()
                .map(this::toSummary).toList();
    }

    @Transactional(readOnly = true)
    public List<AttemptSummary> search(Long categoryId, Long userId) {
        return attemptRepo.search(categoryId, userId).stream().map(this::toSummary).toList();
    }

    // ---------- helpers ----------

    private Attempt load(Long id, String email, boolean admin) {
        Attempt a = attemptRepo.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Attempt not found"));
        if (!admin && !a.getUser().getEmail().equals(email)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Attempt not found");   // do not reveal it exists
        }
        return a;
    }

    private boolean pastGrace(Attempt a) {
        return Instant.now().isAfter(a.getExpiresAt().plusSeconds(GRACE_SECONDS));
    }

    // Never submitted in time: mark EXPIRED, score 0, record every question as unanswered
    private void expire(Attempt a) {
        for (Question q : a.getQuestions()) {
            a.getAnswers().add(newAnswer(a, q, null, false));
        }
        a.setScore(0);
        a.setTotal(a.getQuestions().size());
        a.setStatus(AttemptStatus.EXPIRED);
    }

    private AttemptAnswer newAnswer(Attempt a, Question q, QuizOption selected, boolean correct) {
        AttemptAnswer ans = new AttemptAnswer();
        ans.setAttempt(a);
        ans.setQuestion(q);
        ans.setSelectedOption(selected);
        ans.setCorrect(correct);
        return ans;
    }

    private AttemptSummary toSummary(Attempt a) {
        return new AttemptSummary(a.getId(), a.getCategory().getName(), a.getUser().getName(),
                a.getStatus(), a.getScore(), a.getTotal(), a.getStartedAt());
    }

    private AttemptDetail toDetail(Attempt a) {
        boolean inProgress = a.getStatus() == AttemptStatus.IN_PROGRESS;
        long remaining = inProgress
                ? Math.max(0, Duration.between(Instant.now(), a.getExpiresAt()).getSeconds()) : 0;

        // stable order per attempt: sort by id, then shuffle with a seed built from the attempt id
        List<Question> questions = new ArrayList<>(a.getQuestions());
        questions.sort(Comparator.comparing(Question::getId));
        Collections.shuffle(questions, new Random(a.getId()));

        List<ExamQuestionView> views = null;
        List<ReviewItem> review = null;

        if (inProgress) {
            views = new ArrayList<>();
            for (Question q : questions) {
                List<QuizOption> opts = new ArrayList<>(q.getOptions());
                opts.sort(Comparator.comparing(QuizOption::getId));
                Collections.shuffle(opts, new Random(a.getId() * 31 + q.getId()));
                views.add(new ExamQuestionView(q.getId(), q.getText(),
                        opts.stream().map(o -> new ChoiceView(o.getId(), o.getText())).toList()));
            }
        } else {
            Map<Long, AttemptAnswer> byQuestion = new HashMap<>();
            for (AttemptAnswer ans : a.getAnswers()) {
                byQuestion.put(ans.getQuestion().getId(), ans);
            }
            review = new ArrayList<>();
            for (Question q : questions) {
                AttemptAnswer ans = byQuestion.get(q.getId());
                List<ReviewOption> opts = q.getOptions().stream()
                        .sorted(Comparator.comparing(QuizOption::getId))
                        .map(o -> new ReviewOption(o.getId(), o.getText(), o.isCorrect())).toList();
                Long selectedId = (ans != null && ans.getSelectedOption() != null)
                        ? ans.getSelectedOption().getId() : null;
                review.add(new ReviewItem(q.getId(), q.getText(), opts, selectedId,
                        ans != null && ans.isCorrect()));
            }
        }
        return new AttemptDetail(a.getId(), a.getCategory().getId(), a.getCategory().getName(),
                a.getUser().getName(), a.getStatus(), a.getScore(), a.getTotal(), a.getStartedAt(),
                remaining, views, review);
    }
}
