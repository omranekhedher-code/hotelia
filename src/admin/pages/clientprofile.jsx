import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Header from "../../components/header";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";


function ClientProfile() {

  // ==========================================
  // ID CLIENT FROM URL
  // ==========================================

  const { id } = useParams();


  const [client, setClient] = useState({

    id: "",

    nom: "",

    prenom: "",

    email: "",

    telephone: "",

    role: "",

  });


  const [history, setHistory] = useState([]);


  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  const [saving, setSaving] = useState(false);

  const [password, setPassword] = useState("");


  // ==========================================
  // RÉCUPÉRER CLIENT
  // ==========================================

  useEffect(() => {

    const fetchClient = async () => {

      try {

        setLoading(true);

        setError("");


        // ==========================================
        // VÉRIFIER ID
        // ==========================================

        if (!id) {

          throw new Error(
            "Identifiant client manquant."
          );

        }


        // ==========================================
        // GET CLIENT
        // ==========================================

        const response = await fetch(

          `http://localhost:5000/api/users/${id}`

        );


        const data =
          await response.json();


        console.log(
          "Client reçu du backend :",
          data
        );


        if (!response.ok) {

          throw new Error(

            data.message ||
            "Client introuvable"

          );

        }


        // ==========================================
        // REMPLIR CLIENT
        // ==========================================

        setClient({

          id:
            data.id,

          nom:
            data.nom || "",

          prenom:
            data.prenom || "",

          email:
            data.email || "",

          telephone:
            data.telephone || "",

          role:
            data.role || ""

        });


        // ==========================================
        // GET RÉSERVATIONS CLIENT
        // ==========================================

        const reservationResponse =
          await fetch(

            `http://localhost:5000/api/reservations/user/${id}`

          );


        const reservations =
          await reservationResponse.json();


        console.log(
          "Réservations client :",
          reservations
        );


        if (
          reservationResponse.ok &&
          Array.isArray(reservations)
        ) {

          setHistory(
            reservations
          );

        } else {

          setHistory([]);

        }


      } catch (err) {

        console.error(
          "Erreur ClientProfile :",
          err
        );

        setError(
          err.message
        );

      } finally {

        setLoading(false);

      }

    };


    fetchClient();

  }, [id]);


  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;


    setClient(prev => ({

      ...prev,

      [name]:
        value

    }));


    setMessage("");

    setError("");

  };


  // ==========================================
  // MODIFIER CLIENT
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");

    setError("");

    setSaving(true);


    try {

      const body = {

        nom:
          client.nom,

        prenom:
          client.prenom,

        email:
          client.email,

        telephone:
          client.telephone

      };


      // Password seulement s'il est rempli

      if (
        password.trim() !== ""
      ) {

        body.password =
          password;

      }


      console.log(
        "Données client envoyées :",
        body
      );


      const response = await fetch(

        `http://localhost:5000/api/users/${client.id}`,

        {

          method: "PUT",

          headers: {

            "Content-Type":
              "application/json"

          },

          body:
            JSON.stringify(body)

        }

      );


      const data =
        await response.json();


      console.log(
        "Réponse backend :",
        data
      );


      if (!response.ok) {

        throw new Error(

          data.message ||
          "Erreur modification client"

        );

      }


      // ==========================================
      // UPDATE CLIENT
      // ==========================================

      setClient(prev => ({

        ...prev,

        nom:
          data.user.nom || "",

        prenom:
          data.user.prenom || "",

        email:
          data.user.email || "",

        telephone:
          data.user.telephone || "",

        role:
          data.user.role || ""

      }));


      setPassword("");


      setMessage(
        "Profil client modifié avec succès."
      );


    } catch (err) {

      console.error(
        "Erreur modification client :",
        err
      );

      setError(
        err.message
      );

    } finally {

      setSaving(false);

    }

  };


  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {

    if (!date) {

      return "-";

    }


    const d =
      new Date(date);


    if (
      isNaN(
        d.getTime()
      )
    ) {

      return date;

    }


    return d.toLocaleDateString(
      "fr-FR"
    );

  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="client-profile-page">

        <Header />

        <Navbar />


        <main className="client-profile-content">

          <div className="client-profile-loading">

            <h2>
              Profil Client
            </h2>

            <p>
              Chargement...
            </p>

          </div>

        </main>


        <Footer />

      </div>

    );

  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error && !client.id) {

    return (

      <div className="client-profile-page">

        <Header />

        <Navbar />


        <main className="client-profile-content">

          <div className="client-profile-error">

            <h2>
              Profil Client
            </h2>

            <p>
              {error}
            </p>

          </div>

        </main>


        <Footer />

      </div>

    );

  }


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="client-profile-page">


      {/* ==================================
                HEADER
            ================================== */}

      <Header />

      <Navbar />


      {/* ==================================
                CONTENT
            ================================== */}

      <main className="client-profile-content">


        <div className="client-profile-container">


          {/* ==================================
                        PAGE HEADER
                    ================================== */}

          <div className="client-profile-header">

            <span className="client-profile-label">
              HOTELIA
            </span>


            <h1>
              Profil Client
            </h1>


            <p>
              Informations et historique du client
            </p>

          </div>


          {/* ==================================
                        CARD
                    ================================== */}

          <div className="client-profile-card">


            {/* ==================================
                            INFORMATIONS PERSONNELLES
                        ================================== */}

            <section className="client-profile-section">

              <h2>
                Informations personnelles
              </h2>


              <div className="client-info-grid">


                <div className="client-info-item">

                  <span>
                    Nom
                  </span>

                  <strong>
                    {client.nom || "-"}
                  </strong>

                </div>


                <div className="client-info-item">

                  <span>
                    Prénom
                  </span>

                  <strong>
                    {client.prenom || "-"}
                  </strong>

                </div>


                <div className="client-info-item">

                  <span>
                    Email
                  </span>

                  <strong>
                    {client.email || "-"}
                  </strong>

                </div>


                <div className="client-info-item">

                  <span>
                    Téléphone
                  </span>

                  <strong>
                    {client.telephone || "-"}
                  </strong>

                </div>


              </div>

            </section>


            {/* ==================================
                            INFORMATIONS COMPTE
                        ================================== */}

            <section className="client-profile-section">

              <h2>
                Informations du compte
              </h2>


              <div className="client-info-grid">


                <div className="client-info-item">

                  <span>
                    Identifiant
                  </span>

                  <strong>
                    #{client.id}
                  </strong>

                </div>


                <div className="client-info-item">

                  <span>
                    Rôle
                  </span>

                  <strong>
                    {client.role === "user"
                      ? "Client"
                      : client.role || "-"
                    }
                  </strong>

                </div>


                <div className="client-info-item">

                  <span>
                    Nombre de réservations
                  </span>

                  <strong>
                    {history.length}
                  </strong>

                </div>


              </div>

            </section>


            {/* ==================================
                            MODIFICATION
                        ================================== */}

            <section className="client-profile-section">

              <h2>
                Modifier le profil
              </h2>


              {message && (

                <div className="client-success-message">

                  {message}

                </div>

              )}


              {error && (

                <div className="client-error-message">

                  {error}

                </div>

              )}


              <form
                className="client-profile-form"
                onSubmit={handleSubmit}
              >


                <div className="client-form-grid">


                  <div className="client-form-group">

                    <label>
                      Nom
                    </label>

                    <input
                      type="text"
                      name="nom"
                      value={client.nom}
                      onChange={handleChange}
                      required
                    />

                  </div>


                  <div className="client-form-group">

                    <label>
                      Prénom
                    </label>

                    <input
                      type="text"
                      name="prenom"
                      value={client.prenom}
                      onChange={handleChange}
                      required
                    />

                  </div>


                  <div className="client-form-group">

                    <label>
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={client.email}
                      onChange={handleChange}
                      required
                    />

                  </div>


                  <div className="client-form-group">

                    <label>
                      Téléphone
                    </label>

                    <input
                      type="text"
                      name="telephone"
                      value={client.telephone}
                      onChange={handleChange}
                    />

                  </div>


                  <div className="client-form-group client-full-width">

                    <label>
                      Nouveau mot de passe
                    </label>

                    <input
                      type="password"
                      value={password}
                      onChange={(e) =>
                        setPassword(
                          e.target.value
                        )
                      }
                      placeholder="Laisser vide pour conserver l'ancien"
                    />

                  </div>


                </div>


                <button
                  type="submit"
                  className="client-save-btn"
                  disabled={saving}
                >

                  {saving
                    ? "Modification..."
                    : "Modifier le profil"
                  }

                </button>


              </form>

            </section>


            {/* ==================================
                            HISTORIQUE RÉSERVATIONS
                        ================================== */}

            {/* ==========================================
    HISTORIQUE DES RÉSERVATIONS
========================================== */}

            <section className="client-history-section">

              {/* HEADER */}

              <div className="client-history-header">

                <div className="client-history-title">

                  <h2>
                    Historique des réservations
                  </h2>

                  <p>
                    Toutes les réservations effectuées par ce client
                  </p>

                </div>


                <span className="client-history-count">
                  {history.length}
                </span>

              </div>


              {/* ==========================================
        AUCUNE RÉSERVATION
    ========================================== */}

              {history.length === 0 ? (

                <div className="client-empty-history">

                  <div className="client-empty-history-icon">
                    📅
                  </div>

                  <h3>
                    Aucune réservation
                  </h3>

                  <p>
                    Ce client n'a encore effectué aucune réservation.
                  </p>

                </div>

              ) : (

                /* ==========================================
                   TABLEAU
                ========================================== */

                <div className="client-history-table-container">

                  <table className="client-history-table">

                    <thead>

                      <tr>

                        <th>
                          Chambre
                        </th>

                        <th>
                          Arrivée
                        </th>

                        <th>
                          Départ
                        </th>

                        <th>
                          Personnes
                        </th>

                        <th>
                          Prix total
                        </th>

                        <th>
                          Solde
                        </th>

                        <th>
                          Statut
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {history.map((item) => (

                        <tr key={item.id}>

                          {/* CHAMBRE */}

                          <td>

                            <div className="client-room">

                              <span className="client-room-type">

                                {item.type ||
                                  "Chambre"}

                              </span>


                              {item.numero && (

                                <span className="client-room-number">

                                  Chambre #{item.numero}

                                </span>

                              )}

                            </div>

                          </td>


                          {/* ARRIVÉE */}

                          <td>

                            <span className="client-date">

                              {formatDate(
                                item.date_arriv
                              )}

                            </span>

                          </td>


                          {/* DÉPART */}

                          <td>

                            <span className="client-date">

                              {formatDate(
                                item.date_depart
                              )}

                            </span>

                          </td>


                          {/* PERSONNES */}

                          <td>

                            <span className="client-guests">

                              {item.nb_per || 0}

                            </span>

                          </td>


                          {/* PRIX */}

                          <td>

                            <span className="client-price">

                              {item.prix_total || 0}
                              {" "}TND

                            </span>

                          </td>


                          {/* SOLDE */}

                          <td>

                            <span className="client-balance">

                              {item.solde || 0}
                              {" "}TND

                            </span>

                          </td>


                          {/* STATUT */}

                          <td>

                            <span
                              className={`client-history-status ${String(
                                item.status || ""
                              )
                                  .toLowerCase()
                                  .normalize("NFD")
                                  .replace(
                                    /[\u0300-\u036f]/g,
                                    ""
                                  )
                                  .replace(
                                    /\s+/g,
                                    "-"
                                  )
                                }`}
                            >

                              {item.status ||
                                "Inconnu"}

                            </span>

                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              )}

            </section>


            {/* ==================================
                            STATUS
                        ================================== */}

            <section className="client-profile-status">

              <div>

                <span className="client-status-label">
                  Statut du compte
                </span>


                <span className="client-status">
                  Actif
                </span>

              </div>

            </section>


          </div>

        </div>

      </main>


      {/* ==================================
                FOOTER
            ================================== */}

      <Footer />

    </div>

  );

}


export default ClientProfile;