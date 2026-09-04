const Promotion = require("../models/Promotion");


// =====================================================
// GET ALL PROMOTIONS
// =====================================================

const getAllPromotions = async (req, res) => {

    try {

        const promotions = await Promotion.getAll();

        res.status(200).json(promotions);

    } catch (error) {

        console.error(
            "Erreur récupération promotions :",
            error
        );

        res.status(500).json({
            message: "Erreur serveur lors de la récupération des promotions."
        });

    }

};


// =====================================================
// GET PROMOTION BY ID
// =====================================================

const getPromotionById = async (req, res) => {

    try {

        const { id } = req.params;


        if (!id || isNaN(Number(id))) {

            return res.status(400).json({
                message: "ID de promotion invalide."
            });

        }


        const promotion =
            await Promotion.getById(id);


        if (!promotion) {

            return res.status(404).json({
                message: "Promotion introuvable."
            });

        }


        res.status(200).json(promotion);

    } catch (error) {

        console.error(
            "Erreur récupération promotion :",
            error
        );

        res.status(500).json({
            message: "Erreur serveur lors de la récupération de la promotion."
        });

    }

};


// =====================================================
// CREATE PROMOTION
// =====================================================

const createPromotion = async (req, res) => {

    try {

        const {
            titre,
            reduction,
            room_id,
            date_debut,
            date_fin,
            status
        } = req.body;


        // Validation minimale

        if (
            !titre ||
            reduction === undefined ||
            !date_debut ||
            !date_fin
        ) {

            return res.status(400).json({
                message:
                    "Titre, réduction, date de début et date de fin sont obligatoires."
            });

        }


        const promotion =
            await Promotion.create({
                titre,
                reduction,
                room_id,
                date_debut,
                date_fin,
                status
            });


        res.status(201).json(promotion);

    } catch (error) {

        console.error(
            "Erreur création promotion :",
            error
        );

        res.status(500).json({
            message: "Erreur lors de la création de la promotion."
        });

    }

};


// =====================================================
// UPDATE PROMOTION
// =====================================================

const updatePromotion = async (req, res) => {

    try {

        const { id } = req.params;


        if (!id || isNaN(Number(id))) {

            return res.status(400).json({
                message: "ID de promotion invalide."
            });

        }


        const {
            titre,
            reduction,
            room_id,
            date_debut,
            date_fin,
            status
        } = req.body;


        const promotion =
            await Promotion.update(
                id,
                {
                    titre,
                    reduction,
                    room_id,
                    date_debut,
                    date_fin,
                    status
                }
            );


        if (!promotion) {

            return res.status(404).json({
                message: "Promotion introuvable."
            });

        }


        res.status(200).json(promotion);

    } catch (error) {

        console.error(
            "Erreur modification promotion :",
            error
        );

        res.status(500).json({
            message:
                "Erreur lors de la modification de la promotion."
        });

    }

};


// =====================================================
// DELETE PROMOTION
// =====================================================

const deletePromotion = async (req, res) => {

    try {

        const { id } = req.params;


        if (!id || isNaN(Number(id))) {

            return res.status(400).json({
                message: "ID de promotion invalide."
            });

        }


        const promotion =
            await Promotion.delete(id);


        if (!promotion) {

            return res.status(404).json({
                message: "Promotion introuvable."
            });

        }


        res.status(200).json({

            message:
                "Promotion supprimée avec succès.",

            promotion

        });

    } catch (error) {

        console.error(
            "Erreur suppression promotion :",
            error
        );

        res.status(500).json({
            message:
                "Erreur lors de la suppression de la promotion."
        });

    }

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    getAllPromotions,
    getPromotionById,
    createPromotion,
    updatePromotion,
    deletePromotion

};