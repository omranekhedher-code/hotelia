import "./roomdetails.css";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Header from "../components/header";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

function RoomDetail() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ==========================================
  // RÉCUPÉRER LA CHAMBRE
  // ==========================================

  useEffect(() => {

    const fetchRoom = async () => {

      try {

        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:8080/api/rooms/${id}`
        );

        if (!response.ok) {
          throw new Error("Chambre introuvable");
        }

        const data = await response.json();

        console.log("Room reçue :", data);

        setRoom(data);

      } catch (error) {

        console.error(
          "Erreur récupération chambre :",
          error
        );

        setError("Chambre introuvable");

      } finally {

        setLoading(false);

      }

    };

    fetchRoom();

  }, [id]);


  // ==========================================
  // ÉTOILES
  // ==========================================

  const renderStars = (rating) => {

    const value = Number(rating) || 0;
    const roundedRating = Math.round(value);

    return (
      <div className="room-rating">

        {[1, 2, 3, 4, 5].map((star) => (

          <span
            key={star}
            className={
              star <= roundedRating
                ? "star active"
                : "star"
            }
          >
            ★
          </span>

        ))}

      </div>
    );
  };


  // ==========================================
  // RÉSERVER
  // ==========================================

  const handleReservation = () => {

    const token = localStorage.getItem("token");

    // ==========================================
    // USER NON CONNECTÉ
    // ==========================================

    if (!token) {

      navigate("/login", {
        state: {
          from: `/reservation/${room.id}`
        }
      });

      return;
    }


    // ==========================================
    // USER CONNECTÉ
    // ==========================================

    navigate(`/reservation/${room.id}`);

  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
      <>
        <Header />
        <Navbar />

        <div className="room-not-found">

          <h2>
            Chargement...
          </h2>

          <p>
            Nous préparons les détails de votre chambre.
          </p>

        </div>

        <Footer />
      </>
    );

  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error || !room) {

    return (
      <>
        <Header />
        <Navbar />

        <div className="room-not-found">

          <h2>
            Chambre introuvable
          </h2>

          <p>
            Cette chambre n'existe pas ou n'est plus disponible.
          </p>

          <Link to="/">
            Retour à l'accueil
          </Link>

        </div>

        <Footer />
      </>
    );

  }


  // ==========================================
  // VARIABLES
  // ==========================================

  const rating =
    Number(room.rating) || 0;

  const reviewCount =
    Number(room.review_count) || 0;

  const options =
    Array.isArray(room.options)
      ? room.options
      : [];


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <>
      <Header />
      <Navbar />

      <main className="room-detail">


        {/* =====================================
            IMAGE
        ===================================== */}

        <div className="room-detail-image">

          <img
            src={
              room.image
                ? `/${room.image}`
                : "/imaged.png"
            }
            alt={room.type}
          />

        </div>


        {/* =====================================
            CONTENT
        ===================================== */}

        <div className="room-detail-content">


          {/* BADGE */}

          <span className="room-badge">
            Luxury Room
          </span>


          {/* TITLE */}

          <h1>
            {room.type}
          </h1>


          {/* RATING */}

          <div className="room-rating-container">

            {renderStars(rating)}

            <span className="rating-number">

              {reviewCount > 0
                ? `${rating.toFixed(1)} / 5`
                : "Aucun avis"}

            </span>

            {reviewCount > 0 && (

              <span className="review-count">
                ({reviewCount} avis)
              </span>

            )}

          </div>


          {/* DESCRIPTION */}

          <p className="room-description">

            {room.description ||
              "Une chambre élégante offrant confort, calme et raffinement pour un séjour inoubliable."}

          </p>


          {/* =================================
              INFORMATIONS
          ================================= */}

          <div className="room-info">


            {/* PRIX */}

            <div className="info-card">

              <div>

                <h3>
                  Prix
                </h3>

                <p>
                  {room.prix_par_nuit} DT / nuit
                </p>

              </div>

            </div>


            {/* CAPACITÉ */}

            <div className="info-card">

              <div>

                <h3>
                  Capacité
                </h3>

                <p>
                  {room.capacite} voyageurs
                </p>

              </div>

            </div>


            {/* NUMÉRO */}

            <div className="info-card">

              <div>

                <h3>
                  Chambre
                </h3>

                <p>
                  Chambre n° {room.numero}
                </p>

              </div>

            </div>


            {/* DISPONIBILITÉ */}

            <div className="info-card">

              <div>

                <h3>
                  Disponibilité
                </h3>

                <p
                  className={
                    room.disponible
                      ? "available"
                      : "unavailable"
                  }
                >

                  {room.disponible
                    ? "Disponible"
                    : "Indisponible"}

                </p>

              </div>

            </div>

          </div>


          {/* =================================
              SERVICES / OPTIONS
          ================================= */}

          <div className="room-services">

            <h2>
              Services inclus
            </h2>


            {options.length > 0 ? (

              <div className="services-list">

                {options.map((option) => (

                  <span
                    key={option.id}
                    className="service-item"
                  >

                    {option.nom}

                  </span>

                ))}

              </div>

            ) : (

              <p className="no-services">

                Aucun service supplémentaire
                n'est renseigné pour cette chambre.

              </p>

            )}

          </div>


          {/* =================================
              BUTTONS
          ================================= */}

          <div className="room-buttons">


            {/* RÉSERVATION */}

            {room.disponible ? (

              <button
                type="button"
                className="reserve-btn"
                onClick={handleReservation}
              >
                Réserver maintenant
              </button>

            ) : (

              <button
                type="button"
                className="reserve-btn disabled"
                disabled
              >
                Chambre indisponible
              </button>

            )}


            {/* RETOUR */}

            <Link
              to="/"
              className="back-btn"
            >
              ← Retour
            </Link>


          </div>


        </div>

      </main>

      <Footer />

    </>

  );

}

export default RoomDetail;
