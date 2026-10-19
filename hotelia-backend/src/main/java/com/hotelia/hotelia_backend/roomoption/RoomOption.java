package com.hotelia.hotelia_backend.roomoption;

import com.hotelia.hotelia_backend.option.Option;
import com.hotelia.hotelia_backend.room.Room;
import jakarta.persistence.*;

@Entity
@Table(name = "room_options")
@IdClass(RoomOptionId.class)
public class RoomOption {

    @Id
    @Column(name = "room_id")
    private Integer roomId;

    @Id
    @Column(name = "option_id")
    private Integer optionId;

    public RoomOption() {
    }

    public RoomOption(Integer roomId, Integer optionId) {
        this.roomId = roomId;
        this.optionId = optionId;
    }

    public Integer getRoomId() {
        return roomId;
    }

    public void setRoomId(Integer roomId) {
        this.roomId = roomId;
    }

    public Integer getOptionId() {
        return optionId;
    }

    public void setOptionId(Integer optionId) {
        this.optionId = optionId;
    }
}