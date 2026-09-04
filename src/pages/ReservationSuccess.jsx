import "./reservationSuccess.css";

import {
  useLocation,
  useNavigate
} from "react-router-dom";

import Navbar from "../components/navbar";
import Footer from "../components/footer";


function ReservationSuccess() {

  const location = useLocation();
  const navigate = useNavigate();


  // ==========================================
  // RÉCUPÉRER LES DONNÉES
  // ==========================================

  const room =
    location.state?.room;

  const reservation =
    location.state?.reservation;


  // ==========================================
  // SI AUCUNE DONNÉE
  // ==========================================

  if (!reservation) {

    return (

      <>

        <Navbar />

        <section className="reservation-success-container">

          <div className="reservation-success-card">

            <div className="reservation-success-icon">
              !
            </div>

            <h1>
              Aucune réservation trouvée
            </h1>

            <p>
              Les informations de votre réservation
              ne sont pas disponibles.
            </p>

            <button
              type="button"
              className="reservation-home-btn"
              onClick={() => navigate("/")}
            >
              Retour à l'accueil
            </button>

          </div>

        </section>

        <Footer />

      </>

    );

  }


  // ==========================================
  // PAYMENT
  // ==========================================

  const handlePayment = () => {

    navigate("/payment", {

      state: {

        room: room,

        reservation: reservation

      }

    });

  };


  // ==========================================
  // ACCUEIL
  // ==========================================

  const handleHome = () => {

    navigate("/");

  };


  // ==========================================
  // RENDER
  // ==========================================

  return (

    <>

      <Navbar />


      <section className="reservation-success-container">

        <div className="reservation-success-card">


          {/* ==================================
              ICON
          ================================== */}

          <div className="reservation-success-icon">

            ✓

          </div>


          {/* ==================================
              TITLE
          ================================== */}

          <h1>
            Réservation créée avec succès !
          </h1>


          <p className="reservation-success-message">

            Votre réservation a bien été enregistrée.

          </p>


          <p className="reservation-success-message">

            Vous pouvez maintenant effectuer
            le paiement ou revenir à l'accueil.

          </p>


          {/* ==================================
              RESERVATION INFO
          ================================== */}

          <div className="reservation-success-info">


            {reservation.id && (

              <div className="success-info-row">

                <span>
                  Numéro de réservation
                </span>

                <strong>
                  #{reservation.id}
                </strong>

              </div>

            )}


            {room?.type && (

              <div className="success-info-row">

                <span>
                  Chambre
                </span>

                <strong>
                  {room.type}
                </strong>

              </div>

            )}


            {reservation.dateArrivee && (

              <div className="success-info-row">

                <span>
                  Arrivée
                </span>

                <strong>
                  {reservation.dateArrivee}
                </strong>

              </div>

            )}


            {reservation.dateDepart && (

              <div className="success-info-row">

                <span>
                  Départ
                </span>

                <strong>
                  {reservation.dateDepart}
                </strong>

              </div>

            )}


            {reservation.nombreNuits > 0 && (

              <div className="success-info-row">

                <span>
                  Nombre de nuits
                </span>

                <strong>
                  {reservation.nombreNuits}
                </strong>

              </div>

            )}


            {reservation.prixTotal !== undefined && (

              <div className="success-info-row success-total">

                <span>
                  Total
                </span>

                <strong>
                  {Number(
                    reservation.prixTotal
                  ).toFixed(2)} DT
                </strong>

              </div>

            )}

          </div>


          {/* ==================================
              STATUS
          ================================== */}

          <div className="reservation-payment-status">

            <span className="status-dot"></span>

            Réservation enregistrée — Paiement en attente

          </div>


          {/* ==================================
              BUTTONS
          ================================== */}

          <div className="reservation-success-actions">


            <button
              type="button"
              className="reservation-pay-btn"
              onClick={handlePayment}
            >
              Payer maintenant
            </button>


            <button
              type="button"
              className="reservation-home-btn"
              onClick={handleHome}
            >
              Retour à l'accueil
            </button>


          </div>


        </div>

      </section>


      <Footer />

    </>

  );

}


export default ReservationSuccess;