package com.hotelia.hotelia_backend.roomoption;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RoomOptionRepository
        extends JpaRepository<RoomOption, RoomOptionId> {

    List<RoomOption> findByRoomId(Integer roomId);

    List<RoomOption> findByOptionId(Integer optionId);

    boolean existsByRoomIdAndOptionId(
            Integer roomId,
            Integer optionId);
}