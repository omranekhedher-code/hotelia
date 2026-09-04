import "./footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h2>Hotelia</h2>
          <p>Des séjours de prestige, un service attentionné et des escapades inoubliables.</p>
        </div>

        <div className="footer-links">
          <h3>Liens rapides</h3>
          <a href="#top">Accueil</a>
          <a href="#offers">Offres</a>
          <a href="#services">Services</a>
          <a href="#gallery">Galerie</a>
        </div>

        <div className="footer-contact">
          <h3>Contact</h3>
          <p>📍 Tunisie</p>
          <p>📞 +216 71 000 000</p>
          <p>✉ contact@hotelia.com</p>
        </div>

        <div className="footer-social">
          <h3>Suivez-nous</h3>
          <div className="social-list">
            <a href="#">Instagram</a><br /><br />
            <a href="#">Facebook</a><br /><br />
            <a href="#">LinkedIn</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Hotelia. Tous droits réservés.</p>
      </div>

      <div className="footer-credit">
        <p>Créé par <strong>Omrane Khedher</strong></p>
      </div>
    </footer>
  );
}

export default Footer;