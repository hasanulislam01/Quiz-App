package com.example.quiz.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "quiz_option")
@Getter @Setter @NoArgsConstructor
public class QuizOption {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "question_id")
    private Question question;

    @Column(nullable = false)
    private String text;

    @Column(name = "is_correct", nullable = false)
    private boolean correct;
}