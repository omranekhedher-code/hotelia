import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./myreservations.css";

function MyReservations() {
  const navigate = useNavigate();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const storedUser = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  const userId = user?.id;

  useEffect(() => {
    const fetchReservations = async () => {
      if (!userId) {
        setError("Utilisateur non connecté.");
        setLoading(false);
        return;
      }

      if (!token) {
        setError("Session expirée. Veuillez vous reconnecter.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/api/reservations/user/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        console.log("Reservations :", data);

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Erreur lors du chargement des réservations."
          );
        }

        setReservations(
          Array.isArray(data) ? data : []
        );
      } catch (error) {
        console.error(
          "Erreur reservations :",
          error
        );

        setError(
          error.message ||
            "Impossible de charger vos réservations."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [userId, token]);

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "fr-FR",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // STATUS
  // =====================================================

  const getStatusClass = (status) => {
    const value = String(status || "")
      .toLowerCase()
      .trim();

    if (
      value === "confirmée" ||
      value === "confirmee" ||
      value === "confirmé"
    ) {
      return "status status-confirmed";
    }

    if (
      value === "annulée" ||
      value === "annulee"
    ) {
      return "status status-cancelled";
    }

    return "status status-pending";
  };

  const getStatusLabel = (status) => {
    const value = String(status || "")
      .toLowerCase()
      .trim();

    if (
      value === "confirmée" ||
      value === "confirmee" ||
      value === "confirmé"
    ) {
      return "Confirmée";
    }

    if (
      value === "annulée" ||
      value === "annulee"
    ) {
      return "Annulée";
    }

    return "En attente";
  };

  // =====================================================
  // PAIEMENT
  // =====================================================

  const handlePayment = (reservation) => {
    const room = {
      id: reservation.room_id,
      type: reservation.type,
      numero: reservation.numero,
      prix_par_nuit: reservation.prix_par_nuit,
    };

    const reservationData = {
      id: reservation.id,
      reservation_id: reservation.id,

      room_id: reservation.room_id,

      dateArrivee: reservation.date_arriv,
      dateDepart: reservation.date_depart,

      personnes: reservation.nb_per,

      prixTotal: Number(
        reservation.prix_total || 0
      ),

      solde: Number(
        reservation.solde || 0
      ),
    };

    navigate("/payment", {
      state: {
        room,
        reservation: reservationData,
      },
    });
  };

  // =====================================================
  // DETAILS
  // =====================================================

  const handleDetails = (reservation) => {
    navigate(
      `/reservation-details/${reservation.id}`
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="my-reservations">

        <h1>
          Mes réservations
        </h1>

        <p>
          Chargement de vos réservations...
        </p>

      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="my-reservations">

        <h1>
          Mes réservations
        </h1>

        <div className="dashboard-card">
          <p className="error-message">
            {error}
          </p>
        </div>

      </div>
    );
  }

  // =====================================================
  // EMPTY
  // =====================================================

  if (reservations.length === 0) {
    return (
      <div className="my-reservations">

        <h1>
          Mes réservations
        </h1>

        <p>
          Consultez vos séjours et leurs détails
        </p>

        <div className="dashboard-card">

          <h2>
            Aucune réservation
          </h2>

          <p>
            Vous n'avez pas encore effectué
            de réservation.
          </p>

          <button
            type="button"
            className="details-btn"
            onClick={() => navigate("/")}
          >
            Réserver une chambre
          </button>

        </div>

      </div>
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="my-reservations">

      <div className="dashboard-header">

        <h1>
          Mes réservations
        </h1>

        <p>
          Consultez vos séjours et leurs détails
        </p>

      </div>

      <div className="reservation-list">

        {reservations.map((reservation) => {

          const amount = Number(
            reservation.prix_total || 0
          );

          const remaining = Number(
            reservation.solde || 0
          );

          const isPaid = remaining <= 0;

          return (
            <div
              className="reservation-card"
              key={reservation.id}
            >

              {/* ======================================
                  HEADER
              ====================================== */}

              <div className="reservation-card-header">

                <div>

                  <h2>
                    {reservation.type
                      ? reservation.type
                      : `Chambre ${reservation.room_id}`}
                  </h2>

                  {reservation.numero && (
                    <p>
                      Chambre N°{" "}
                      {reservation.numero}
                    </p>
                  )}

                </div>

                <span
                  className={getStatusClass(
                    reservation.status
                  )}
                >
                  {getStatusLabel(
                    reservation.status
                  )}
                </span>

              </div>

              {/* ======================================
                  INFO
              ====================================== */}

              <div className="reservation-info">

                <div className="reservation-info-item">

                  <span>
                    Arrivée
                  </span>

                  <strong>
                    {formatDate(
                      reservation.date_arriv
                    )}
                  </strong>

                </div>

                <div className="reservation-info-item">

                  <span>
                    Départ
                  </span>

                  <strong>
                    {formatDate(
                      reservation.date_depart
                    )}
                  </strong>

                </div>

                <div className="reservation-info-item">

                  <span>
                    Voyageurs
                  </span>

                  <strong>
                    {reservation.nb_per}
                  </strong>

                </div>

                <div className="reservation-info-item">

                  <span>
                    Total
                  </span>

                  <strong>
                    {amount.toFixed(2)} DT
                  </strong>

                </div>

              </div>

              {/* ======================================
                  PAYMENT STATUS
              ====================================== */}

              <div className="reservation-payment">

                {isPaid ? (
                  <span className="payment-paid">
                    ✓ Paiement effectué
                  </span>
                ) : (
                  <span className="payment-pending">
                    Paiement en attente :{" "}
                    {remaining.toFixed(2)} DT
                  </span>
                )}

              </div>

              {/* ======================================
                  ACTIONS
              ====================================== */}

              <div className="reservation-actions">

                {!isPaid && (
                  <button
                    type="button"
                    className="payment-btn"
                    onClick={() =>
                      handlePayment(
                        reservation
                      )
                    }
                  >
                    Payer maintenant
                  </button>
                )}

                

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}

export default MyReservations;
