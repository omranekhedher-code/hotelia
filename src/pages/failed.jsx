import { useNavigate } from "react-router-dom";
import "./failed.css";

function PaymentFailed() {

  const navigate = useNavigate();

  return (
    <div className="failed-container">

      <div className="failed-card">

        <div className="failed-icon">
          ✕
        </div>

        <h1>Paiement échoué</h1>

        <p>
          Votre paiement n'a pas été effectué.
          Veuillez vérifier vos informations bancaires
          ou essayer une autre méthode de paiement.
        </p>

        <div className="failed-buttons">

          <button 
            className="retry-btn"
            onClick={() => navigate("/payment")}
          >
            Réessayer
          </button>

          <button 
            className="home-btn"
            onClick={() => navigate("/")}
          >
            Retour à l'accueil
          </button>

        </div>

      </div>

    </div>
  );
}

export default PaymentFailed;