const express = require("express");

const router = express.Router();

const {
    getAllPromotions,
    getPromotionById,
    createPromotion,
    updatePromotion,
    deletePromotion
} = require("../controllers/promotionController");


// GET /api/promotions
router.get("/", getAllPromotions);


// GET /api/promotions/:id
router.get("/:id", getPromotionById);


// POST /api/promotions
router.post("/", createPromotion);


// PUT /api/promotions/:id
router.put("/:id", updatePromotion);


// DELETE /api/promotions/:id
router.delete("/:id", deletePromotion);


module.exports = router;