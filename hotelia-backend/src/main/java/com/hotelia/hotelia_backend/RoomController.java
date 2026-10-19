
package com.hotelia.hotelia_backend.room;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "http://localhost:5173")
public class RoomController {

    private final RoomRepository roomRepository;

    public RoomController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @GetMapping
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoomById(@PathVariable Integer id) {
        return roomRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody Room room) {
        ResponseEntity<?> error = validateRoom(room);

        if (error != null) {
            return error;
        }

        Room savedRoom = roomRepository.save(room);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedRoom);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRoom(
            @PathVariable Integer id,
            @RequestBody Room updatedRoom) {

        ResponseEntity<?> error = validateRoom(updatedRoom);

        if (error != null) {
            return error;
        }

        return roomRepository.findById(id)
                .<ResponseEntity<?>>map(room -> {
                    room.setNumero(updatedRoom.getNumero());
                    room.setType(updatedRoom.getType());
                    room.setDescription(updatedRoom.getDescription());
                    room.setPrixParNuit(updatedRoom.getPrixParNuit());
                    room.setCapacite(updatedRoom.getCapacite());
                    room.setDisponible(updatedRoom.getDisponible());
                    room.setImage(updatedRoom.getImage());

                    return ResponseEntity.ok(roomRepository.save(room));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRoom(@PathVariable Integer id) {
        if (!roomRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        try {
            roomRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (DataIntegrityViolationException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                    Map.of(
                            "message",
                            "Impossible de supprimer cette chambre : elle peut être liée à des réservations ou à d'autres données."
                    )
            );
        }
    }

    private ResponseEntity<?> validateRoom(Room room) {
        if (room == null
                || room.getNumero() == null
                || room.getType() == null
                || room.getType().isBlank()
                || room.getDescription() == null
                || room.getDescription().isBlank()
                || room.getPrixParNuit() == null
                || room.getCapacite() == null
                || room.getDisponible() == null
                || room.getDisponible().isBlank()
                || room.getImage() == null
                || room.getImage().isBlank()) {

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "message",
                            "Veuillez remplir tous les champs obligatoires."
                    )
            );
        }

        if (room.getNumero() <= 0
                || room.getPrixParNuit() <= 0
                || room.getCapacite() <= 0) {

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "message",
                            "Le numéro, le prix et la capacité doivent être positifs."
                    )
            );
        }

        if (!room.getDisponible().equalsIgnoreCase("true")
                && !room.getDisponible().equalsIgnoreCase("false")) {

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "message",
                            "Le champ disponible doit être true ou false."
                    )
            );
        }

        return null;
    }
}
