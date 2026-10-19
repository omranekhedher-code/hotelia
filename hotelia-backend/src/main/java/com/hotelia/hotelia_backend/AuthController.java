package com.hotelia.hotelia_backend;

import com.hotelia.hotelia_backend.user.User;
import com.hotelia.hotelia_backend.user.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public record SignupRequest(
            String nom,
            String prenom,
            String email,
            String password,
            String telephone) {
    }

    public record LoginRequest(
            String email,
            String password) {
    }

    public record UserResponse(
            Integer id,
            String nom,
            String prenom,
            String email,
            String telephone,
            String role) {
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {

        if (request.nom() == null || request.nom().isBlank()
                || request.prenom() == null || request.prenom().isBlank()
                || request.email() == null || request.email().isBlank()
                || request.password() == null || request.password().isBlank()
                || request.telephone() == null || request.telephone().isBlank()) {

            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Tous les champs sont obligatoires."));
        }

        String email = request.email().trim();

        if (!email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Adresse email invalide."));
        }

        if (request.password().length() < 8) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message",
                            "Le mot de passe doit contenir au moins 8 caractères."));
        }

        if (userRepository.existsByEmailIgnoreCase(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Cette adresse email est déjà utilisée."));
        }

        User user = new User();
        user.setNom(request.nom().trim());
        user.setPrenom(request.prenom().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setTelephone(request.telephone().trim());
        user.setRole("USER");

        User savedUser = userRepository.save(user);

        UserResponse response = new UserResponse(
                savedUser.getId(),
                savedUser.getNom(),
                savedUser.getPrenom(),
                savedUser.getEmail(),
                savedUser.getTelephone(),
                savedUser.getRole());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        if (request.email() == null || request.email().isBlank()
                || request.password() == null || request.password().isBlank()) {

            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email et mot de passe obligatoires."));
        }

        User user = userRepository
                .findByEmailIgnoreCase(request.email().trim())
                .orElse(null);

        if (user == null
                || !passwordEncoder.matches(request.password(), user.getPassword())) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Email ou mot de passe incorrect."));
        }

        UserResponse response = new UserResponse(
                user.getId(),
                user.getNom(),
                user.getPrenom(),
                user.getEmail(),
                user.getTelephone(),
                user.getRole());

        return ResponseEntity.ok(response);
    }
}