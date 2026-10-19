import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./promotions.css";

function Promotions() {
  const navigate = useNavigate();

  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // RÉCUPÉRER LES PROMOTIONS
  // =====================================================

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:8080/api/promotions"
        );

        const data = await response.json();

        console.log("Promotions reçues :", data);

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Erreur lors du chargement des promotions."
          );
        }

        setPromotions(
          Array.isArray(data) ? data : []
        );
      } catch (err) {
        console.error(
          "Erreur promotions :",
          err
        );

        setError(
          "Impossible de charger les promotions."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  // =====================================================
  // CLIQUER SUR UNE PROMOTION
  // =====================================================

  const handlePromotionClick = (promotion) => {
    navigate(`/promotion/${promotion.id}`);
  };

  // =====================================================
  // IMAGE URL
  //
  // Les images sont dans:
  // public/
  //
  // Exemple:
  // public/chambre1.jpg
  //
  // DB:
  // image = chambre1.jpg
  //
  // URL:
  // /chambre1.jpg
  // =====================================================

  const getImageUrl = (image) => {
    if (!image) {
      return null;
    }

    // Si c'est déjà une URL complète
    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    // Image située dans public/
    return `/${String(image).replace(/^\/+/, "")}`;
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <section className="promotions-section">
        <div className="promotions-container">

          <div className="promotions-header">

            <span className="section-label">
              NOS OFFRES
            </span>

            <h2>
              Promotions
            </h2>

            <p>
              Découvrez nos offres exclusives
            </p>

          </div>

          <div className="promotions-loading">
            Chargement des promotions...
          </div>

        </div>
      </section>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <section className="promotions-section">

        <div className="promotions-container">

          <div className="promotions-header">

            <span className="section-label">
              NOS OFFRES
            </span>

            <h2>
              Promotions
            </h2>

          </div>

          <div className="promotions-error">
            {error}
          </div>

        </div>

      </section>
    );
  }

  // =====================================================
  // AUCUNE PROMOTION
  // =====================================================

  if (promotions.length === 0) {
    return null;
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <section className="promotions-section">

      <div className="promotions-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="promotions-header">

          <span className="section-label">
            OFFRES EXCLUSIVES
          </span>

          <h2>
            Nos Promotions
          </h2>

          <p>
            Profitez de nos meilleures offres et
            bénéficiez de tarifs exceptionnels.
          </p>

        </div>

        {/* =================================================
            LISTE DES PROMOTIONS
        ================================================= */}

        <div className="promotions-grid">

          {promotions.map((promotion) => {

            const discount = Number(
              promotion.reduction ||
                promotion.discount ||
                promotion.pourcentage ||
                0
            );

            const imageUrl =
              getImageUrl(
                promotion.image
              );

            console.log(
              `Promotion ${promotion.id} image :`,
              promotion.image,
              "→",
              imageUrl
            );

            return (

              <div
                className="promotion-card"
                key={promotion.id}
                onClick={() =>
                  handlePromotionClick(
                    promotion
                  )
                }
              >

                {/* =================================================
                    BADGE REDUCTION
                ================================================= */}

                {discount > 0 && (

                  <div className="promotion-badge">
                    -{discount}%
                  </div>

                )}

                {/* =================================================
                    IMAGE
                ================================================= */}

                <div className="promotion-image">

                  {imageUrl ? (

                    <img
                      src={imageUrl}
                      alt={
                        promotion.titre ||
                        "Promotion Hotelia"
                      }
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

                    <div className="promotion-image-placeholder">
                      HOTELIA
                    </div>

                  )}

                </div>

                {/* =================================================
                    CONTENT
                ================================================= */}

                <div className="promotion-content">

                  <span className="promotion-label">
                    OFFRE LIMITÉE
                  </span>

                  <h3>
                    {promotion.titre ||
                      promotion.nom ||
                      "Promotion spéciale"}
                  </h3>

                  <p>
                    {promotion.description ||
                      "Profitez de cette offre exceptionnelle chez Hotelia."}
                  </p>

                  {/* ROOM */}

                  {promotion.room_type && (

                    <div className="promotion-room">
                      {promotion.room_type}
                    </div>

                  )}

                  {/* =================================================
                      BUTTON
                  ================================================= */}

                  <button
                    type="button"
                    className="promotion-button"
                    onClick={(e) => {

                      e.stopPropagation();

                      handlePromotionClick(
                        promotion
                      );

                    }}
                  >
                    Voir l'offre
                  </button>

                </div>

              </div>

            );

          })}

        </div>

      </div>

    </section>
  );
}

export default Promotions;
