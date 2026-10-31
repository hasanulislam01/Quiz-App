package com.example.quiz.dto;

import java.util.List;

public record PracticePage(List<QuestionResponse> items, int page, int totalPages, long totalItems) { }
