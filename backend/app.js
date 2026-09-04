const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());
app.use(express.json());


// =====================================================
// ROUTES
// =====================================================

const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const promotionRoutes = require("./routes/promotionRoutes");
const notificationRoutes = require("./routes/notificationRoutes");


// =====================================================
// API ROUTES
// =====================================================

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/promotions", promotionRoutes);
app.use("/api/notifications", notificationRoutes);

// =====================================================
// TEST
// =====================================================

app.get("/", (req, res) => {
    res.send("Hotelia Backend is running");
});


// =====================================================
// EXPORT
// =====================================================

module.exports = app;