package com.example.quiz.config;

import com.example.quiz.entity.*;
import com.example.quiz.repository.*;
import lombok.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final UserRepository userRepo;
    private final CategoryRepository categoryRepo;
    private final QuestionRepository questionRepo;
    private final ExamSettingsRepository settingsRepo;
    private final PasswordEncoder encoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepo.findByEmail("admin@quiz.com").isEmpty()) {
            User admin = new User();
            admin.setName("Admin");
            admin.setEmail("admin@quiz.com");
            admin.setPassword(encoder.encode("Admin@123"));
            admin.setRole(Role.ADMIN);
            userRepo.save(admin);
        }
        if (settingsRepo.count() == 0) {
            settingsRepo.save(new ExamSettings());   // 20 questions, 20 minutes
        }
        if (categoryRepo.count() == 0) {
            seed("General Knowledge", "Everyday facts about the world", new String[][] {
                    {"What is the capital of Japan?", "Tokyo", "Kyoto", "Osaka", "Seoul"},
                    {"Which is the largest planet in our solar system?", "Jupiter", "Saturn", "Earth", "Mars"},
                    {"What is the chemical formula of water?", "H2O", "CO2", "O2", "NaCl"},
                    {"Who wrote Romeo and Juliet?", "William Shakespeare", "Charles Dickens", "Mark Twain", "Jane Austen"},
                    {"Which is the largest ocean?", "Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Arctic Ocean"}
            });
            seed("Current Affairs", "News and world organisations", new String[][] {
                    {"Which organisation has its headquarters in New York and 193 member states?", "United Nations", "NATO", "European Union", "ASEAN"},
                    {"Which organisation is based in Geneva and leads global public health?", "World Health Organization", "UNESCO", "IMF", "World Bank"},
                    {"Which currency is used in most countries of the European Union?", "Euro", "Pound", "Dollar", "Franc"},
                    {"What does GDP stand for?", "Gross Domestic Product", "General Domestic Price", "Global Development Plan", "Gross Digital Product"},
                    {"What does AI stand for in technology news?", "Artificial Intelligence", "Automated Internet", "Applied Information", "Advanced Input"}
            });
            seed("Sports", "Games, athletes and tournaments", new String[][] {
                    {"How many players are on the pitch for one football team?", "11", "9", "10", "12"},
                    {"Which country won the 2011 Cricket World Cup?", "India", "Sri Lanka", "Australia", "Pakistan"},
                    {"How many rings are in the Olympic logo?", "5", "4", "6", "7"},
                    {"In which sport would you compete at Wimbledon?", "Tennis", "Golf", "Cricket", "Badminton"},
                    {"Which city hosted the Olympic Games delayed to 2021?", "Tokyo", "Paris", "Rio de Janeiro", "London"}
            });
            seed("IQ", "Logic, patterns and numbers", new String[][] {
                    {"What comes next: 2, 4, 8, 16, ?", "32", "24", "30", "20"},
                    {"What comes next: 1, 1, 2, 3, 5, 8, ?", "13", "11", "12", "15"},
                    {"If all roses are flowers and some flowers fade, which must be true?", "Some roses may fade", "All roses fade", "No roses fade", "All flowers are roses"},
                    {"What is 15 percent of 200?", "30", "15", "20", "25"},
                    {"Which number is the odd one out: 3, 5, 7, 9, 11?", "9", "3", "7", "11"}
            });
        }
    }

    // each row: question, correct answer, then three wrong answers
    private void seed(String name, String description, String[][] rows) {
        Category c = new Category();
        c.setName(name);
        c.setDescription(description);
        categoryRepo.save(c);
        for (String[] row : rows) {
            Question q = new Question();
            q.setCategory(c);
            q.setText(row[0]);
            for (int i = 1; i < row.length; i++) {
                QuizOption o = new QuizOption();
                o.setText(row[i]);
                o.setCorrect(i == 1);
                q.addOption(o);
            }
            questionRepo.save(q);
        }
    }
}