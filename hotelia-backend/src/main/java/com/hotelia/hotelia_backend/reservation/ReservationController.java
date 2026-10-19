
package com.hotelia.hotelia_backend.reservation;

import com.hotelia.hotelia_backend.room.Room;
import com.hotelia.hotelia_backend.room.RoomRepository;
import com.hotelia.hotelia_backend.user.User;
import com.hotelia.hotelia_backend.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:5173")
public class ReservationController {

    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public ReservationController(
            ReservationRepository reservationRepository,
            RoomRepository roomRepository,
            UserRepository userRepository) {
        this.reservationRepository = reservationRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getReservationById(@PathVariable Integer id) {
        return reservationRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Réservation introuvable.")));
    }

    @GetMapping("/user/{userId}")
    public List<Reservation> getReservationsByUser(@PathVariable Integer userId) {
        return reservationRepository.findAll().stream()
                .filter(reservation -> reservation.getUserId().equals(userId))
                .toList();
    }


@PutMapping("/{id}/cancel")
public ResponseEntity<?> cancelReservation(@PathVariable Integer id) {

    Reservation reservation = reservationRepository.findById(id)
            .orElse(null);

    if (reservation == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Réservation introuvable."));
    }

    String status = reservation.getStatus();

    if (status != null &&
            (status.equalsIgnoreCase("annulée")
                    || status.equalsIgnoreCase("annulee")
                    || status.equalsIgnoreCase("cancelled")
                    || status.equalsIgnoreCase("canceled"))) {
        return ResponseEntity.badRequest()
                .body(Map.of("message", "Cette réservation est déjà annulée."));
    }

    reservation.setStatus("Annulée");
    Reservation updated = reservationRepository.save(reservation);

    return ResponseEntity.ok(updated);
}


    @PostMapping
    public ResponseEntity<?> createReservation(@RequestBody Reservation reservation) {

        if (reservation.getUserId() == null
                || reservation.getRoomId() == null
                || reservation.getDateArriv() == null
                || reservation.getDateDepart() == null
                || reservation.getNbPer() == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Veuillez remplir tous les champs obligatoires."));
        }

        if (!reservation.getDateDepart().isAfter(reservation.getDateArriv())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "La date de départ doit être après la date d'arrivée."));
        }

        if (reservation.getNbPer() <= 0) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Le nombre de personnes doit être supérieur à zéro."));
        }

        User user = userRepository.findById(reservation.getUserId()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Utilisateur introuvable."));
        }

        Room room = roomRepository.findById(reservation.getRoomId()).orElse(null);
        if (room == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Chambre introuvable."));
        }


        if (reservationRepository.existsOverlappingReservation(
            reservation.getRoomId(),
            reservation.getDateArriv(),
            reservation.getDateDepart())) {

    return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(Map.of(
                    "message",
                    "Cette chambre est déjà réservée pour ces dates."
            ));
    }


        if (reservation.getNbPer() > room.getCapacite()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Le nombre de personnes dépasse la capacité de la chambre."));
        }

        if (room.getPrixParNuit() == null || room.getPrixParNuit() <= 0) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Le prix de la chambre est invalide."));
        }

        long nights = java.time.temporal.ChronoUnit.DAYS.between(
                reservation.getDateArriv(), reservation.getDateDepart());

        float total = room.getPrixParNuit() * nights;

        reservation.setPrixTotal(total);
        reservation.setSolde(total);
        reservation.setStatus("En attente");
        reservation.setId(null);

        Reservation saved = reservationRepository.save(reservation);

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
