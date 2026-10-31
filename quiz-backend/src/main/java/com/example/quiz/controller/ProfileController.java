package com.example.quiz.controller;

import com.example.quiz.dto.ChangePasswordRequest;
import com.example.quiz.dto.MessageResponse;
import com.example.quiz.dto.ProfileResponse;
import com.example.quiz.entity.User;
import com.example.quiz.exception.ApiException;
import com.example.quiz.repository.AttemptRepository;
import com.example.quiz.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {
    private final UserRepository userRepo;
    private final AttemptRepository attemptRepo;
    private final PasswordEncoder encoder;

    @GetMapping
    public ProfileResponse get(Authentication auth) {
        User u = find(auth.getName());
        return new ProfileResponse(u.getId(), u.getName(), u.getEmail(),
                u.getRole().name(), attemptRepo.countByUserId(u.getId()));
    }

    @PutMapping("/password")
    public MessageResponse changePassword(@Valid @RequestBody ChangePasswordRequest r,
                                          Authentication auth) {
        User u = find(auth.getName());
        if (!encoder.matches(r.currentPassword(), u.getPassword())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Current password is incorrect");
        }
        if (encoder.matches(r.newPassword(), u.getPassword())) {
            throw new ApiException(HttpStatus.BAD_REQUEST,
                    "New password must be different from the current one");
        }
        u.setPassword(encoder.encode(r.newPassword()));
        userRepo.save(u);
        return new MessageResponse("Password updated");
    }

    private User find(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
    }
}
