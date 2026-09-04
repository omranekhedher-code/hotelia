const express = require("express");

const router = express.Router();

const auth =
    require("../middleware/auth");

const {

    getAllPayments,

    getPaymentById,

    getPaymentsByUser,

    createPayment

} = require("../controllers/paymentController");


// =====================================================
// TOUS LES PAIEMENTS
// =====================================================

router.get(
    "/",
    getAllPayments
);


// =====================================================
// PAIEMENTS USER
// =====================================================

router.get(
    "/user/:userId",
    getPaymentsByUser
);


// =====================================================
// PAIEMENT PAR ID
// =====================================================

router.get(
    "/:id",
    getPaymentById
);


// =====================================================
// CRÉER PAIEMENT
// AUTH REQUIRED
// =====================================================

router.post(
    "/",
    auth,
    createPayment
);


module.exports = router;