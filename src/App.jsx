import { Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import RoomDetail from "./pages/roomdetails";
import Reservation from "./pages/reservation";
import Payment from "./pages/payment";
import Success from "./pages/success";
import ReservationDetails from "./admin/pages/ReservationDetails";
import ClientProfile from "./admin/pages/ClientProfile";
import PaymentDetails from "./admin/pages/PaymentDetails";
import PromotionDetails from "./admin/pages/promotiondetails";
import ForgotPassword from "./pages/ForgotPassword";
import ReservationSuccess from "./pages/ReservationSuccess";
import UserPromotionDetails from "./pages/UserPromotionDetails";

// User Dashboard
import Dashboard from "./user/pages/dashboard";

// Admin Dashboard
import AdminDashboard from "./admin/pages/dashboard";


function App() {

    return (

        <Routes>

            <Route
                path="/"
                element={<Home />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/signup"
                element={<Signup />}
            />

            <Route
                path="/room/:id"
                element={<RoomDetail />}
            />

            <Route
                path="/reservation/:id"
                element={<Reservation />}
            />

            <Route
                path="/payment"
                element={<Payment />}
            />

            <Route
                path="/success"
                element={<Success />}
            />


            {/* USER */}

            <Route
                path="/user"
                element={<Dashboard />}
            />


            {/* ADMIN */}

            <Route
                path="/admin"
                element={<AdminDashboard />}
            />

            <Route
                path="/admin/reservations/:id"
                element={<ReservationDetails />}
            />

            <Route
                path="/admin/clients/:id"
                element={<ClientProfile />}
            />

            <Route
                path="/admin/payments/:id"
                element={<PaymentDetails />}
            />

            <Route
                path="/admin/promotions/:id/edit"
                element={<PromotionDetails />}
            />

            <Route
                path="/forgot-password"
                element={<ForgotPassword />}
            />

            <Route
                path="/reservation-success"
                element={<ReservationSuccess />}
            />

            <Route
                path="/promotion/:id"
                element={<UserPromotionDetails />}
            />

        </Routes>

    );

}


export default App;