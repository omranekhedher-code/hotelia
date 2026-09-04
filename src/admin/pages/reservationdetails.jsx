import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Header from "../../components/header";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

function ReservationDetails() {

    const { id } = useParams();

    const [reservation, setReservation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ==========================================
    // GET RESERVATION
    // ==========================================

    const fetchReservation = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                `http://localhost:5000/api/reservations/${id}`
            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Réservation introuvable"
                );

            }

            setReservation(data);

        } catch (err) {

            console.error(
                "Erreur ReservationDetails :",
                err
            );

            setError(err.message);

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchReservation();

    }, [id]);


    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        const d = new Date(date);

        if (isNaN(d.getTime())) {
            return date;
        }

        return d.toLocaleDateString("fr-FR");

    };


    return (

        <div className="reservation-page">

            {/* ==================================
                HEADER
            ================================== */}

            <Header />


            {/* ==================================
                NAVBAR
            ================================== */}

            <Navbar />


            {/* ==================================
                CONTENT
            ================================== */}

            <main className="reservation-details-page">

                <div className="reservation-container">


                    {/* ==================================
                        LOADING
                    ================================== */}

                    {loading && (

                        <div className="reservation-loading">

                            <div className="loading-spinner"></div>

                            <h2>
                                Chargement...
                            </h2>

                            <p>
                                Récupération des détails de la réservation
                            </p>

                        </div>

                    )}


                    {/* ==================================
                        ERROR
                    ================================== */}

                    {!loading && error && (

                        <div className="reservation-error">

                            <h2>
                                Une erreur est survenue
                            </h2>

                            <p>
                                {error}
                            </p>

                        </div>

                    )}


                    {/* ==================================
                        DETAILS
                    ================================== */}

                    {!loading &&
                    !error &&
                    reservation && (

                        <>

                            {/* PAGE HEADER */}

                            <div className="reservation-header">

                                <span className="reservation-label">
                                    HOTELIA
                                </span>

                                <h1>
                                    Détails de la réservation
                                </h1>

                                <p>
                                    Réservation #{reservation.id}
                                </p>

                            </div>


                            {/* CARD */}

                            <div className="reservation-card">


                                {/* CLIENT */}

                                <section className="reservation-section">

                                    <h2>
                                        Informations client
                                    </h2>

                                    <div className="info-grid">

                                        <div className="info-item">

                                            <span>
                                                Nom complet
                                            </span>

                                            <strong>
                                                {reservation.prenom}{" "}
                                                {reservation.nom}
                                            </strong>

                                        </div>


                                        <div className="info-item">

                                            <span>
                                                Email
                                            </span>

                                            <strong>
                                                {reservation.email || "-"}
                                            </strong>

                                        </div>


                                        <div className="info-item">

                                            <span>
                                                Téléphone
                                            </span>

                                            <strong>
                                                {reservation.telephone || "-"}
                                            </strong>

                                        </div>

                                    </div>

                                </section>


                                {/* CHAMBRE */}

                                <section className="reservation-section">

                                    <h2>
                                        Chambre
                                    </h2>

                                    <div className="info-grid">

                                        <div className="info-item">

                                            <span>
                                                Numéro
                                            </span>

                                            <strong>
                                                {reservation.numero || "-"}
                                            </strong>

                                        </div>


                                        <div className="info-item">

                                            <span>
                                                Type
                                            </span>

                                            <strong>
                                                {reservation.type || "-"}
                                            </strong>

                                        </div>

                                    </div>

                                </section>


                                {/* SÉJOUR */}

                                <section className="reservation-section">

                                    <h2>
                                        Séjour
                                    </h2>

                                    <div className="info-grid">

                                        <div className="info-item">

                                            <span>
                                                Arrivée
                                            </span>

                                            <strong>
                                                {formatDate(
                                                    reservation.date_arriv
                                                )}
                                            </strong>

                                        </div>


                                        <div className="info-item">

                                            <span>
                                                Départ
                                            </span>

                                            <strong>
                                                {formatDate(
                                                    reservation.date_depart
                                                )}
                                            </strong>

                                        </div>


                                        <div className="info-item">

                                            <span>
                                                Nombre de personnes
                                            </span>

                                            <strong>
                                                {reservation.nb_per}
                                            </strong>

                                        </div>

                                    </div>

                                </section>


                                {/* PAIEMENT */}

                                <section className="reservation-section">

                                    <h2>
                                        Paiement
                                    </h2>

                                    <div className="info-grid">

                                        <div className="info-item">

                                            <span>
                                                Prix total
                                            </span>

                                            <strong className="price">
                                                {reservation.prix_total} DT
                                            </strong>

                                        </div>


                                        <div className="info-item">

                                            <span>
                                                Solde
                                            </span>

                                            <strong>
                                                {reservation.solde} DT
                                            </strong>

                                        </div>

                                    </div>

                                </section>


                                {/* STATUS */}

                                <section className="reservation-status-section">

                                    <div>

                                        <span className="status-label">
                                            Statut de la réservation
                                        </span>

                                        <span
                                            className={`reservation-status ${
                                                reservation.status
                                                    ?.toLowerCase()
                                                    .replace(/\s+/g, "-")
                                            }`}
                                        >
                                            {reservation.status}
                                        </span>

                                    </div>

                                </section>


                            </div>

                        </>

                    )}

                </div>

            </main>


            {/* ==================================
                FOOTER
            ================================== */}

            <Footer />

        </div>

    );

}

export default ReservationDetails;