import "./success.css";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

function Success() {

  return (
    <>
      <Navbar />

      <section className="success-container">

        <div className="success-card">

          <div className="success-icon">
            ✓
          </div>

          <h1>
            Paiement réussi !
          </h1>

          <p>
            Votre réservation a été confirmée avec succès.
          </p>

          <p>
            Merci d'avoir choisi Hotelia pour votre séjour.
          </p>


          <div className="reservation-number">

            Numéro de réservation :
            <strong> #HT2026</strong>

          </div>


          <Link 
            to="/" 
            className="home-btn"
          >
            Retour à l'accueil
          </Link>


        </div>

      </section>


      <Footer />

    </>
  );
}


export default Success;