const Room = require("../models/Room");


// ==========================================
// GET ALL ROOMS
// GET /api/rooms
// ==========================================

const getAllRooms = async (req, res) => {

    try {

        const rooms = await Room.getAll();

        res.status(200).json(rooms);

    } catch (error) {

        console.error(
            "Erreur getAllRooms :",
            error
        );

        res.status(500).json({
            message: error.message
        });
    }
};


// ==========================================
// GET ROOM BY ID
// GET /api/rooms/:id
// ==========================================

const getRoomById = async (req, res) => {

    try {

        const { id } = req.params;

        const room = await Room.getById(id);


        if (!room) {

            return res.status(404).json({
                message: "Chambre introuvable"
            });

        }


        res.status(200).json(room);

    } catch (error) {

        console.error(
            "Erreur getRoomById :",
            error
        );

        res.status(500).json({
            message: error.message
        });
    }
};


// ==========================================
// CREATE ROOM
// POST /api/rooms
// ==========================================

const createRoom = async (req, res) => {

    try {

        console.log("BODY CREATE :", req.body);
        console.log("FILE CREATE :", req.file);


        // ==========================================
        // IMAGE
        // ==========================================

        let image = "imaged.png";


        // Si l'admin a choisi une image
        if (req.file) {

            image = req.file.filename;

        }


        // ==========================================
        // DONNÉES
        // ==========================================

        const roomData = {

            numero:
                req.body.numero,

            type:
                req.body.type,

            description:
                req.body.description || "",

            prix_par_nuit:
                req.body.prix_par_nuit,

            capacite:
                req.body.capacite,

            disponible:
                req.body.disponible === "true"
                    ? true
                    : req.body.disponible === "false"
                        ? false
                        : true,

            image:
                image
        };


        console.log(
            "ROOM DATA CREATE :",
            roomData
        );


        const room =
            await Room.create(roomData);


        res.status(201).json({

            message:
                "Chambre ajoutée avec succès",

            room

        });

    } catch (error) {

        console.error(
            "Erreur createRoom :",
            error
        );

        res.status(500).json({

            message:
                error.message

        });
    }
};


// ==========================================
// UPDATE ROOM
// PUT /api/rooms/:id
// ==========================================

const updateRoom = async (req, res) => {

    try {

        const { id } = req.params;


        console.log(
            "ID UPDATE :",
            id
        );

        console.log(
            "BODY UPDATE :",
            req.body
        );

        console.log(
            "FILE UPDATE :",
            req.file
        );


        // ==========================================
        // DONNÉES
        // ==========================================

        const roomData = {

            numero:
                req.body.numero,

            type:
                req.body.type,

            description:
                req.body.description || "",

            prix_par_nuit:
                req.body.prix_par_nuit,

            capacite:
                req.body.capacite,

            disponible:
                req.body.disponible === "true"
                    ? true
                    : req.body.disponible === "false"
                        ? false
                        : true
        };


        // ==========================================
        // IMAGE
        // ==========================================

        // Seulement si une nouvelle image est choisie
        if (req.file) {

            roomData.image =
                req.file.filename;

        }


        console.log(
            "ROOM DATA UPDATE :",
            roomData
        );


        const room =
            await Room.update(
                id,
                roomData
            );


        if (!room) {

            return res.status(404).json({

                message:
                    "Chambre introuvable"

            });

        }


        res.status(200).json({

            message:
                "Chambre modifiée avec succès",

            room

        });

    } catch (error) {

        console.error(
            "Erreur updateRoom :",
            error
        );

        res.status(500).json({

            message:
                error.message

        });
    }
};


// ==========================================
// DELETE ROOM
// DELETE /api/rooms/:id
// ==========================================

const deleteRoom = async (req, res) => {

    try {

        const { id } = req.params;


        const room =
            await Room.remove(id);


        if (!room) {

            return res.status(404).json({

                message:
                    "Chambre introuvable"

            });

        }


        res.status(200).json({

            message:
                "Chambre supprimée avec succès",

            room

        });

    } catch (error) {

        console.error(
            "Erreur deleteRoom :",
            error
        );

        res.status(500).json({

            message:
                error.message

        });
    }
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {

    getAllRooms,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom

};