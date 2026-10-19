import "./Offers.css";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function Offers() {

  const location = useLocation();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ==============================
  // RÉCUPÉRER RECHERCHE
  // ==============================

  const search = location.state?.search || false;

  const arrivee = location.state?.arrivee || "";
  const depart = location.state?.depart || "";

  const voyageurs =
    Number(location.state?.voyageurs) || 0;


  // ==============================
  // DEBUG
  // ==============================

  console.log("SEARCH :", search);
  console.log("ARRIVEE :", arrivee);
  console.log("DEPART :", depart);
  console.log("VOYAGEURS :", voyageurs);


  // ==============================
  // GET ROOMS
  // ==============================

  useEffect(() => {

    const fetchRooms = async () => {

      try {

        const response = await fetch(
          "http://localhost:8080/api/rooms"
        );

        if (!response.ok) {
          throw new Error(
            "Impossible de récupérer les chambres."
          );
        }

        const data = await response.json();

        console.log("ROOMS :", data);

        setRooms(data);

      } catch (error) {

        console.error(error);

        setError(
          "Impossible de charger les chambres."
        );

      } finally {

        setLoading(false);

      }

    };

    fetchRooms();

  }, []);


  // ==============================
  // FILTRE
  // ==============================

  const filteredRooms = rooms.filter((room) => {

    // Pas de recherche
    if (!search) {
      return true;
    }


    const capacite =
      Number(room.capacite);


    console.log(
      "ROOM :",
      room.type,
      "CAPACITE :",
      capacite,
      "VOYAGEURS :",
      voyageurs
    );


    return capacite >= voyageurs;

  });


  // ==============================
  // STARS
  // ==============================

  const renderStars = (rating) => {

    const value =
      Number(rating) || 0;

    return (

      <span className="rating">

        {[1, 2, 3, 4, 5].map((star) => (

          <span
            key={star}
            className={
              star <= Math.round(value)
                ? "star active"
                : "star"
            }
          >
            ★
          </span>

        ))}

      </span>

    );

  };


  return (

    <section
      className="offers"
      id="offers"
    >

      <div className="offers-header">

        <h2>
          Séjours à la carte
        </h2>

        <p>
          Des chambres de luxe soigneusement
          sélectionnées pour des escapades
          inoubliables.
        </p>

      </div>


      {/* ==============================
          RÉSULTAT RECHERCHE
      ============================== */}

      {search && (

        <div className="search-result-info">

          <h3>
            Résultats de votre recherche
          </h3>

          <p>
            📅 {arrivee} → {depart}
          </p>

          <p>
            👥 {voyageurs}{" "}
            {voyageurs === 1
              ? "voyageur"
              : "voyageurs"}
          </p>

        </div>

      )}


      {/* ==============================
          LOADING
      ============================== */}

      {loading && (

        <div className="offers-message">
          Chargement des chambres...
        </div>

      )}


      {/* ==============================
          ERROR
      ============================== */}

      {!loading && error && (

        <div className="offers-message offers-error">
          {error}
        </div>

      )}


      {/* ==============================
          NO RESULT
      ============================== */}

      {!loading &&
        !error &&
        filteredRooms.length === 0 && (

          <div className="offers-message">

            Aucune chambre disponible
            pour cette recherche.

          </div>

        )
      }


      {/* ==============================
          ROOMS
      ============================== */}

      {!loading &&
        !error &&
        filteredRooms.length > 0 && (

          <div className="hotel-cards">

            {filteredRooms.map((room) => (

              <div
                className="hotel-card"
                key={room.id}
              >

                <div className="card-badge">
                  En vedette
                </div>


                <img
                  src={
                    room.image
                      ? `/${room.image}`
                      : "/imaged.png"
                  }
                  alt={room.type}
                />


                <div className="card-content">

                  <div className="card-topline">

                    {renderStars(
                      room.rating
                    )}

                    <span className="pill">
                      Hotelia
                    </span>

                  </div>


                  <h3>
                    {room.type}
                  </h3>


                  <p>
                    {room.description}
                  </p>


                  <p className="capacity">
                    👥 {room.capacite} voyageurs
                  </p>


                  <div className="card-footer">

                    <strong>
                      {room.prix_par_nuit} DT / nuit
                    </strong>


                    <Link
                      to={`/room/${room.id}`}
                      className="reserve-btn"
                    >

                      <button type="button">
                        Réserver
                      </button>

                    </Link>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )
      }

    </section>

  );
}

export default Offers;