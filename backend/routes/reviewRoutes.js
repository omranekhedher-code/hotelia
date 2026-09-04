const express = require("express");

const router = express.Router();

const {
    getAllReviews,
    createReview,
    getReviewsByRoom,
    getReviewsByUser,
    deleteReview
} = require("../controllers/reviewController");


// =====================================================
// TOUS LES AVIS
// =====================================================

router.get("/", getAllReviews);


// =====================================================
// AVIS D'UN UTILISATEUR
// =====================================================

router.get(
    "/user/:userId",
    getReviewsByUser
);


// =====================================================
// AVIS D'UNE CHAMBRE
// =====================================================

router.get(
    "/room/:room_id",
    getReviewsByRoom
);


// =====================================================
// AJOUTER UN AVIS
// =====================================================

router.post(
    "/",
    createReview
);


// =====================================================
// SUPPRIMER UN AVIS
// =====================================================

router.delete(
    "/:id",
    deleteReview
);


module.exports = router;