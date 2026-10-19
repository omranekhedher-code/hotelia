
package com.hotelia.hotelia_backend.payment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    List<Payment> findByReservationId(Integer reservationId);

    boolean existsByTransactionId(String transactionId);
}
