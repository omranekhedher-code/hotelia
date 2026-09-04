import React, { useEffect, useState } from "react";
import "../Admin.css";

function Navbar() {
    const [showNotifications, setShowNotifications] =
        useState(false);

    const [notifications, setNotifications] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    // =====================================================
    // PAGINATION
    // =====================================================

    const [notificationPage, setNotificationPage] =
        useState(0);

    const NOTIFICATIONS_PER_PAGE = 4;


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        const parsedDate = new Date(date);

        if (isNaN(parsedDate.getTime())) {
            return "-";
        }

        return parsedDate.toLocaleDateString(
            "fr-FR",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );
    };


    // =====================================================
    // RÉCUPÉRER LES NOTIFICATIONS
    // =====================================================

    const fetchNotifications = async () => {

        try {

            setLoading(true);

            // ==========================================
            // RÉSERVATIONS
            // ==========================================

            const reservationsResponse =
                await fetch(
                    "http://localhost:5000/api/reservations"
                );

            if (!reservationsResponse.ok) {
                throw new Error(
                    "Erreur récupération réservations"
                );
            }

            const reservations =
                await reservationsResponse.json();


            // ==========================================
            // PAIEMENTS
            // ==========================================

            const paymentsResponse =
                await fetch(
                    "http://localhost:5000/api/payments"
                );

            if (!paymentsResponse.ok) {
                throw new Error(
                    "Erreur récupération paiements"
                );
            }

            const payments =
                await paymentsResponse.json();


            // ==========================================
            // AVIS
            // ==========================================

            const reviewsResponse =
                await fetch(
                    "http://localhost:5000/api/reviews"
                );

            if (!reviewsResponse.ok) {
                throw new Error(
                    "Erreur récupération avis"
                );
            }

            const reviews =
                await reviewsResponse.json();


            // ==========================================
            // CONSTRUIRE NOTIFICATIONS
            // ==========================================

            const newNotifications = [];


            // ==========================================
            // RÉSERVATIONS
            // ==========================================

            if (Array.isArray(reservations)) {

                reservations.forEach(
                    (reservation) => {

                        newNotifications.push({

                            id:
                                `reservation-${reservation.id}`,

                            title:
                                "Nouvelle réservation",

                            message:
                                `${reservation.prenom || ""} ${
                                    reservation.nom || ""
                                } a effectué une réservation`,

                            time:
                                formatDate(
                                    reservation.date_arriv
                                ),

                            type:
                                "reservation",

                            createdAt:
                                reservation.id

                        });

                    }
                );
            }


            // ==========================================
            // PAIEMENTS
            // ==========================================

            if (Array.isArray(payments)) {

                payments.forEach(
                    (payment) => {

                        newNotifications.push({

                            id:
                                `payment-${payment.id}`,

                            title:
                                "Paiement reçu",

                            message:
                                `Paiement de ${
                                    payment.montant
                                } DT confirmé`,

                            time:
                                formatDate(
                                    payment.date_paiement
                                ),

                            type:
                                "payment",

                            createdAt:
                                payment.id

                        });

                    }
                );
            }


            // ==========================================
            // AVIS
            // ==========================================

            if (Array.isArray(reviews)) {

                reviews.forEach(
                    (review) => {

                        newNotifications.push({

                            id:
                                `review-${review.id}`,

                            title:
                                "Nouvel avis client",

                            message:
                                `Un client a ajouté un avis de ${
                                    review.rating
                                }/5`,

                            time:
                                formatDate(
                                    review.created_at
                                ),

                            type:
                                "review",

                            createdAt:
                                review.id

                        });

                    }
                );
            }


            // ==========================================
            // TRIER
            // ==========================================

            newNotifications.sort(
                (a, b) =>
                    b.createdAt - a.createdAt
            );


            // ==========================================
            // ENREGISTRER
            // ==========================================

            setNotifications(
                newNotifications
            );

        } catch (error) {

            console.error(
                "Erreur notifications :",
                error
            );

            setNotifications([]);

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // CHARGER AU DÉMARRAGE
    // =====================================================

    useEffect(() => {

        fetchNotifications();

    }, []);


    // =====================================================
    // NOTIFICATIONS AFFICHÉES
    // =====================================================

    const startIndex =
        notificationPage *
        NOTIFICATIONS_PER_PAGE;

    const displayedNotifications =
        notifications.slice(
            startIndex,
            startIndex + NOTIFICATIONS_PER_PAGE
        );


    // =====================================================
    // PAGINATION
    // =====================================================

    const hasNext =
        startIndex + NOTIFICATIONS_PER_PAGE <
        notifications.length;

    const hasPrevious =
        notificationPage > 0;


    // =====================================================
    // PLUS TARD
    // =====================================================

    const handleNextNotifications = () => {

        if (hasNext) {

            setNotificationPage(
                (prev) => prev + 1
            );

        }
    };


    // =====================================================
    // RETOUR
    // =====================================================

    const handlePreviousNotifications = () => {

        if (hasPrevious) {

            setNotificationPage(
                (prev) => prev - 1
            );

        }
    };


    // =====================================================
    // OUVRIR / FERMER NOTIFICATIONS
    // =====================================================

    const handleNotificationClick = () => {

        setShowNotifications(
            (prev) => !prev
        );

    };


    // =====================================================
    // NAVBAR
    // =====================================================

    return (

        <div className="admin-navbar">

            <h3>
                Dashboard
            </h3>


            <div className="admin-user">


                {/* ==========================================
                    NOTIFICATIONS
                ========================================== */}

                <div className="notification-box-container">

                    <button
                        type="button"
                        className="notification-icon"
                        onClick={
                            handleNotificationClick
                        }
                    >

                        🔔

                        <span className="notification-count">
                            {notifications.length}
                        </span>

                    </button>


                    {/* ======================================
                        DROPDOWN
                    ====================================== */}

                    {showNotifications && (

                        <div className="notification-dropdown">


                            {/* ==================================
                                HEADER
                            ================================== */}

                            <div className="notification-dropdown-header">

                                <h4>
                                    Notifications
                                </h4>

                                <span>
                                    {notifications.length}
                                </span>

                            </div>


                            {/* ==================================
                                CONTENU
                            ================================== */}

                            {loading ? (

                                <div className="notification-empty">
                                    Chargement...
                                </div>

                            ) : notifications.length === 0 ? (

                                <div className="notification-empty">
                                    Aucune notification
                                </div>

                            ) : (

                                <>

                                    {/* ==============================
                                        4 NOTIFICATIONS
                                    ============================== */}

                                    <div className="notification-items">

                                        {displayedNotifications.map(
                                            (notification) => (

                                                <div
                                                    className={
                                                        `notification-item ${notification.type}`
                                                    }
                                                    key={
                                                        notification.id
                                                    }
                                                >

                                                    {/* ICON */}

                                                    <div className="notification-item-icon">

                                                        {notification.type ===
                                                            "reservation"
                                                            ? "🛏️"
                                                            : notification.type ===
                                                                "payment"
                                                                ? "💳"
                                                                : "⭐"
                                                        }

                                                    </div>


                                                    {/* CONTENT */}

                                                    <div className="notification-item-content">

                                                        <h5>
                                                            {
                                                                notification.title
                                                            }
                                                        </h5>

                                                        <p>
                                                            {
                                                                notification.message
                                                            }
                                                        </p>

                                                        <small>
                                                            {
                                                                notification.time
                                                            }
                                                        </small>

                                                    </div>

                                                </div>

                                            )
                                        )}

                                    </div>


                                    {/* ==================================
                                        PAGINATION
                                    ================================== */}

                                    <div className="notification-pagination">


                                        {/* RETOUR */}

                                        {hasPrevious && (

                                            <button
                                                type="button"
                                                className="notification-back-btn"
                                                onClick={
                                                    handlePreviousNotifications
                                                }
                                            >
                                                ← Retour
                                            </button>

                                        )}


                                        {/* PAGE */}

                                        <span className="notification-page-number">

                                            {notificationPage + 1}

                                        </span>


                                        {/* PLUS TARD */}

                                        {hasNext && (

                                            <button
                                                type="button"
                                                className="notification-more-btn"
                                                onClick={
                                                    handleNextNotifications
                                                }
                                            >
                                                Plus tard →
                                            </button>

                                        )}

                                    </div>

                                </>

                            )}

                        </div>

                    )}

                </div>


                {/* ==========================================
                    ADMIN
                ========================================== */}

                <div>

                    <p>
                        Admin
                    </p>

                    <small>
                        Hotel Manager
                    </small>

                </div>


            </div>

        </div>

    );
}

export default Navbar;