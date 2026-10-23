package com.example.quiz.controller;

import com.example.quiz.dto.QuestionRequest;
import com.example.quiz.dto.QuestionResponse;
import com.example.quiz.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/questions")
@RequiredArgsConstructor
public class QuestionController {
    private final QuestionService service;

    @GetMapping
    public List<QuestionResponse> list(@RequestParam(required = false) Long categoryId) {
        return service.list(categoryId);
    }

    @GetMapping("/{id}")
    public QuestionResponse get(@PathVariable Long id) { return service.get(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public QuestionResponse create(@Valid @RequestBody QuestionRequest r) { return service.create(r); }

    @PutMapping("/{id}")
    public QuestionResponse update(@PathVariable Long id, @Valid @RequestBody QuestionRequest r) {
        return service.update(id, r);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { service.delete(id); }
}
