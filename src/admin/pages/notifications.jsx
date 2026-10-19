import React, { useEffect, useState } from "react";

function Notifications() {

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Afficher 4 notifications par défaut
    const [showAll, setShowAll] = useState(false);


    // =====================================================
    // RÉCUPÉRER LES NOTIFICATIONS
    // =====================================================

    const fetchNotifications = async () => {

        try {

            setLoading(true);
            setError("");


            // ==========================================
            // RÉSERVATIONS
            // ==========================================

            const reservationsResponse = await fetch(
                "http://localhost:8080/api/reservations"
            );

            const reservations =
                await reservationsResponse.json();


            if (!reservationsResponse.ok) {

                throw new Error(
                    "Erreur lors de la récupération des réservations."
                );

            }


            // ==========================================
            // PAIEMENTS
            // ==========================================

            const paymentsResponse = await fetch(
                "http://localhost:8080/api/payments"
            );

            const payments =
                await paymentsResponse.json();


            if (!paymentsResponse.ok) {

                throw new Error(
                    "Erreur lors de la récupération des paiements."
                );

            }


            // ==========================================
            // AVIS
            // ==========================================

            const reviewsResponse = await fetch(
                "http://localhost:8080/api/reviews"
            );

            const reviews =
                await reviewsResponse.json();


            if (!reviewsResponse.ok) {

                throw new Error(
                    "Erreur lors de la récupération des avis."
                );

            }


            // ==========================================
            // TABLEAU NOTIFICATIONS
            // ==========================================

            const generatedNotifications = [];


            // ==========================================
            // RÉSERVATIONS
            // ==========================================

            if (Array.isArray(reservations)) {

                reservations.forEach((reservation) => {

                    generatedNotifications.push({

                        id:
                            `reservation-${reservation.id}`,

                        type:
                            "reservation",

                        title:
                            "Nouvelle réservation",

                        message:
                            `${reservation.prenom || ""} ${
                                reservation.nom || ""
                            } a effectué une réservation`,

                        date:
                            reservation.date_arriv,

                        createdAt:
                            reservation.id

                    });

                });

            }


            // ==========================================
            // PAIEMENTS
            // ==========================================

            if (Array.isArray(payments)) {

                payments.forEach((payment) => {

                    generatedNotifications.push({

                        id:
                            `payment-${payment.id}`,

                        type:
                            "payment",

                        title:
                            "Paiement reçu",

                        message:
                            `Paiement de ${
                                payment.montant
                            } DT confirmé`,

                        date:
                            payment.date_paiement,

                        createdAt:
                            payment.id

                    });

                });

            }


            // ==========================================
            // AVIS
            // ==========================================

            if (Array.isArray(reviews)) {

                reviews.forEach((review) => {

                    generatedNotifications.push({

                        id:
                            `review-${review.id}`,

                        type:
                            "review",

                        title:
                            "Nouvel avis",

                        message:
                            `Un client a ajouté un nouvel avis de ${
                                review.rating
                            }/5`,

                        date:
                            review.created_at,

                        createdAt:
                            review.id

                    });

                });

            }


            // ==========================================
            // TRIER DU PLUS RÉCENT AU PLUS ANCIEN
            // ==========================================

            generatedNotifications.sort(
                (a, b) =>
                    b.createdAt - a.createdAt
            );


            // ==========================================
            // SAUVEGARDER
            // ==========================================

            setNotifications(
                generatedNotifications
            );


            // Après actualisation :
            // revenir aux 4 premières
            setShowAll(false);


        } catch (err) {

            console.error(
                "Erreur notifications :",
                err
            );

            setError(
                "Impossible de récupérer les notifications."
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // CHARGEMENT INITIAL
    // =====================================================

    useEffect(() => {

        fetchNotifications();

    }, []);


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {

            return "-";

        }


        const parsedDate =
            new Date(date);


        if (
            isNaN(
                parsedDate.getTime()
            )
        ) {

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
    // ICON
    // =====================================================

    const getIcon = (type) => {

        switch (type) {

            case "reservation":
                return "🛏️";

            case "payment":
                return "💳";

            case "review":
                return "⭐";

            default:
                return "🔔";

        }

    };


    // =====================================================
    // NOTIFICATIONS À AFFICHER
    // =====================================================

    const displayedNotifications =
        showAll
            ? notifications
            : notifications.slice(0, 4);


    // Nombre de notifications restantes
    const remainingNotifications =
        Math.max(
            notifications.length - 4,
            0
        );


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="notifications-page">

                <h1>
                    Notifications
                </h1>

                <p className="page-description">
                    Chargement des dernières activités...
                </p>

            </div>

        );

    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="notifications-page">


            {/* ==========================================
                HEADER
            ========================================== */}

            <div className="page-header">

                <div>

                    <h1>
                        Notifications
                    </h1>

                    <p className="page-description">
                        Consulter les dernières activités de l'hôtel
                    </p>

                </div>


                <button
                    type="button"
                    className="add-btn"
                    onClick={fetchNotifications}
                >
                    Actualiser
                </button>

            </div>


            {/* ==========================================
                ERROR
            ========================================== */}

            {error && (

                <div className="error-message">

                    {error}

                </div>

            )}


            {/* ==========================================
                NOTIFICATIONS
            ========================================== */}

            {!error && (

                <>

                    <div className="notifications-list">

                        {notifications.length === 0 ? (

                            /* ==================================
                               AUCUNE NOTIFICATION
                            ================================== */

                            <div className="notifications-empty">

                                <div className="empty-icon">
                                    🔔
                                </div>

                                <h3>
                                    Aucune notification
                                </h3>

                                <p>
                                    Il n'y a aucune activité récente.
                                </p>

                            </div>

                        ) : (

                            /* ==================================
                               LISTE
                            ================================== */

                            displayedNotifications.map(
                                (notification) => (

                                    <div
                                        className={`notification-card ${notification.type}`}
                                        key={notification.id}
                                    >


                                        {/* =========================
                                            ICON
                                        ========================= */}

                                        <div className="notification-icon">

                                            {getIcon(
                                                notification.type
                                            )}

                                        </div>


                                        {/* =========================
                                            CONTENT
                                        ========================= */}

                                        <div className="notification-content">

                                            <h3>
                                                {notification.title}
                                            </h3>

                                            <p>
                                                {notification.message}
                                            </p>

                                            <span>
                                                {formatDate(
                                                    notification.date
                                                )}
                                            </span>

                                        </div>


                                    </div>

                                )
                            )

                        )}

                    </div>


                    {/* ==========================================
                        VOIR PLUS
                    ========================================== */}

                    {notifications.length > 4 && (

                        <div className="notifications-more">

                            {!showAll ? (

                                <button
                                    type="button"
                                    className="show-more-btn"
                                    onClick={() =>
                                        setShowAll(true)
                                    }
                                >

                                    + {remainingNotifications} autres notifications

                                </button>

                            ) : (

                                <button
                                    type="button"
                                    className="show-more-btn"
                                    onClick={() =>
                                        setShowAll(false)
                                    }
                                >

                                    Afficher moins

                                </button>

                            )}

                        </div>

                    )}

                </>

            )}

        </div>

    );

}


export default Notifications;