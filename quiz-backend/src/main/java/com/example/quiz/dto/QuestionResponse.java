package com.example.quiz.dto;

import java.util.List;

public record QuestionResponse (Long id, String text, Long categoryId,
                                String categoryName, List<OptionDto> options) {
}
