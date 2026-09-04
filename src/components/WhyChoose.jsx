import "./WhyChoose.css";

function WhyChoose() {
  const reasons = [
    {
      icon: "✓",
      title: "Hôtels de confiance",
      description: "Des établissements de luxe soigneusement sélectionnés selon des standards d’exception."
    },
    {
      icon: "◌",
      title: "Réservation sécurisée",
      description: "Une expérience de réservation fluide, protégée et simple à chaque étape."
    },
    {
      icon: "✦",
      title: "Valeur exceptionnelle",
      description: "Des tarifs premium, des équipements élégants et des offres raffinées."
    },
    {
      icon: "✉",
      title: "Assistance conciergerie",
      description: "Une équipe dédiée à personnaliser chaque moment de votre séjour."
    }
  ];

  return (
    <section className="why">
      <div className="why-title">
        <h2>Pourquoi Hotelia</h2>
        <p>Une expérience de luxe façonnée par le confort, la confiance et les détails</p>
      </div>

      <div className="why-cards">
        {reasons.map((reason, index) => (
          <div className="why-card" key={index}>
            <div className="why-icon">{reason.icon}</div>
            <h3>{reason.title}</h3>
            <p>{reason.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WhyChoose;