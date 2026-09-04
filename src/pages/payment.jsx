import "./payment.css";

import {
  useLocation,
  useNavigate
} from "react-router-dom";

import { useState } from "react";

import Header from "../components/header";
import Navbar from "../components/navbar";
import Footer from "../components/footer";


function Payment() {

  const location = useLocation();
  const navigate = useNavigate();


  // =====================================================
  // DONNÉES
  // =====================================================

  const room =
    location.state?.room;

  const reservation =
    location.state?.reservation;


  // =====================================================
  // FORMULAIRE
  // =====================================================

  const [cardName, setCardName] =
    useState("");

  const [cardNumber, setCardNumber] =
    useState("");

  const [expiry, setExpiry] =
    useState("");

  const [cvv, setCvv] =
    useState("");


  const [showCvv, setShowCvv] =
    useState(false);


  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  // =====================================================
  // VÉRIFIER RÉSERVATION
  // =====================================================

  if (!room || !reservation) {

    return (

      <>

        <Header />
        <Navbar />

        <section className="payment-container">

          <div className="payment-card">

            <h2>
              Aucune réservation trouvée.
            </h2>

            <p>
              Veuillez créer une réservation
              avant de procéder au paiement.
            </p>

            <button
              className="pay-btn"
              type="button"
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


  // =====================================================
  // TOKEN
  // =====================================================

  const token =
    localStorage.getItem("token");


  // =====================================================
  // FORMAT NUMÉRO CARTE
  // =====================================================

  const formatCardNumber = (value) => {

    const numbers =
      value
        .replace(/\D/g, "")
        .substring(0, 16);


    const groups =
      numbers.match(/.{1,4}/g);


    return groups
      ? groups.join(" ")
      : "";

  };


  const handleCardNumber = (e) => {

    setCardNumber(
      formatCardNumber(
        e.target.value
      )
    );

  };


  // =====================================================
  // NUMÉRO MASQUÉ
  // =====================================================

  const getMaskedCardNumber = () => {

    if (!cardNumber) {

      return "•••• •••• •••• ••••";

    }


    const groups =
      cardNumber.split(" ");


    const masked =
      groups.map(
        (group, index) => {

          const isLast =
            index ===
            groups.length - 1;


          if (isLast) {

            return group.padEnd(
              4,
              "•"
            );

          }


          return "••••";

        }
      );


    while (
      masked.length < 4
    ) {

      masked.push("••••");

    }


    return masked.join(" ");

  };


  // =====================================================
  // TYPE CARTE
  // =====================================================

  const getCardBrand = () => {

    const firstDigit =
      cardNumber
        .replace(/\D/g, "")
        .charAt(0);


    if (firstDigit === "5") {

      return "mastercard";

    }


    if (firstDigit === "3") {

      return "amex";

    }


    return "visa";

  };


  // =====================================================
  // EXPIRATION
  // =====================================================

  const handleExpiry = (e) => {

    let value =
      e.target.value
        .replace(/\D/g, "");


    if (value.length > 4) {

      value =
        value.substring(0, 4);

    }


    if (value.length > 2) {

      value =
        value.substring(0, 2) +
        "/" +
        value.substring(2);

    }


    setExpiry(value);

  };


  // =====================================================
  // PAIEMENT
  // =====================================================

  const handlePayment = async (e) => {

    e.preventDefault();

    setError("");


    // ================================================
    // TOKEN
    // ================================================

    if (!token) {

      navigate("/login", {

        state: {
          from: "/payment"
        }

      });

      return;

    }


    // ================================================
    // VALIDATION NUMÉRO CARTE
    // ================================================

    const cleanCardNumber =
      cardNumber.replace(/\D/g, "");


    if (
      cleanCardNumber.length !== 16
    ) {

      setError(
        "Le numéro de carte doit contenir 16 chiffres."
      );

      return;

    }


    // ================================================
    // VALIDATION EXPIRATION
    // ================================================

    if (
      expiry.length !== 5
    ) {

      setError(
        "Veuillez entrer une date d'expiration valide."
      );

      return;

    }


    // ================================================
    // VALIDATION CVV
    // ================================================

    if (
      cvv.length !== 3
    ) {

      setError(
        "Le CVV doit contenir 3 chiffres."
      );

      return;

    }


    // ================================================
    // RESERVATION ID
    // ================================================

    const reservationId =
      reservation.reservation_id ||
      reservation.id;


    if (!reservationId) {

      setError(
        "Numéro de réservation introuvable."
      );

      return;

    }


    // ================================================
    // MONTANT
    // ================================================

    const montant =
      Number(
        reservation.prixTotal
      );


    if (
      !montant ||
      montant <= 0
    ) {

      setError(
        "Montant de paiement invalide."
      );

      return;

    }


    // ================================================
    // ENVOYER PAIEMENT BACKEND
    // ================================================

    try {

      setLoading(true);


      const response =
        await fetch(
          "http://localhost:5000/api/payments",
          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`

            },

            body: JSON.stringify({

              reservation_id:
                Number(reservationId),

              montant:
                montant,

              mode_paiement:
                "Carte bancaire"

            })

          }
        );


      const data =
        await response.json();


      console.log(
        "Paiement :",
        data
      );


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Le paiement a échoué."
        );

      }


      // ================================================
      // PAIEMENT RÉUSSI
      // ================================================

      navigate("/success", {

        state: {

          room:
            room,

          reservation:
            data.reservation ||
            reservation,

          payment:
            data.payment

        }

      });


    } catch (error) {

      console.error(
        "Erreur paiement :",
        error
      );


      setError(
        error.message ||
        "Une erreur est survenue pendant le paiement."
      );

    } finally {

      setLoading(false);

    }

  };


  const cardBrand =
    getCardBrand();


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <>

      <Header />

      <Navbar />


      <section className="payment-container">

        <div className="payment-card">


          <h1>
            Paiement sécurisé
          </h1>


          <div className="payment-content">


            {/* =================================================
                CARTE
            ================================================= */}

            <div className="payment-left">


              <div
                className={`bank-card ${
                  showCvv
                    ? "flip"
                    : ""
                }`}
              >


                {/* ================= FRONT ================= */}

                <div className="card-front">


                  <div
                    className="card-watermark"
                    aria-hidden="true"
                  >
                    HOTELIA&nbsp;PAY
                  </div>


                  <div
                    className="card-guilloche"
                    aria-hidden="true"
                  ></div>


                  <div className="card-header">


                    <div className="card-brand-lockup">


                      <span className="hotelia-monogram">
                        H
                      </span>


                      <div className="card-issuer">

                        <strong>
                          HOTELIA
                        </strong>

                        <small>
                          Paiement hôtelier sécurisé
                        </small>

                      </div>

                    </div>


                    <svg
                      className="contactless-icon"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >

                      <path
                        d="M8.5 4.5a10 10 0 0 1 0 15"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />

                      <path
                        d="M5.5 7.5a6.2 6.2 0 0 1 0 9"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />

                      <path
                        d="M2.7 10.2a2.6 2.6 0 0 1 0 3.6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />

                    </svg>

                  </div>


                  {/* CHIP */}

                  <div className="chip-wrapper">

                    <div className="chip">

                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>

                    </div>

                  </div>


                  {/* NUMÉRO */}

                  <div className="card-number-preview">

                    {getMaskedCardNumber()}

                  </div>


                  {/* FOOTER */}

                  <div className="card-footer">


                    <div>

                      <small>
                        CARD HOLDER
                      </small>

                      <p>
                        {cardName ||
                          "YOUR NAME"}
                      </p>

                    </div>


                    <div>

                      <small>
                        EXPIRES
                      </small>

                      <p>
                        {expiry ||
                          "MM/YY"}
                      </p>

                    </div>


                    <div
                      className={`card-network card-network--${cardBrand}`}
                    >

                      {cardBrand ===
                        "visa" && (

                        <span className="visa-wordmark">
                          VISA
                        </span>

                      )}


                      {cardBrand ===
                        "mastercard" && (

                        <span className="mastercard-mark">

                          <i></i>
                          <i></i>

                        </span>

                      )}


                      {cardBrand ===
                        "amex" && (

                        <span className="amex-wordmark">
                          AMEX
                        </span>

                      )}

                    </div>

                  </div>

                </div>


                {/* ================= BACK ================= */}

                <div className="card-back">


                  <div
                    className="card-watermark card-watermark--back"
                    aria-hidden="true"
                  >
                    HOTELIA&nbsp;PAY
                  </div>


                  <div className="black-line"></div>


                  <div className="white-strip">

                    <p className="signature-note">
                      Non valable sans signature
                    </p>


                    <div className="cvv-box">

                      {cvv || "***"}

                    </div>

                  </div>


                  <div className="card-back-footer">

                    <p className="back-text">
                      HOTELIA PAYMENT · Carte sécurisée
                    </p>


                    {cardBrand ===
                      "visa" && (

                      <span className="visa-wordmark visa-wordmark--back">
                        VISA
                      </span>

                    )}

                  </div>

                </div>

              </div>


              {/* INFORMATIONS */}

              <div className="payment-info">

                <h3>
                  Paiement sécurisé
                </h3>

                <p>
                  Votre transaction est protégée
                  par un système sécurisé Hotelia.
                </p>

                <p>
                  Vérifiez vos informations avant
                  de confirmer votre réservation.
                </p>

              </div>

            </div>


            {/* =================================================
                FORMULAIRE
            ================================================= */}

            <form
              className="payment-form"
              onSubmit={handlePayment}
            >


              <h2>
                Informations de paiement
              </h2>


              <p className="subtitle">
                Entrez les informations de votre carte bancaire
              </p>


              {/* ERROR */}

              {error && (

                <div className="payment-error">

                  {error}

                </div>

              )}


              {/* NOM */}

              <div className="input-group">

                <label>
                  Nom sur la carte
                </label>

                <input
                  type="text"
                  placeholder="Votre nom"
                  value={cardName}
                  onChange={(e) =>
                    setCardName(
                      e.target.value.toUpperCase()
                    )
                  }
                  required
                />

              </div>


              {/* NUMÉRO */}

              <div className="input-group">

                <label>
                  Numéro de carte
                </label>

                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={handleCardNumber}
                  inputMode="numeric"
                  required
                />

              </div>


              {/* EXPIRATION + CVV */}

              <div className="payment-row">


                <div className="input-group">

                  <label>
                    Date expiration
                  </label>

                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={handleExpiry}
                    required
                  />

                </div>


                <div className="input-group">

                  <label>
                    CVV
                  </label>

                  <input
                    type="password"
                    placeholder="***"
                    maxLength="3"
                    value={cvv}
                    onFocus={() =>
                      setShowCvv(true)
                    }
                    onBlur={() =>
                      setShowCvv(false)
                    }
                    onChange={(e) =>
                      setCvv(
                        e.target.value
                          .replace(/\D/g, "")
                      )
                    }
                    required
                  />

                </div>

              </div>


              {/* =================================================
                  MONTANT
              ================================================= */}

              <div className="amount-box">

                <span>
                  Montant à payer
                </span>


                <strong>
                  {Number(
                    reservation.prixTotal
                  ).toFixed(2)}{" "}
                  DT
                </strong>

              </div>


              {/* =================================================
                  PAYER
              ================================================= */}

              <button
                className="pay-btn"
                type="submit"
                disabled={loading}
              >

                {loading
                  ? "Traitement du paiement..."
                  : "Payer maintenant"}

              </button>


              {/* RETOUR */}

              <button
                type="button"
                className="payment-home-btn"
                onClick={() =>
                  navigate("/")
                }
                disabled={loading}
              >
                Retour à l'accueil
              </button>


            </form>


          </div>

        </div>

      </section>


      <Footer />

    </>

  );

}


export default Payment;