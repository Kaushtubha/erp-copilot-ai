package com.erpcopilot.auth.service;

import com.erpcopilot.auth.dto.*;
import com.erpcopilot.auth.entity.User;
import com.erpcopilot.auth.repository.UserRepository;
import com.erpcopilot.auth.security.JwtService;
import com.erpcopilot.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;

/**
 * Authentication service handling login, registration, and token lifecycle.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final StringRedisTemplate redisTemplate;

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        // Store refresh token in Redis
        redisTemplate.opsForValue().set(
                "refresh:" + user.getEmail(),
                refreshToken,
                Duration.ofMillis(jwtService.getRefreshExpirationMs())
        );

        log.info("User logged in: {}", user.getEmail());
        return buildAuthResponse(user, accessToken, refreshToken);
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email already registered: " + request.email());
        }

        User user = User.builder()
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .fullName(request.fullName())
                .role(User.Role.valueOf(request.role()))
                .department(request.department())
                .build();

        user = userRepository.save(user);
        log.info("New user registered: {} with role {}", user.getEmail(), user.getRole());

        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        return buildAuthResponse(user, accessToken, refreshToken);
    }

    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String email = jwtService.extractUsername(request.refreshToken());
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String storedToken = redisTemplate.opsForValue().get("refresh:" + email);
        if (!request.refreshToken().equals(storedToken)) {
            throw new SecurityException("Invalid refresh token");
        }

        String newAccessToken = jwtService.generateToken(user);
        String newRefreshToken = jwtService.generateRefreshToken(user);

        redisTemplate.opsForValue().set(
                "refresh:" + email,
                newRefreshToken,
                Duration.ofMillis(jwtService.getRefreshExpirationMs())
        );

        return buildAuthResponse(user, newAccessToken, newRefreshToken);
    }

    public void logout(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7);
            String email = jwtService.extractUsername(jwt);
            // Blacklist the token and remove refresh token
            redisTemplate.opsForValue().set("blacklist:" + jwt, "true", Duration.ofHours(1));
            redisTemplate.delete("refresh:" + email);
            log.info("User logged out: {}", email);
        }
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return new UserProfileResponse(
                user.getId().toString(),
                user.getEmail(),
                user.getFullName(),
                user.getRole().name(),
                user.getDepartment()
        );
    }

    private AuthResponse buildAuthResponse(User user, String accessToken, String refreshToken) {
        return new AuthResponse(
                accessToken,
                refreshToken,
                "Bearer",
                3600L,
                user.getEmail(),
                user.getFullName(),
                user.getRole().name()
        );
    }
}
