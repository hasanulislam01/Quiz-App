package com.example.quiz.dto;

import java.util.List;

public record DashboardResponse(long users, long categories, long questions, long attempts, int examQuestionCount, List<CategoryStat> categoryStats) {

}
