package com.example.quiz.dto;

public record ProfileResponse(Long id, String name, String email, String role, long attemptsTaken) { }
