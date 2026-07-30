package com.erpcopilot.auth.dto;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        Long expiresIn,
        String email,
        String fullName,
        String role
) {}
