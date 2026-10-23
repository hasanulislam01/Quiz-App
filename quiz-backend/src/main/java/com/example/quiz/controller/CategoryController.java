package com.example.quiz.controller;

import com.example.quiz.dto.*;
import com.example.quiz.entity.*;
import com.example.quiz.exception.ApiException;
import com.example.quiz.repository.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryRepository categoryRepo;
    private final QuestionRepository questionRepo;

    @GetMapping({"/api/categories", "/api/admin/categories"})
    public List<CategoryResponse> list() {
        return categoryRepo.findAll().stream().map(this::toResponse).toList();
    }

    @PostMapping("/api/admin/categories")
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryResponse create(@Valid @RequestBody CategoryRequest r) {
        String name = r.name().trim();
        if (categoryRepo.existsByName(name)) {
            throw new ApiException(HttpStatus.CONFLICT, "A category with this name already exists");
        }
        Category c = new Category();
        c.setName(name);
        c.setDescription(r.description());
        return toResponse(categoryRepo.save(c));
    }

    @PutMapping("/api/admin/categories/{id}")
    public CategoryResponse update(@PathVariable Long id, @Valid @RequestBody CategoryRequest r) {
        Category c = find(id);
        String name = r.name().trim();
        if (!c.getName().equals(name) && categoryRepo.existsByName(name)) {
            throw new ApiException(HttpStatus.CONFLICT, "A category with this name already exists");
        }
        c.setName(name);
        c.setDescription(r.description());
        return toResponse(categoryRepo.save(c));
    }

    @DeleteMapping("/api/admin/categories/{id}")
    public void delete(@PathVariable Long id) {
        Category c = find(id);
        if (questionRepo.countByCategoryId(id) > 0) {
            throw new ApiException(HttpStatus.CONFLICT,
                    "This category still has questions. Delete or move them first.");
        }
        categoryRepo.delete(c);
    }

    private Category find(Long id) {
        return categoryRepo.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Category not found"));
    }

    private CategoryResponse toResponse(Category c) {
        return new CategoryResponse(c.getId(), c.getName(), c.getDescription(),
                questionRepo.countByCategoryId(c.getId()));
    }
}
