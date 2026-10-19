
package com.hotelia.hotelia_backend.promotion;

import com.hotelia.hotelia_backend.room.RoomRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/promotions")
@CrossOrigin(origins = "http://localhost:5173")
public class PromotionController {

    private final PromotionRepository promotionRepository;
    private final RoomRepository roomRepository;

    public PromotionController(
            PromotionRepository promotionRepository,
            RoomRepository roomRepository) {
        this.promotionRepository = promotionRepository;
        this.roomRepository = roomRepository;
    }

    @GetMapping
    public ResponseEntity<?> getAll(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer roomId) {

        if (status != null && !status.isBlank()) {
            return ResponseEntity.ok(
                    promotionRepository.findByStatusIgnoreCase(status.trim()));
        }

        if (roomId != null) {
            return ResponseEntity.ok(
                    promotionRepository.findByRoomId(roomId));
        }

        return ResponseEntity.ok(promotionRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id) {
        return promotionRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Promotion promotion) {
        ResponseEntity<?> error = validate(promotion);

        if (error != null) {
            return error;
        }

        if (promotion.getRoomId() != null
                && !roomRepository.existsById(promotion.getRoomId())) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "La chambre indiquée n'existe pas."));
        }

        promotion.setId(null);

        if (promotion.getStatus() == null
                || promotion.getStatus().isBlank()) {
            promotion.setStatus("active");
        }

        promotion.setCreatedAt(null);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(promotionRepository.save(promotion));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable Integer id,
            @RequestBody Promotion updated) {

        ResponseEntity<?> error = validate(updated);

        if (error != null) {
            return error;
        }

        if (updated.getRoomId() != null
                && !roomRepository.existsById(updated.getRoomId())) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "La chambre indiquée n'existe pas."));
        }

        return promotionRepository.findById(id)
                .<ResponseEntity<?>>map(promotion -> {
                    promotion.setTitre(updated.getTitre());
                    promotion.setReduction(updated.getReduction());
                    promotion.setRoomId(updated.getRoomId());
                    promotion.setDateDebut(updated.getDateDebut());
                    promotion.setDateFin(updated.getDateFin());

                    if (updated.getStatus() != null
                            && !updated.getStatus().isBlank()) {
                        promotion.setStatus(updated.getStatus());
                    }

                    return ResponseEntity.ok(
                            promotionRepository.save(promotion));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        if (!promotionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        try {
            promotionRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (DataIntegrityViolationException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                    Map.of("message",
                            "Suppression impossible : la promotion est référencée."));
        }
    }

    private ResponseEntity<?> validate(Promotion promotion) {
        if (promotion.getTitre() == null
                || promotion.getTitre().isBlank()
                || promotion.getReduction() == null
                || promotion.getDateDebut() == null
                || promotion.getDateFin() == null) {
            return ResponseEntity.badRequest().body(
                    Map.of("message",
                            "Titre, réduction et dates sont obligatoires."));
        }

        if (promotion.getReduction().compareTo(BigDecimal.ZERO) <= 0
                || promotion.getReduction().compareTo(
                        new BigDecimal("100")) > 0) {
            return ResponseEntity.badRequest().body(
                    Map.of("message",
                            "La réduction doit être supérieure à 0 et inférieure ou égale à 100."));
        }

        if (promotion.getDateFin().isBefore(promotion.getDateDebut())) {
            return ResponseEntity.badRequest().body(
                    Map.of("message",
                            "La date de fin doit être postérieure ou égale à la date de début."));
        }

        return null;
    }
}
