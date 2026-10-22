package com.example.quiz.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter @NoArgsConstructor
public class AttemptAnswer {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Attempt attempt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Question question;

    @ManyToOne(fetch = FetchType.LAZY)
    private QuizOption selectedOption;   // null when unanswered

    private boolean correct;
}