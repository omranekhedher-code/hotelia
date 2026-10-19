
package com.hotelia.hotelia_backend.reservation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;

public interface ReservationRepository
        extends JpaRepository<Reservation, Integer> {

    @Query("""
        SELECT COUNT(r) > 0
        FROM Reservation r
        WHERE r.roomId = :roomId
          AND LOWER(r.status) NOT LIKE 'annul%'
          AND LOWER(r.status) NOT IN ('cancelled', 'canceled')
          AND r.dateArriv < :dateDepart
          AND r.dateDepart > :dateArriv
        """)
    boolean existsOverlappingReservation(
            @Param("roomId") Integer roomId,
            @Param("dateArriv") LocalDate dateArriv,
            @Param("dateDepart") LocalDate dateDepart
    );
}
