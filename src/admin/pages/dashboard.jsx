import React, { useEffect, useState } from "react";

import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";

import StatCard from "../components/statcard";
import Chart from "../components/chart";

import Rooms from "./Rooms";
import Reservations from "./Reservations";
import Clients from "./Clients";
import Payments from "./Payments";
import Promotions from "./Promotions";
import Reviews from "./reviews";
import Settings from "./settings";


function Dashboard() {

    const [page, setPage] = useState(() => {
        return localStorage.getItem("dashboardPage") || "dashboard";
    });

    const handleSetPage = (newPage) => {
        setPage(newPage);
        localStorage.setItem("dashboardPage", newPage);
    };


    // ==========================================
    // STATISTIQUES
    // ==========================================

    const [stats, setStats] = useState({

        rooms: 0,

        reservations: 0,

        clients: 0,

        revenue: 0

    });


    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ==========================================
    // RÉCUPÉRER LES STATISTIQUES
    // ==========================================

    useEffect(() => {

        const fetchStats = async () => {

            try {

                setLoading(true);

                setError("");


                // ==================================
                // Récupérer les chambres
                // ==================================

                const roomsResponse =
                    await fetch(
                        "http://localhost:5000/api/rooms"
                    );


                const rooms =
                    await roomsResponse.json();


                if (!roomsResponse.ok) {

                    throw new Error(
                        "Erreur récupération chambres"
                    );

                }


                // ==================================
                // Récupérer les réservations
                // ==================================

                const reservationsResponse =
                    await fetch(
                        "http://localhost:5000/api/reservations"
                    );


                const reservations =
                    await reservationsResponse.json();


                if (!reservationsResponse.ok) {

                    throw new Error(
                        "Erreur récupération réservations"
                    );

                }


                // ==================================
                // Récupérer les utilisateurs
                // ==================================

                const usersResponse =
                    await fetch(
                        "http://localhost:5000/api/users"
                    );


                const users =
                    await usersResponse.json();


                if (!usersResponse.ok) {

                    throw new Error(
                        "Erreur récupération utilisateurs"
                    );

                }


                // ==================================
                // Récupérer les paiements
                // ==================================

                const paymentsResponse =
                    await fetch(
                        "http://localhost:5000/api/payments"
                    );


                const payments =
                    await paymentsResponse.json();


                if (!paymentsResponse.ok) {

                    throw new Error(
                        "Erreur récupération paiements"
                    );

                }


                // ==================================
                // Compter seulement les clients
                // role = user
                // ==================================

                const clients =
                    users.filter(
                        user =>
                            user.role === "user"
                    );


                // ==================================
                // Calcul revenus
                // ==================================

                const revenue =
                    payments.reduce(

                        (total, payment) => {

                            const montant =
                                Number(
                                    payment.montant
                                ) || 0;


                            return total + montant;

                        },

                        0

                    );


                // ==================================
                // Mettre à jour les statistiques
                // ==================================

                setStats({

                    rooms:
                        rooms.length,

                    reservations:
                        reservations.length,

                    clients:
                        clients.length,

                    revenue:
                        revenue

                });


            } catch (error) {

                console.error(
                    "Erreur Dashboard :",
                    error
                );


                setError(
                    error.message ||
                    "Impossible de récupérer les statistiques."
                );


            } finally {

                setLoading(false);

            }

        };


        fetchStats();

    }, []);


    // ==========================================
    // FORMAT REVENUS
    // ==========================================

    const formatRevenue = (amount) => {

        return new Intl.NumberFormat(
            "fr-FR",
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }
        ).format(amount) + " DT";

    };


    // ==========================================
    // DASHBOARD
    // ==========================================

    const renderDashboard = () => {

        return (

            <>

                <div className="dashboard-header">

                    <h1>
                        Dashboard
                    </h1>


                    <p>
                        Bienvenue dans l'espace
                        administration Hotelia
                    </p>

                </div>


                {error && (

                    <div className="error-message">

                        {error}

                    </div>

                )}


                <div className="stats-container">


                    <StatCard

                        title="Chambres"

                        value={
                            loading
                                ? "..."
                                : stats.rooms
                        }

                    />


                    <StatCard

                        title="Réservations"

                        value={
                            loading
                                ? "..."
                                : stats.reservations
                        }

                    />


                    <StatCard

                        title="Clients"

                        value={
                            loading
                                ? "..."
                                : stats.clients
                        }

                    />


                    <StatCard

                        title="Revenus"

                        value={
                            loading
                                ? "..."
                                : formatRevenue(
                                    stats.revenue
                                )
                        }

                    />

                </div>


                <div className="dashboard-card">

                    <h2>
                        Réservations mensuelles
                    </h2>


                    <Chart />

                </div>

            </>

        );

    };


    // ==========================================
    // AFFICHAGE
    // ==========================================

    return (

        <div className="admin-container">


            <Sidebar setPage={handleSetPage} />


            <div className="admin-main">


                <Navbar />


                <main className="admin-content">


                    {page === "dashboard" && (

                        renderDashboard()

                    )}


                    {page === "rooms" && (

                        <Rooms />

                    )}


                    {page === "reservations" && (

                        <Reservations />

                    )}


                    {page === "clients" && (

                        <Clients />

                    )}


                    {page === "payments" && (

                        <Payments />

                    )}


                    {page === "promotions" && (

                        <Promotions />

                    )}


                    {page === "reviews" && (

                        <Reviews />

                    )}


                    {page === "settings" && (

                        <Settings />

                    )}


                </main>

            </div>

        </div>

    );

}


export default Dashboard;