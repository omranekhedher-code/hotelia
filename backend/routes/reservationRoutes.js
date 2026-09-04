const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
    getAllReservations,
    getReservationById,
    getReservationsByUser,
    createReservation,
    updateReservation,
    deleteReservation
} = require("../controllers/reservationController");


// ==========================================
// GET ALL RESERVATIONS
// /api/reservations
// ==========================================

router.get(
    "/",
    getAllReservations
);


// ==========================================
// GET RESERVATIONS BY USER
// /api/reservations/user/:userId
// ==========================================

router.get(
    "/user/:userId",
    getReservationsByUser
);


// ==========================================
// GET RESERVATION BY ID
// /api/reservations/:id
// ==========================================

router.get(
    "/:id",
    getReservationById
);


// ==========================================
// CREATE RESERVATION
// /api/reservations
// AUTH REQUIRED
// ==========================================

router.post(
    "/",
    auth,
    createReservation
);


// ==========================================
// UPDATE RESERVATION
// /api/reservations/:id
// ==========================================

router.put(
    "/:id",
    auth,
    updateReservation
);


// ==========================================
// DELETE RESERVATION
// /api/reservations/:id
// ==========================================

router.delete(
    "/:id",
    auth,
    deleteReservation
);


module.exports = router;