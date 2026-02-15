package com.clustcare.auth;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.clustcare.config.JwtService;
import com.clustcare.model.Role;
import com.clustcare.model.User;
import com.clustcare.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
  private final UserRepository repository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final AuthenticationManager authenticationManager;

  public AuthenticationResponse register(RegisterRequest request) {
    if (repository.findByUsername(request.getUsername()).isPresent()) {
      throw new RuntimeException("Username already taken");
    }
    User user = User.builder()
        .firstName(request.getFirstName() != null ? request.getFirstName() : "")
        .lastName(request.getLastName() != null ? request.getLastName() : "")
        .username(request.getUsername())
        .password(passwordEncoder.encode(request.getPassword()))
        .role(Role.valueOf(request.getRole()))
        .build();
    repository.save(user);
    String jwtToken = jwtService.generateToken(user);
    return AuthenticationResponse.builder()
        .accessToken(jwtToken)
        .role(user.getRole().name())
        .build();
  }

  public AuthenticationResponse authenticate(AuthenticationRequest request) {
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            request.getUsername(),
            request.getPassword()
        )
    );
    User user = repository.findByUsername(request.getUsername())
        .orElseThrow(() -> new RuntimeException("User not found"));
    String jwtToken = jwtService.generateToken(user);
    return AuthenticationResponse.builder()
        .accessToken(jwtToken)
        .role(user.getRole().name())
        .build();
  }
}