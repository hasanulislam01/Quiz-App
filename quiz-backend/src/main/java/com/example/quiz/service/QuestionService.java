package com.example.quiz.service;
import com.example.quiz.dto.*;
import com.example.quiz.entity.*;
import com.example.quiz.exception.ApiException;
import com.example.quiz.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class QuestionService {
    private final QuestionRepository questionRepo;
    private final CategoryRepository categoryRepo;

    @Transactional(readOnly = true)
    public List<QuestionResponse> list(Long categoryId) {
        List<Question> items = categoryId == null
                ? questionRepo.findAll() : questionRepo.findByCategoryId(categoryId);
        return items.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public QuestionResponse get(Long id) {
        return toResponse(find(id));
    }

    @Transactional
    public QuestionResponse create(QuestionRequest r) {
        Question q = new Question();
        apply(q, r);
        return toResponse(questionRepo.save(q));
    }

    @Transactional
    public QuestionResponse update(Long id, QuestionRequest r) {
        Question q = find(id);
        apply(q, r);
        return toResponse(q);
    }

    @Transactional
    public void delete(Long id) {
        questionRepo.delete(find(id));
    }

    private Question find(Long id) {
        return questionRepo.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Question not found"));
    }

    // Validates the rules and copies the request into the entity.
    // Existing options are updated in place by id, so past answers keep pointing at them.
    private void apply(Question q, QuestionRequest r) {
        long correctCount = r.options().stream().filter(OptionDto::correct).count();
        if (correctCount != 1) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Exactly one option must be marked correct");
        }
        Category c = categoryRepo.findById(r.categoryId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Category not found"));
        q.setCategory(c);
        q.setText(r.text().trim());

        Map<Long, QuizOption> existing = new HashMap<>();
        for (QuizOption o : q.getOptions()) {
            existing.put(o.getId(), o);
        }
        List<QuizOption> keep = new ArrayList<>();
        for (OptionDto d : r.options()) {
            QuizOption opt = d.id() != null ? existing.get(d.id()) : null;
            if (opt == null) {
                opt = new QuizOption();
            }
            opt.setText(d.text().trim());
            opt.setCorrect(d.correct());
            keep.add(opt);
        }
        q.getOptions().removeIf(o -> !keep.contains(o));
        for (QuizOption opt : keep) {
            if (!q.getOptions().contains(opt)) {
                q.addOption(opt);
            }
        }
    }

    private QuestionResponse toResponse(Question q) {
        List<OptionDto> options = q.getOptions().stream()
                .sorted(Comparator.comparing(QuizOption::getId))
                .map(o -> new OptionDto(o.getId(), o.getText(), o.isCorrect()))
                .toList();
        return new QuestionResponse(q.getId(), q.getText(), q.getCategory().getId(),
                q.getCategory().getName(), options);
    }

    @Transactional(readOnly = true)
    public PracticePage practice(Long categoryId, String q, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 50), Sort.by("id"));
        Page<Question> result = questionRepo.findByCategoryIdAndTextContainingIgnoreCase(
                categoryId, q == null ? "" : q.trim(), pageable);
        return new PracticePage(
                result.getContent().stream().map(this::toResponse).toList(),
                result.getNumber(), result.getTotalPages(), result.getTotalElements());
    }
}
