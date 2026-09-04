import { useEffect, useState } from "react";
import "./navbar.css";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <ul className="nav-links">
        <li><a href="#top">Accueil</a></li>
        <li><a href="#offers">Offres</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#gallery">Galerie</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;