import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";

import "./userpromotiondetails.css";


function UserPromotionDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [promotion, setPromotion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // =====================================================
  // RÉCUPÉRER LA PROMOTION
  // =====================================================

  useEffect(() => {

    const fetchPromotion = async () => {

      try {

        setLoading(true);
        setError("");


        const response = await fetch(
          `http://localhost:8080/api/promotions/${id}`
        );


        const data = await response.json();


        console.log(
          "Promotion reçue :",
          data
        );


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Promotion introuvable."
          );

        }


        setPromotion(data);


      } catch (err) {

        console.error(
          "Erreur promotion :",
          err
        );


        setError(
          err.message ||
          "Impossible de charger la promotion."
        );


      } finally {

        setLoading(false);

      }

    };


    if (id) {

      fetchPromotion();

    }

  }, [id]);


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <>

        <Header />

        <Navbar />

        <main className="promotion-details-page">

          <div className="promotion-details-container">

            <div className="promotion-details-loading">

              Chargement de la promotion...

            </div>

          </div>

        </main>

        <Footer />

      </>

    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error || !promotion) {

    return (

      <>

        <Header />

        <Navbar />

        <main className="promotion-details-page">

          <div className="promotion-details-container">

            <div className="promotion-details-error">

              <h2>
                Promotion introuvable
              </h2>


              <p>

                {error ||
                  "Cette promotion n'existe pas ou n'est plus disponible."
                }

              </p>


              <button

                type="button"

                onClick={() =>
                  navigate("/")
                }

              >

                Retour à l'accueil

              </button>

            </div>

          </div>

        </main>

        <Footer />

      </>

    );

  }


  // =====================================================
  // DONNÉES PROMOTION
  // =====================================================

  const title =
    promotion.titre ||
    "Promotion spéciale";


  const discount =
    Number(
      promotion.reduction || 0
    );


  // =====================================================
  // DONNÉES ROOM
  // =====================================================

  const roomId =
    promotion.room_id ||
    promotion.promotion_room_id ||
    null;


  const roomType =
    promotion.room_type ||
    "Chambre";


  const roomNumber =
    promotion.room_numero ||
    "";


  const roomPrice =
    Number(
      promotion.prix_par_nuit || 0
    );


  const description =
    promotion.description ||
    "Profitez de cette offre exceptionnelle chez Hotelia.";


  // =====================================================
  // CALCUL DU NOUVEAU PRIX
  // =====================================================

  let newPrice = roomPrice;


  if (
    discount > 0 &&
    roomPrice > 0
  ) {

    newPrice =
      roomPrice -
      (
        roomPrice *
        discount
      ) /
      100;

  }


  // =====================================================
  // IMAGE
  //
  // Les images sont dans:
  //
  // hotelia/public/
  //
  // Exemple:
  //
  // public/chambre1.jpg
  //
  // DB:
  //
  // image = "chambre1.jpg"
  //
  // URL:
  //
  // /chambre1.jpg
  // =====================================================

  const image =
    promotion.image ||
    null;


  const imageUrl =

    image

      ? (

        image.startsWith("http://") ||
        image.startsWith("https://")

          ? image

          : `/${String(image).replace(
              /^\/+/,
              ""
            )}`

      )

      : null;


  console.log(
    "Image DB :",
    image
  );


  console.log(
    "Image URL :",
    imageUrl
  );


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
  // RÉSERVER
  // =====================================================

  const handleReservation = () => {

    if (!roomId) {

      alert(
        "Cette promotion n'est associée à aucune chambre."
      );

      return;

    }


    const room = {

      id: roomId,

      numero: roomNumber,

      type: roomType,

      prix_par_nuit: newPrice,

      prix_original: roomPrice,

      image: image,

      description: description

    };


    const promotionData = {

      id: promotion.id,

      titre: title,

      reduction: discount,

      date_debut:
        promotion.date_debut,

      date_fin:
        promotion.date_fin

    };


    navigate(
      `/reservation/${roomId}`,
      {
        state: {

          room,

          promotion:
            promotionData

        }

      }
    );

  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <>

      {/* =================================================
          HEADER
      ================================================= */}

      <Header />


      {/* =================================================
          NAVBAR
      ================================================= */}

      <Navbar />


      {/* =================================================
          PROMOTION DETAILS
      ================================================= */}

      <main className="promotion-details-page">

        <div className="promotion-details-container">


          {/* =================================================
              RETOUR
          ================================================= */}

          


          {/* =================================================
              MAIN CARD
          ================================================= */}

          <div className="promotion-details-card">


            {/* =================================================
                IMAGE
            ================================================= */}

            <div className="promotion-details-image">


              {imageUrl ? (

                <img

                  src={imageUrl}

                  alt={title}

                  onError={(e) => {

                    console.error(
                      "❌ Image introuvable :",
                      imageUrl
                    );


                    e.currentTarget.style.display =
                      "none";

                  }}

                />

              ) : (

                <div className="promotion-details-placeholder">

                  HOTELIA

                </div>

              )}


              {/* DISCOUNT */}

              {discount > 0 && (

                <span className="promotion-details-discount">

                  -{discount}%

                </span>

              )}

            </div>


            {/* =================================================
                CONTENT
            ================================================= */}

            <div className="promotion-details-content">


              {/* LABEL */}

              <span className="promotion-details-label">

                OFFRE EXCLUSIVE

              </span>


              {/* TITLE */}

              <h1>

                {title}

              </h1>


              {/* DESCRIPTION */}

              <p className="promotion-details-description">

                {description}

              </p>


              {/* =================================================
                  ROOM
              ================================================= */}

              <div className="promotion-details-room">


                <h3>

                  Détails de la chambre

                </h3>


                <div className="room-detail-row">


                  <span>

                    Type

                  </span>


                  <strong>

                    {roomType}

                  </strong>


                </div>


                {roomNumber && (

                  <div className="room-detail-row">


                    <span>

                      Numéro

                    </span>


                    <strong>

                      {roomNumber}

                    </strong>


                  </div>

                )}


              </div>


              {/* =================================================
                  DATES PROMOTION
              ================================================= */}

              <div className="promotion-details-dates">


                <div>

                  <span>

                    Début de l'offre

                  </span>


                  <strong>

                    {formatDate(
                      promotion.date_debut
                    )}

                  </strong>

                </div>


                <div>

                  <span>

                    Fin de l'offre

                  </span>


                  <strong>

                    {formatDate(
                      promotion.date_fin
                    )}

                  </strong>

                </div>


              </div>


              {/* =================================================
                  PRIX
              ================================================= */}

              {roomPrice > 0 && (

                <div className="promotion-details-price">


                  <div className="promotion-price-label">

                    Prix par nuit

                  </div>


                  {/* ANCIEN PRIX */}

                  {discount > 0 && (

                    <span className="promotion-old-price">

                      {roomPrice.toFixed(2)} DT

                    </span>

                  )}


                  {/* NOUVEAU PRIX */}

                  <div className="promotion-new-price">

                    {newPrice.toFixed(2)} DT

                    <span>

                      / nuit

                    </span>

                  </div>


                  {/* ÉCONOMIE */}

                  {discount > 0 && (

                    <div className="promotion-saving">

                      Vous économisez{" "}

                      {(
                        roomPrice -
                        newPrice
                      ).toFixed(2)}{" "}

                      DT / nuit

                    </div>

                  )}


                </div>

              )}


              {/* =================================================
                  ACTION
              ================================================= */}

              <button

                type="button"

                className="promotion-reserve-btn"

                onClick={
                  handleReservation
                }

              >

                Réserver maintenant

              </button>


            </div>

          </div>

        </div>

      </main>


      {/* =================================================
          FOOTER
      ================================================= */}

      <Footer />

    </>

  );

}


export default UserPromotionDetails;