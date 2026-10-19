
package com.hotelia.hotelia_backend.promotion;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PromotionRepository
        extends JpaRepository<Promotion, Integer> {

    List<Promotion> findByRoomId(Integer roomId);

    List<Promotion> findByStatusIgnoreCase(String status);
}
