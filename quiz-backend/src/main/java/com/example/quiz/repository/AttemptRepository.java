package com.example.quiz.repository;

import com.example.quiz.entity.Attempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AttemptRepository extends JpaRepository<Attempt, Long> {
    List<Attempt> findByUserEmailOrderByStartedAtDesc(String email);

    @Query("select a from Attempt a where (:categoryId is null or a.category.id = :categoryId) "
            + "and (:userId is null or a.user.id = :userId) order by a.startedAt desc")
    List<Attempt> search(@Param("categoryId") Long categoryId, @Param("userId") Long userId);

    long countByUserId(Long userId);
}
