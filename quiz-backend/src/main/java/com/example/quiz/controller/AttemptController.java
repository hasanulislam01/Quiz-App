package com.example.quiz.controller;

import com.example.quiz.dto.AttemptDetail;
import com.example.quiz.dto.AttemptSummary;
import com.example.quiz.dto.StartRequest;
import com.example.quiz.dto.SubmitRequest;
import com.example.quiz.service.AttemptService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class AttemptController {
    private final AttemptService service;

    // ----- user -----
    @PostMapping("/api/attempts/start")
    public AttemptDetail start(@Valid @RequestBody StartRequest r, Authentication auth) {
        return service.start(auth.getName(), r.categoryId());
    }

    @GetMapping("/api/attempts/my")
    public List<AttemptSummary> mine(Authentication auth) {
        return service.mine(auth.getName());
    }

    @GetMapping("/api/attempts/{id}")
    public AttemptDetail get(@PathVariable Long id, Authentication auth) {
        return service.get(id, auth.getName(), false);
    }

    @PostMapping("/api/attempts/{id}/submit")
    public AttemptDetail submit(@PathVariable Long id, @Valid @RequestBody SubmitRequest r,
                                Authentication auth) {
        return service.submit(id, auth.getName(), r);
    }

    // ----- admin -----
    @GetMapping("/api/admin/attempts")
    public List<AttemptSummary> search(@RequestParam(required = false) Long categoryId,
                                       @RequestParam(required = false) Long userId) {
        return service.search(categoryId, userId);
    }

    @GetMapping("/api/admin/attempts/{id}")
    public AttemptDetail adminGet(@PathVariable Long id) {
        return service.get(id, null, true);
    }
}


// start from 20