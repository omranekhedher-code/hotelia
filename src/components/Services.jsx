import "./Services.css";

function Services() {
  const services = [
    {
      icon: "✦",
      title: "Séjours de luxe",
      description: "Des hôtels sélectionnés avec un service impeccable et un confort raffiné."
    },
    {
      icon: "🌊",
      title: "Vues océaniques",
      description: "Des chambres pensées pour cadrer des paysages côtiers spectaculaires."
    },
    {
      icon: "🍽️",
      title: "Dîners privés",
      description: "Des expériences culinaires sur mesure avec les saveurs les plus fines."
    },
    {
      icon: "🛁",
      title: "Retraite bien-être",
      description: "Spa, piscines et moments de détente dans un décor serein."
    }
  ];

  return (
    <section className="services" id="services">
      <div className="services-title">
        <h2>Expériences signature</h2>
        <p>Chaque détail conçu pour une escapade fluide et indulgente</p>
      </div>

      <div className="services-cards">
        {services.map((service, index) => (
          <div className="service-card" key={index}>
            <div className="service-icon">{service.icon}</div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Services;