package com.example.quiz.controller;

import com.example.quiz.dto.PracticePage;
import com.example.quiz.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/practice")
@RequiredArgsConstructor
public class PracticeController {
    private final QuestionService service;

    @GetMapping("/questions")
    public PracticePage questions(@RequestParam Long categoryId,
                                  @RequestParam(required = false) String q,
                                  @RequestParam(defaultValue = "0") int page,
                                  @RequestParam(defaultValue = "10") int size) {
        return service.practice(categoryId, q, page, size);
    }
}
