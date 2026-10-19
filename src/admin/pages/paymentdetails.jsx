import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Header from "../../components/header";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

import "./payment.css";


function PaymentDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [payment, setPayment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =====================================================
    // RÉCUPÉRER LE PAIEMENT
    // =====================================================

    useEffect(() => {

        const fetchPayment = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await fetch(
                    `http://localhost:8080/api/payments/${id}`
                );

                const contentType =
                    response.headers.get("content-type");

                if (!contentType?.includes("application/json")) {

                    throw new Error(
                        `Le serveur ne retourne pas les données du paiement.`
                    );

                }

                const data = await response.json();

                console.log("Paiement reçu :", data);


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Paiement introuvable"
                    );

                }


                setPayment(data);


            } catch (err) {

                console.error(
                    "Erreur paiement :",
                    err
                );

                setError(
                    err.message
                );


            } finally {

                setLoading(false);

            }

        };


        fetchPayment();

    }, [id]);


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleDateString(
            "fr-FR",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );

    };


    // =====================================================
    // STATUS CLASS
    // =====================================================

    const getStatusClass = (status) => {

        const value =
            String(status || "")
                .toLowerCase()
                .trim();


        if (
            value === "payé" ||
            value === "paye"
        ) {

            return "paid";

        }


        if (
            value === "en attente"
        ) {

            return "pending";

        }


        if (
            value === "remboursé" ||
            value === "rembourse"
        ) {

            return "refunded";

        }


        return "default";

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="payment-details-page">

                <Header />

                <Navbar />

                <main className="payment-details-main">

                    <div className="payment-details-container">

                        <div className="payment-details-loading">

                            <div className="payment-loader"></div>

                            <h2>
                                Chargement...
                            </h2>

                            <p>
                                Récupération des informations du paiement
                            </p>

                        </div>

                    </div>

                </main>

                <Footer />

            </div>

        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <div className="payment-details-page">

                <Header />

                <Navbar />

                <main className="payment-details-main">

                    <div className="payment-details-container">

                        <div className="payment-details-error-card">

                            <div className="payment-error-icon">
                                !
                            </div>

                            <h2>
                                Paiement introuvable
                            </h2>

                            <p>
                                {error}
                            </p>

                            

                        </div>

                    </div>

                </main>

                <Footer />

            </div>

        );

    }


    if (!payment) {
        return null;
    }


    // =====================================================
    // PAGE PRINCIPALE
    // =====================================================

    return (

        <div className="payment-details-page">


            {/* =================================================
                HEADER GLOBAL
            ================================================= */}

            <Header />


            {/* =================================================
                NAVBAR
            ================================================= */}

            <Navbar />


            {/* =================================================
                MAIN
            ================================================= */}

            <main className="payment-details-main">

                <div className="payment-details-container">


                    {/* =================================================
                        PAGE HEADER
                    ================================================= */}

                    <div className="payment-details-header">

                        <div className="payment-header-content">

                            <span className="payment-header-label">
                                HOTELIA
                            </span>

                            <h1>
                                Détails du paiement
                            </h1>

                            <p>
                                Consultez toutes les informations
                                relatives à cette transaction.
                            </p>

                        </div>


                        <div className="payment-header-id">

                            <span>
                                PAIEMENT
                            </span>

                            <strong>
                                #{payment.id}
                            </strong>

                        </div>

                    </div>


                    {/* =================================================
                        MAIN CARD
                    ================================================= */}

                    <div className="payment-details-card">


                        {/* =================================================
                            PAYMENT HEADER
                        ================================================= */}

                        <div className="payment-card-header">

                            <div>

                                <span className="payment-card-label">
                                    PAIEMENT
                                </span>

                                <h2>
                                    #{payment.id}
                                </h2>

                            </div>


                            <span
                                className={`payment-detail-status ${getStatusClass(
                                    payment.status
                                )}`}
                            >

                                <span className="status-dot"></span>

                                {payment.status || "-"}

                            </span>

                        </div>


                        {/* =================================================
                            SUMMARY
                        ================================================= */}

                        <div className="payment-summary">


                            <div className="payment-summary-item">

                                <span>
                                    Montant
                                </span>

                                <strong className="payment-summary-amount">

                                    {payment.montant || "0"}

                                    {" DT"}

                                </strong>

                            </div>


                            <div className="payment-summary-divider"></div>


                            <div className="payment-summary-item">

                                <span>
                                    Méthode
                                </span>

                                <strong>
                                    {payment.mode_paiement || "-"}
                                </strong>

                            </div>


                            <div className="payment-summary-divider"></div>


                            <div className="payment-summary-item">

                                <span>
                                    Date
                                </span>

                                <strong>
                                    {formatDate(
                                        payment.date_paiement
                                    )}
                                </strong>

                            </div>


                        </div>


                        {/* =================================================
                            INFORMATIONS PAIEMENT
                        ================================================= */}

                        <div className="payment-details-section">


                            <div className="payment-section-heading">

                                <div className="payment-section-line"></div>

                                <div>

                                    <h2>
                                        Informations du paiement
                                    </h2>

                                    <p>
                                        Informations relatives à la transaction
                                    </p>

                                </div>

                            </div>


                            <div className="payment-details-grid">


                                <div className="payment-detail-item">

                                    <span>
                                        ID Paiement
                                    </span>

                                    <strong>
                                        #{payment.id}
                                    </strong>

                                </div>


                                <div className="payment-detail-item">

                                    <span>
                                        ID Réservation
                                    </span>

                                    <strong>
                                        RES-
                                        {String(
                                            payment.reservation_id
                                        ).padStart(3, "0")}
                                    </strong>

                                </div>


                                <div className="payment-detail-item">

                                    <span>
                                        Montant
                                    </span>

                                    <strong className="payment-amount">

                                        {payment.montant || "-"}

                                        {" DT"}

                                    </strong>

                                </div>


                                <div className="payment-detail-item">

                                    <span>
                                        Mode de paiement
                                    </span>

                                    <strong>
                                        {payment.mode_paiement || "-"}
                                    </strong>

                                </div>


                                <div className="payment-detail-item">

                                    <span>
                                        Date du paiement
                                    </span>

                                    <strong>
                                        {formatDate(
                                            payment.date_paiement
                                        )}
                                    </strong>

                                </div>


                                <div className="payment-detail-item">

                                    <span>
                                        Statut
                                    </span>

                                    <strong>

                                        <span
                                            className={`payment-mini-status ${getStatusClass(
                                                payment.status
                                            )}`}
                                        >
                                            {payment.status || "-"}
                                        </span>

                                    </strong>

                                </div>


                                <div className="payment-detail-item full">

                                    <span>
                                        Transaction ID
                                    </span>

                                    <strong className="transaction-value">

                                        {payment.transaction_id || "-"}

                                    </strong>

                                </div>


                            </div>

                        </div>


                        {/* =================================================
                            INFORMATIONS CLIENT
                        ================================================= */}

                        <div className="payment-details-section">


                            <div className="payment-section-heading">

                                <div className="payment-section-line"></div>

                                <div>

                                    <h2>
                                        Informations du client
                                    </h2>

                                    <p>
                                        Coordonnées du client concerné
                                    </p>

                                </div>

                            </div>


                            <div className="payment-details-grid">


                                <div className="payment-detail-item">

                                    <span>
                                        Nom complet
                                    </span>

                                    <strong>

                                        {payment.prenom || ""}
                                        {" "}
                                        {payment.nom || ""}

                                    </strong>

                                </div>


                                <div className="payment-detail-item">

                                    <span>
                                        Email
                                    </span>

                                    <strong>
                                        {payment.email || "-"}
                                    </strong>

                                </div>


                                <div className="payment-detail-item">

                                    <span>
                                        Téléphone
                                    </span>

                                    <strong>
                                        {payment.telephone || "-"}
                                    </strong>

                                </div>


                                <div className="payment-detail-item">

                                    <span>
                                        ID Utilisateur
                                    </span>

                                    <strong>
                                        {payment.user_id || "-"}
                                    </strong>

                                </div>


                            </div>

                        </div>


                        {/* =================================================
                            INFORMATIONS RÉSERVATION
                        ================================================= */}

                        <div className="payment-details-section">


                            <div className="payment-section-heading">

                                <div className="payment-section-line"></div>

                                <div>

                                    <h2>
                                        Informations de la réservation
                                    </h2>

                                    <p>
                                        Détails de la réservation associée
                                    </p>

                                </div>

                            </div>


                            <div className="payment-details-grid">


                                <div className="payment-detail-item">

                                    <span>
                                        Chambre
                                    </span>

                                    <strong>
                                        Chambre #
                                        {payment.room_id || "-"}
                                    </strong>

                                </div>


                                <div className="payment-detail-item">

                                    <span>
                                        Nombre de personnes
                                    </span>

                                    <strong>
                                        {payment.nb_per || "-"}
                                    </strong>

                                </div>


                                <div className="payment-detail-item">

                                    <span>
                                        Date d'arrivée
                                    </span>

                                    <strong>
                                        {formatDate(
                                            payment.date_arriv
                                        )}
                                    </strong>

                                </div>


                                <div className="payment-detail-item">

                                    <span>
                                        Date de départ
                                    </span>

                                    <strong>
                                        {formatDate(
                                            payment.date_depart
                                        )}
                                    </strong>

                                </div>


                                <div className="payment-detail-item">

                                    <span>
                                        Prix total réservation
                                    </span>

                                    <strong className="payment-amount">

                                        {payment.prix_total || "-"}

                                        {" DT"}

                                    </strong>

                                </div>


                            </div>

                        </div>


                        {/* =================================================
                            FOOTER CARD
                        ================================================= */}

                        


                    </div>

                </div>

            </main>


            {/* =================================================
                FOOTER GLOBAL
            ================================================= */}

            <Footer />


        </div>

    );

}


export default PaymentDetails;