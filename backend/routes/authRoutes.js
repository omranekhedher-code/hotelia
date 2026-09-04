const express = require("express");
const router = express.Router();

const {
    register,
    login,
    forgotPassword,
    verifyOtp,
    resetPassword
} = require("../controllers/authController");


// =========================
// REGISTER
// =========================

router.post(
    "/register",
    register
);


// =========================
// LOGIN
// =========================

router.post(
    "/login",
    login
);


// =========================
// FORGOT PASSWORD
// Envoyer OTP
// =========================

router.post(
    "/forgot-password",
    forgotPassword
);


// =========================
// VERIFY OTP
// Vérifier le code
// =========================

router.post(
    "/verify-otp",
    verifyOtp
);


// =========================
// RESET PASSWORD
// Changer mot de passe
// =========================

router.post(
    "/reset-password",
    resetPassword
);


module.exports = router;