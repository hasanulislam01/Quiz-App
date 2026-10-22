package com.example.quiz.controller;

import com.example.quiz.dto.AuthResponse;
import com.example.quiz.dto.LoginRequest;
import com.example.quiz.dto.RegisterRequest;
import com.example.quiz.entity.Role;
import com.example.quiz.entity.User;
import com.example.quiz.exception.ApiException;
import com.example.quiz.repository.UserRepository;
import com.example.quiz.security.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authManager;
    private final JwtService jwtService;

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest r) {
        String email = r.email().trim().toLowerCase();
        if (userRepo.existsByEmail(email)) {
            throw new ApiException(HttpStatus.CONFLICT, "Email already registered");
        }
        User u = new User();
        u.setName(r.name().trim());
        u.setEmail(email);
        u.setPassword(encoder.encode(r.password()));
        u.setRole(Role.USER);
        userRepo.save(u);
        return toResponse(u);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest r) {
        String email = r.email().trim().toLowerCase();
        authManager.authenticate(new UsernamePasswordAuthenticationToken(email, r.password()));
        User u = userRepo.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));
        return toResponse(u);
    }

    private AuthResponse toResponse(User u) {
        return new AuthResponse(jwtService.generateToken(u.getEmail(), u.getRole().name()),
                u.getName(), u.getEmail(), u.getRole().name());
    }
}
