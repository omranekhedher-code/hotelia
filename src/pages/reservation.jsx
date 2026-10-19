import "./reservation.css";

import {
  useParams,
  useNavigate
} from "react-router-dom";

import {
  useEffect,
  useState
} from "react";

import Navbar from "../components/navbar";
import Footer from "../components/footer";


function Reservation() {

  const { id } = useParams();
  const navigate = useNavigate();


  // ==========================================
  // ROOM
  // ==========================================

  const [room, setRoom] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");


  // ==========================================
  // FORM
  // ==========================================

  const [formData, setFormData] = useState({

    nom: "",
    email: "",

    dateArrivee: "",
    dateDepart: "",

    personnes: ""

  });


  // ==========================================
  // USER
  // ==========================================

  useEffect(() => {

    const user =
      JSON.parse(
        localStorage.getItem("user")
      );

    if (user) {

      setFormData((prev) => ({

        ...prev,

        nom:
          `${user.prenom || ""} ${user.nom || ""}`.trim(),

        email:
          user.email || ""

      }));

    }

  }, []);


  // ==========================================
  // TODAY
  // ==========================================

  const today =
    new Date()
      .toISOString()
      .split("T")[0];


  // ==========================================
  // GET ROOM
  // ==========================================

  useEffect(() => {

    const fetchRoom = async () => {

      try {

        setLoading(true);
        setError("");

        const response =
          await fetch(
            `http://localhost:8080/api/rooms/${id}`
          );


        if (!response.ok) {

          throw new Error(
            "Chambre introuvable"
          );

        }


        const data =
          await response.json();


        console.log(
          "Room réservation :",
          data
        );


        setRoom(data);


      } catch (error) {

        console.error(
          "Erreur chambre :",
          error
        );

        setError(
          "Chambre introuvable"
        );


      } finally {

        setLoading(false);

      }

    };


    fetchRoom();

  }, [id]);


  // ==========================================
  // CHANGE INPUT
  // ==========================================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;


    setFormData((prev) => ({

      ...prev,

      [name]: value

    }));


    if (error) {

      setError("");

    }

  };


  // ==========================================
  // CALCUL NIGHTS
  // ==========================================

  const calculateNights = () => {

    if (
      !formData.dateArrivee ||
      !formData.dateDepart
    ) {

      return 0;

    }


    const arrivee =
      new Date(
        formData.dateArrivee
      );

    const depart =
      new Date(
        formData.dateDepart
      );


    const difference =
      depart - arrivee;


    const nights =
      difference /
      (1000 * 60 * 60 * 24);


    return nights > 0
      ? nights
      : 0;

  };


  const numberOfNights =
    calculateNights();


  // ==========================================
  // TOTAL
  // ==========================================

  const totalPrice =
    room &&
    numberOfNights > 0

      ? Number(room.prix_par_nuit) *
        numberOfNights

      : 0;


  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");


    // ======================================
    // TOKEN
    // ======================================

    const token =
      localStorage.getItem("token");


    if (!token) {

      navigate("/login", {

        state: {

          from:
            `/reservation/${id}`

        }

      });

      return;

    }


    // ======================================
    // DATES
    // ======================================

    if (
      !formData.dateArrivee ||
      !formData.dateDepart
    ) {

      setError(
        "Veuillez sélectionner les dates."
      );

      return;

    }


    const dateArrivee =
      new Date(
        formData.dateArrivee
      );

    const dateDepart =
      new Date(
        formData.dateDepart
      );

    const currentDate =
      new Date(today);


    if (dateArrivee < currentDate) {

      setError(
        "La date d'arrivée ne peut pas être dans le passé."
      );

      return;

    }


    if (dateDepart <= dateArrivee) {

      setError(
        "La date de départ doit être après la date d'arrivée."
      );

      return;

    }


    // ======================================
    // PERSONNES
    // ======================================

    const personnes =
      Number(formData.personnes);

    const capacite =
      Number(room.capacite);


    if (!personnes || personnes < 1) {

      setError(
        "Veuillez sélectionner le nombre de personnes."
      );

      return;

    }


    if (personnes > capacite) {

      setError(
        `Cette chambre peut accueillir au maximum ${capacite} voyageurs.`
      );

      return;

    }


    // ======================================
    // DISPONIBILITÉ
    // ======================================

    if (!room.disponible) {

      setError(
        "Cette chambre n'est pas disponible."
      );

      return;

    }


    // ======================================
    // NIGHTS
    // ======================================

    const nights =
      calculateNights();


    if (nights <= 0) {

      setError(
        "La durée du séjour doit être d'au moins une nuit."
      );

      return;

    }


    // ======================================
    // CREATE RESERVATION
    // ======================================

    try {

      setSubmitting(true);


      const response =
        await fetch(
          "http://localhost:8080/api/reservations",
          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`

            },

            body: JSON.stringify({

              room_id:
                Number(id),

              date_arriv:
                formData.dateArrivee,

              date_depart:
                formData.dateDepart,

              nb_per:
                personnes,

              prix_total:
                totalPrice

            })

          }
        );


      const data =
        await response.json();


      console.log(
        "Reservation créée :",
        data
      );


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Impossible de créer la réservation."
        );

      }


      if (!data.reservation) {

        throw new Error(
          "Réservation non retournée par le serveur."
        );

      }


      // ======================================
      // DONNÉES RÉSERVATION
      // ======================================

      const reservationData = {

        ...formData,

        id:
          data.reservation.id,

        reservation_id:
          data.reservation.id,

        room_id:
          Number(id),

        nombreNuits:
          nights,

        prixTotal:
          totalPrice

      };


      // ======================================
      // RESERVATION SUCCESS
      // ======================================
      //
      // IMPORTANT :
      // On ne va plus directement vers Payment.
      //
      // On affiche d'abord :
      //
      // "Réservation créée avec succès"
      //
      // puis l'utilisateur choisit :
      //
      // -> Payer maintenant
      // -> Retour à l'accueil
      //

      navigate(
        "/reservation-success",
        {

          state: {

            room:
              room,

            reservation:
              reservationData

          }

        }

      );


    } catch (error) {

      console.error(
        "Erreur réservation :",
        error
      );


      setError(
        error.message ||
        "Une erreur est survenue."
      );


    } finally {

      setSubmitting(false);

    }

  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <>

        <Navbar />

        <section className="reservation-container">

          <div className="reservation-card">

            <h1>
              Chargement...
            </h1>

            <p>
              Nous préparons votre réservation.
            </p>

          </div>

        </section>

        <Footer />

      </>

    );

  }


  // ==========================================
  // ROOM ERROR
  // ==========================================

  if (!room) {

    return (

      <>

        <Navbar />

        <section className="reservation-container">

          <div className="reservation-card">

            <h1>
              Chambre introuvable
            </h1>

            <p>
              Cette chambre n'existe pas ou n'est plus disponible.
            </p>

            <button
              type="button"
              className="continue-btn"
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
  // PAGE
  // ==========================================

  return (

    <>

      <Navbar />


      <section className="reservation-container">

        <div className="reservation-card">


          <h1>
            Réserver votre chambre
          </h1>


          <p className="reservation-subtitle">
            Complétez les informations de votre séjour
          </p>


          {/* =================================
              ROOM
          ================================= */}

          <div className="reservation-room">

            <img
              src={
                room.image
                  ? `/${room.image}`
                  : "/imaged.png"
              }
              alt={room.type}
            />


            <div>

              <h2>
                {room.type}
              </h2>

              <p>
                {room.prix_par_nuit} DT / nuit
              </p>

              <p>
                Capacité :
                {" "}
                {room.capacite}
                {" "}
                voyageurs
              </p>

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


          {/* =================================
              ERROR
          ================================= */}

          {error && (

            <div className="reservation-error">

              {error}

            </div>

          )}


          {/* =================================
              FORM
          ================================= */}

          <form onSubmit={handleSubmit}>


            {/* NOM */}

            <div className="input-group">

              <label>
                Nom complet
              </label>

              <input
                type="text"
                name="nom"
                placeholder="Votre nom"
                value={formData.nom}
                onChange={handleChange}
                required
              />

            </div>


            {/* EMAIL */}

            <div className="input-group">

              <label>
                Email
              </label>

              <input
                type="email"
                name="email"
                placeholder="exemple@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
              />

            </div>


            {/* DATES */}

            <div className="date-container">


              <div className="input-group">

                <label>
                  Date d'arrivée
                </label>

                <input
                  type="date"
                  name="dateArrivee"
                  min={today}
                  value={formData.dateArrivee}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="input-group">

                <label>
                  Date de départ
                </label>

                <input
                  type="date"
                  name="dateDepart"
                  min={
                    formData.dateArrivee
                      ? formData.dateArrivee
                      : today
                  }
                  value={formData.dateDepart}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            {/* PERSONNES */}

            <div className="input-group">

              <label>
                Nombre de personnes
              </label>

              <input
                type="number"
                name="personnes"
                min="1"
                max={room.capacite}
                placeholder={
                  `Maximum ${room.capacite} personnes`
                }
                value={formData.personnes}
                onChange={handleChange}
                required
              />

            </div>


            {/* =================================
                SUMMARY
            ================================= */}

            {numberOfNights > 0 && (

              <div className="reservation-summary">

                <div>

                  <span>
                    Nombre de nuits
                  </span>

                  <strong>
                    {numberOfNights}
                  </strong>

                </div>


                <div>

                  <span>
                    Prix par nuit
                  </span>

                  <strong>
                    {room.prix_par_nuit} DT
                  </strong>

                </div>


                <div className="summary-total">

                  <span>
                    Total
                  </span>

                  <strong>
                    {totalPrice.toFixed(2)} DT
                  </strong>

                </div>

              </div>

            )}


            {/* =================================
                BUTTON
            ================================= */}

            <button
              className="continue-btn"
              type="submit"
              disabled={
                !room.disponible ||
                submitting
              }
            >

              {submitting
                ? "Création de la réservation..."
                : "Confirmer la réservation"}

            </button>


          </form>

        </div>

      </section>


      <Footer />

    </>

  );

}


export default Reservation;