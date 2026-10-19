package com.hotelia.hotelia_backend.roomoption;

import com.hotelia.hotelia_backend.option.Option;
import java.util.ArrayList;

import com.hotelia.hotelia_backend.option.OptionRepository;
import com.hotelia.hotelia_backend.room.RoomRepository;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/room-options")
@CrossOrigin(origins = "http://localhost:5173")
public class RoomOptionController {

    private final RoomOptionRepository roomOptionRepository;
    private final RoomRepository roomRepository;
    private final OptionRepository optionRepository;

    public RoomOptionController(
            RoomOptionRepository roomOptionRepository,
            RoomRepository roomRepository,
            OptionRepository optionRepository) {
        this.roomOptionRepository = roomOptionRepository;
        this.roomRepository = roomRepository;
        this.optionRepository = optionRepository;
    }

    // Afficher les options associées à une chambre
    @GetMapping("/room/{roomId}")
    public ResponseEntity<?> getOptionsByRoom(
            @PathVariable Integer roomId) {

        if (!roomRepository.existsById(roomId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Chambre introuvable."));
        }

        List<RoomOption> options =
                roomOptionRepository.findByRoomId(roomId);

        return ResponseEntity.ok(options);
    }

    // Associer une option à une chambre
    @PostMapping
    public ResponseEntity<?> addOptionToRoom(
            @RequestBody RoomOption request) {

        Integer roomId = request.getRoomId();
        Integer optionId = request.getOptionId();

        if (roomId == null || optionId == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "roomId et optionId sont obligatoires."));
        }

        if (!roomRepository.existsById(roomId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Chambre introuvable."));
        }

        if (!optionRepository.existsById(optionId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Option introuvable."));
        }

        if (roomOptionRepository.existsByRoomIdAndOptionId(
                roomId, optionId)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "message",
                            "Cette option est déjà associée à cette chambre."));
        }

        try {
            RoomOption saved =
                    roomOptionRepository.save(
                            new RoomOption(roomId, optionId));

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(saved);

        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "message",
                            "Impossible de créer cette association."));
        }
    }
    @GetMapping("/room/{roomId}/details")
public ResponseEntity<?> getOptionDetailsByRoom(
        @PathVariable Integer roomId) {

    if (!roomRepository.existsById(roomId)) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Chambre introuvable."));
    }

    List<RoomOption> associations =
            roomOptionRepository.findByRoomId(roomId);

    List<Option> options = new ArrayList<>();

    for (RoomOption association : associations) {
        optionRepository.findById(association.getOptionId())
                .ifPresent(options::add);
    }

    return ResponseEntity.ok(options);
}
    // Supprimer une association sans supprimer l'option
    @DeleteMapping("/room/{roomId}/option/{optionId}")
    public ResponseEntity<?> removeOptionFromRoom(
            @PathVariable Integer roomId,
            @PathVariable Integer optionId) {

        RoomOptionId id = new RoomOptionId(roomId, optionId);

        if (!roomOptionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        roomOptionRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}