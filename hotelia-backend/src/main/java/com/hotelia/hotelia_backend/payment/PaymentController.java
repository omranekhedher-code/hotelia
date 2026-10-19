
package com.hotelia.hotelia_backend.payment;

import com.hotelia.hotelia_backend.reservation.Reservation;
import com.hotelia.hotelia_backend.reservation.ReservationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    private final PaymentRepository paymentRepository;
    private final ReservationRepository reservationRepository;

    public PaymentController(
            PaymentRepository paymentRepository,
            ReservationRepository reservationRepository) {
        this.paymentRepository = paymentRepository;
        this.reservationRepository = reservationRepository;
    }

    @GetMapping
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPaymentById(@PathVariable Integer id) {
        return paymentRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Paiement introuvable.")));
    }

    @GetMapping("/reservation/{reservationId}")
    public ResponseEntity<?> getPaymentsByReservation(
            @PathVariable Integer reservationId) {

        if (!reservationRepository.existsById(reservationId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Réservation introuvable."));
        }

        return ResponseEntity.ok(
                paymentRepository.findByReservationId(reservationId));
    }

    @PostMapping
    public ResponseEntity<?> createPayment(@RequestBody Payment payment) {

        if (payment.getReservationId() == null
                || payment.getMontant() == null
                || payment.getModePaiement() == null
                || payment.getModePaiement().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Veuillez remplir les champs obligatoires."));
        }

        if (payment.getMontant() <= 0) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Le montant doit être supérieur à zéro."));
        }

        Reservation reservation = reservationRepository
                .findById(payment.getReservationId()).orElse(null);

        if (reservation == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Réservation introuvable."));
        }

        if (reservation.getSolde() == null || reservation.getSolde() <= 0) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Cette réservation ne possède aucun solde à payer."));
        }

        if (payment.getMontant() > reservation.getSolde()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Le montant dépasse le solde restant."));
        }

        payment.setId(null);
        payment.setDatePaiement(LocalDate.now());
        payment.setTransactionId(UUID.randomUUID().toString());
        payment.setStatus("En attente");

        Payment savedPayment = paymentRepository.save(payment);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedPayment);
    }
}
