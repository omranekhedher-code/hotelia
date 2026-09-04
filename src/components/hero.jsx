import "./Hero.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Hero() {

  const navigate = useNavigate();

  const [arrivee, setArrivee] = useState("");
  const [depart, setDepart] = useState("");
  const [voyageurs, setVoyageurs] = useState("1");

  const handleSearch = (e) => {

    e.preventDefault();

    if (!arrivee || !depart) {
      alert("Veuillez sélectionner les dates.");
      return;
    }

    if (new Date(depart) <= new Date(arrivee)) {
      alert("La date de départ doit être après la date d'arrivée.");
      return;
    }

    console.log("RECHERCHE :", {
      arrivee,
      depart,
      voyageurs
    });

    navigate("/", {
      state: {
        search: true,
        arrivee,
        depart,
        voyageurs: Number(voyageurs)
      }
    });

    setTimeout(() => {

      document
        .getElementById("offers")
        ?.scrollIntoView({
          behavior: "smooth"
        });

    }, 100);

  };


  return (

    <section className="hero" id="top">

      <video
        autoPlay
        muted
        loop
        playsInline
        poster="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80"
      >

        <source
          src="/intro.mp4"
          type="video/mp4"
        />

      </video>


      <div className="hero-overlay" />


      <div className="hero-content">

        <div className="hero-copy">

          <span className="hero-badge">
            Évasions de luxe
          </span>

          <h1>
            Séjournez là où le confort rencontre
            une élégance intemporelle.
          </h1>

          <p>
            Découvrez des hôtels soigneusement sélectionnés
            qui offrent un confort inégalé, un service exceptionnel
            et une atmosphère raffinée.
          </p>


          <div className="hero-actions">

            <a
              className="button primary"
              href="#offers"
            >
              Explorer les séjours
            </a>

            <a
              className="button secondary"
              href="#reviews"
            >
              Lire les témoignages
            </a>

          </div>

        </div>


        {/* =========================
            RECHERCHE
        ========================= */}

        <form
          className="hero-search"
          onSubmit={handleSearch}
        >

          <div className="field">

            <label>
              Arrivée
            </label>

            <input
              type="date"
              value={arrivee}
              onChange={(e) =>
                setArrivee(e.target.value)
              }
              required
            />

          </div>


          <div className="field">

            <label>
              Départ
            </label>

            <input
              type="date"
              value={depart}
              onChange={(e) =>
                setDepart(e.target.value)
              }
              required
            />

          </div>


          <div className="field">

            <label>
              Voyageurs
            </label>

            <select
              value={voyageurs}
              onChange={(e) =>
                setVoyageurs(e.target.value)
              }
            >

              <option value="1">
                1 personne
              </option>

              <option value="2">
                2 personnes
              </option>

              <option value="3">
                3 personnes
              </option>

              <option value="4">
                4 personnes
              </option>

              <option value="5">
                5 personnes
              </option>

              <option value="6">
                6 personnes ou plus
              </option>

            </select>

          </div>


          <button type="submit">
            Rechercher
          </button>

        </form>

      </div>

    </section>
  );
}

export default Hero;