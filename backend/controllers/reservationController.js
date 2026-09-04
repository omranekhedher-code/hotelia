const Reservation = require("../models/Reservation");


// ==========================================
// GET /api/reservations
// Toutes les réservations
// ADMIN
// ==========================================

const getAllReservations = async (req, res) => {

    try {

        const reservations =
            await Reservation.getAll();

        res.status(200).json(reservations);

    } catch (error) {

        console.error(
            "Erreur getAllReservations :",
            error
        );

        res.status(500).json({
            message: error.message
        });

    }

};


// ==========================================
// GET /api/reservations/:id
// Une réservation
// ==========================================

const getReservationById = async (req, res) => {

    try {

        const { id } = req.params;

        const reservation =
            await Reservation.getById(id);


        if (!reservation) {

            return res.status(404).json({

                message:
                    "Réservation introuvable"

            });

        }


        res.status(200).json(reservation);

    } catch (error) {

        console.error(
            "Erreur getReservationById :",
            error
        );

        res.status(500).json({

            message:
                error.message

        });

    }

};


// ==========================================
// GET /api/reservations/user/:userId
// Réservations d'un utilisateur
// ==========================================

const getReservationsByUser = async (req, res) => {

    try {

        const { userId } = req.params;

        const reservations =
            await Reservation.getByUser(userId);


        res.status(200).json(reservations);

    } catch (error) {

        console.error(
            "Erreur getReservationsByUser :",
            error
        );

        res.status(500).json({

            message:
                error.message

        });

    }

};


// ==========================================
// POST /api/reservations
// Créer une réservation
// ==========================================

const createReservation = async (req, res) => {

    try {

        // ======================================
        // USER CONNECTÉ
        // ======================================

        if (!req.user || !req.user.id) {

            return res.status(401).json({

                message:
                    "Utilisateur non authentifié"

            });

        }


        const {

            room_id,
            date_arriv,
            date_depart,
            nb_per,
            prix_total

        } = req.body;


        // ======================================
        // VALIDATION
        // ======================================

        if (
            !room_id ||
            !date_arriv ||
            !date_depart ||
            !nb_per ||
            prix_total === undefined
        ) {

            return res.status(400).json({

                message:
                    "Données de réservation incomplètes"

            });

        }


        // ======================================
        // DATE
        // ======================================

        const arrivee =
            new Date(date_arriv);

        const depart =
            new Date(date_depart);


        if (
            isNaN(arrivee.getTime()) ||
            isNaN(depart.getTime())
        ) {

            return res.status(400).json({

                message:
                    "Dates invalides"

            });

        }


        if (depart <= arrivee) {

            return res.status(400).json({

                message:
                    "La date de départ doit être après la date d'arrivée."

            });

        }


        // ======================================
        // CRÉER RÉSERVATION
        // ======================================

        const reservation =
            await Reservation.create({

                user_id: req.user.id,

                room_id,

                date_arriv,

                date_depart,

                nb_per,

                prix_total,

                // Pas encore payé
                solde: prix_total,

                status: "en attente"

            });


        res.status(201).json({

            message:
                "Réservation créée avec succès",

            reservation

        });

    } catch (error) {

        console.error(
            "Erreur createReservation :",
            error
        );

        res.status(500).json({

            message:
                error.message

        });

    }

};


// ==========================================
// PUT /api/reservations/:id
// Modifier une réservation
// ==========================================

const updateReservation = async (req, res) => {

    try {

        const { id } = req.params;


        const reservation =
            await Reservation.update(
                id,
                req.body
            );


        if (!reservation) {

            return res.status(404).json({

                message:
                    "Réservation introuvable"

            });

        }


        res.status(200).json({

            message:
                "Réservation modifiée avec succès",

            reservation

        });

    } catch (error) {

        console.error(
            "Erreur updateReservation :",
            error
        );

        res.status(500).json({

            message:
                error.message

        });

    }

};


// ==========================================
// DELETE /api/reservations/:id
// Supprimer une réservation
// ==========================================

const deleteReservation = async (req, res) => {

    try {

        const { id } = req.params;


        const reservation =
            await Reservation.remove(id);


        if (!reservation) {

            return res.status(404).json({

                message:
                    "Réservation introuvable"

            });

        }


        res.status(200).json({

            message:
                "Réservation supprimée avec succès",

            reservation

        });

    } catch (error) {

        console.error(
            "Erreur deleteReservation :",
            error
        );

        res.status(500).json({

            message:
                error.message

        });

    }

};


module.exports = {

    getAllReservations,

    getReservationById,

    getReservationsByUser,

    createReservation,

    updateReservation,

    deleteReservation

};