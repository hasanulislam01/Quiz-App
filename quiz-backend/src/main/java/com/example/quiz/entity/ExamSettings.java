package com.example.quiz.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "exam_settings")
@Getter @Setter @NoArgsConstructor
public class ExamSettings {
    @Id
    private Long id = 1L;

    @Column(nullable = false)
    private int questionCount = 20;

    @Column(nullable = false)
    private int durationMinutes = 20;
}
