import "./Gallery.css";

function Gallery() {
  const images = [
    "/picture1.jpg",
    "/picture2.jpg",
    "/picture3.png"
  ];

  return (
    <section className="gallery" id="gallery">
      <div className="gallery-title">
        <h2>Notre galerie</h2>
        <p>Des intérieurs d’exception, des vues côtières et une atmosphère inoubliable</p>
      </div>

      <div className="gallery-grid">
        {images.map((image, index) => (
          <div className="gallery-item" key={index}>
            <img src={image} alt={`Galerie ${index + 1}`} />
            <div className="gallery-overlay">Évasion de luxe</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Gallery;