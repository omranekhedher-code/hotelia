
package com.hotelia.hotelia_backend.review;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {

    List<Review> findByRoomId(Integer roomId);

    List<Review> findByUserId(Integer userId);
}
