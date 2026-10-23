package com.example.quiz.dto;

import java.util.List;

public record ReviewItem(Long questionId, String text, List<ReviewOption> options,
                         Long selectedOptionId, boolean correct) {
}
