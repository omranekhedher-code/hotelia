
package com.hotelia.hotelia_backend.review;

import com.hotelia.hotelia_backend.room.RoomRepository;
import com.hotelia.hotelia_backend.user.UserRepository;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public ReviewController(
            ReviewRepository reviewRepository,
            RoomRepository roomRepository,
            UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> getAll(
            @RequestParam(required = false) Integer roomId,
            @RequestParam(required = false) Integer userId) {

        if (roomId != null) {
            return ResponseEntity.ok(reviewRepository.findByRoomId(roomId));
        }

        if (userId != null) {
            return ResponseEntity.ok(reviewRepository.findByUserId(userId));
        }

        return ResponseEntity.ok(reviewRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id) {
        return reviewRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Review review) {
        ResponseEntity<?> error = validate(review);

        if (error != null) {
            return error;
        }

        if (review.getUserId() != null
                && !userRepository.existsById(review.getUserId())) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "L'utilisateur indiqué n'existe pas."));
        }

        if (review.getRoomId() != null
                && !roomRepository.existsById(review.getRoomId())) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "La chambre indiquée n'existe pas."));
        }

        review.setId(null);
        review.setCreatedAt(null);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reviewRepository.save(review));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable Integer id,
            @RequestBody Review updated) {

        ResponseEntity<?> error = validate(updated);

        if (error != null) {
            return error;
        }

        if (updated.getUserId() != null
                && !userRepository.existsById(updated.getUserId())) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "L'utilisateur indiqué n'existe pas."));
        }

        if (updated.getRoomId() != null
                && !roomRepository.existsById(updated.getRoomId())) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "La chambre indiquée n'existe pas."));
        }

        return reviewRepository.findById(id)
                .<ResponseEntity<?>>map(review -> {
                    review.setUserId(updated.getUserId());
                    review.setRoomId(updated.getRoomId());
                    review.setRating(updated.getRating());
                    review.setComment(updated.getComment());

                    return ResponseEntity.ok(reviewRepository.save(review));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        if (!reviewRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        try {
            reviewRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (DataIntegrityViolationException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                    Map.of("message", "Suppression impossible."));
        }
    }

    private ResponseEntity<?> validate(Review review) {
        if (review.getRating() == null
                || review.getRating() < 1
                || review.getRating() > 5) {
            return ResponseEntity.badRequest().body(
                    Map.of("message",
                            "La note doit être comprise entre 1 et 5."));
        }

        return null;
    }
}
