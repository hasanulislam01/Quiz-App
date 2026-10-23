package com.example.quiz.dto;

import java.util.List;

public record ExamQuestionView(Long id, String text, List<ChoiceView> options) {
}
