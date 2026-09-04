const Review = require("../models/review");


// =====================================================
// AFFICHER TOUS LES AVIS
// =====================================================

const getAllReviews = async (req, res) => {
    try {

        const reviews = await Review.getAll();

        res.status(200).json(reviews);

    } catch (error) {

        console.error("Erreur récupération avis :", error);

        res.status(500).json({
            message: error.message
        });

    }
};


// =====================================================
// AFFICHER LES AVIS D'UN UTILISATEUR
// =====================================================

const getReviewsByUser = async (req, res) => {
    try {

        const { userId } = req.params;

        const reviews = await Review.getByUser(userId);

        res.status(200).json(reviews);

    } catch (error) {

        console.error(
            "Erreur getReviewsByUser :",
            error
        );

        res.status(500).json({
            message: error.message
        });

    }
};


// =====================================================
// AJOUTER UN AVIS
// =====================================================

const createReview = async (req, res) => {
    try {

        const review = await Review.create(req.body);

        res.status(201).json({
            message: "Avis ajouté avec succès",
            review
        });

    } catch (error) {

        console.error(
            "Erreur création avis :",
            error
        );

        res.status(500).json({
            message: error.message
        });

    }
};


// =====================================================
// AFFICHER LES AVIS D'UNE CHAMBRE
// =====================================================

const getReviewsByRoom = async (req, res) => {
    try {

        const { room_id } = req.params;

        const reviews = await Review.getByRoom(room_id);

        res.status(200).json(reviews);

    } catch (error) {

        console.error(
            "Erreur récupération avis chambre :",
            error
        );

        res.status(500).json({
            message: error.message
        });

    }
};


// =====================================================
// SUPPRIMER UN AVIS
// =====================================================

const deleteReview = async (req, res) => {
    try {

        const { id } = req.params;

        const review = await Review.delete(id);

        if (!review) {

            return res.status(404).json({
                message: "Avis introuvable"
            });

        }

        res.status(200).json({
            message: "Avis supprimé avec succès",
            review
        });

    } catch (error) {

        console.error(
            "Erreur suppression avis :",
            error
        );

        res.status(500).json({
            message: error.message
        });

    }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
    getAllReviews,
    getReviewsByUser,
    createReview,
    getReviewsByRoom,
    deleteReview
};