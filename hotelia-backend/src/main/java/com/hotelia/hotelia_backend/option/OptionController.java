package com.hotelia.hotelia_backend.option;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/options")
@CrossOrigin(origins = "http://localhost:5173")
public class OptionController {

    private final OptionRepository optionRepository;

    public OptionController(OptionRepository optionRepository) {
        this.optionRepository = optionRepository;
    }

    // Afficher toutes les options
    @GetMapping
    public List<Option> getAllOptions() {
        return optionRepository.findAll();
    }

    // Afficher une option par ID
    @GetMapping("/{id}")
    public ResponseEntity<Option> getOptionById(@PathVariable Integer id) {
        return optionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Ajouter une option
    @PostMapping
    public ResponseEntity<?> createOption(@RequestBody Option option) {

        if (option.getNom() == null || option.getNom().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Le nom de l'option est obligatoire."));
        }

        String nom = option.getNom().trim();

        if (optionRepository.existsByNomIgnoreCase(nom)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Cette option existe déjà."));
        }

        option.setId(null);
        option.setNom(nom);

        Option savedOption = optionRepository.save(option);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedOption);
    }

    // Modifier une option
    @PutMapping("/{id}")
    public ResponseEntity<?> updateOption(
            @PathVariable Integer id,
            @RequestBody Option option) {

        if (option.getNom() == null || option.getNom().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Le nom de l'option est obligatoire."));
        }

        return optionRepository.findById(id)
                .map(existingOption -> {
                    String nom = option.getNom().trim();

                    boolean duplicate = optionRepository.findAll().stream()
                            .anyMatch(other ->
                                    !other.getId().equals(id)
                                    && other.getNom() != null
                                    && other.getNom().equalsIgnoreCase(nom));

                    if (duplicate) {
                        return ResponseEntity.status(HttpStatus.CONFLICT)
                                .body(Map.of("message", "Cette option existe déjà."));
                    }

                    existingOption.setNom(nom);

                    return ResponseEntity.ok(optionRepository.save(existingOption));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Supprimer une option
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOption(@PathVariable Integer id) {

        if (!optionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        try {
            optionRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "message",
                            "Cette option est liée à une ou plusieurs chambres. Supprimez d'abord ses associations."
                    ));
        }
    }
}