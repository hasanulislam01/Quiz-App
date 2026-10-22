package com.example.quiz.repository;

import com.example.quiz.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByCategoryId(Long categoryId);
    long countByCategoryId(Long categoryId);

    @Query(value = "SELECT * FROM question WHERE category_id = :cid ORDER BY RAND() LIMIT :n",
            nativeQuery = true)
    List<Question> findRandomByCategory(@Param("cid") Long categoryId, @Param("n") int n);
}
