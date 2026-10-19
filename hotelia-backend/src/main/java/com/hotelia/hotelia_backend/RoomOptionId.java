package com.hotelia.hotelia_backend.roomoption;

import java.io.Serializable;
import java.util.Objects;

public class RoomOptionId implements Serializable {

    private Integer roomId;
    private Integer optionId;

    public RoomOptionId() {
    }

    public RoomOptionId(Integer roomId, Integer optionId) {
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

    @Override
    public boolean equals(Object object) {
        if (this == object) return true;
        if (!(object instanceof RoomOptionId that)) return false;

        return Objects.equals(roomId, that.roomId)
                && Objects.equals(optionId, that.optionId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(roomId, optionId);
    }
}