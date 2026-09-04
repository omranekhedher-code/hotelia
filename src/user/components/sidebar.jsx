import React from "react";
import {
  FaHome,
  FaBed,
  FaCreditCard,
  FaStar,
  FaUser,
  FaSignOutAlt
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import "../user.css";


function Sidebar({ setPage }) {

  const navigate = useNavigate();


  const handleLogout = () => {

    // Supprimer les informations de connexion
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Retour vers Login
    navigate("/login");

  };


  return (

    <div className="user-sidebar">

      <Link to="/" className="sidebar-logo">
      <h2>
        Hotelia
      </h2>
        
      </Link>


      <button
        className="sidebar-link"
        onClick={() => setPage("dashboard")}
      >
        <FaHome />
        Dashboard
      </button>


      <button
        className="sidebar-link"
        onClick={() => setPage("reservations")}
      >
        <FaBed />
        Mes réservations
      </button>


      <button
        className="sidebar-link"
        onClick={() => setPage("payments")}
      >
        <FaCreditCard />
        Paiements
      </button>


      <button
        className="sidebar-link"
        onClick={() => setPage("reviews")}
      >
        <FaStar />
        Mes avis
      </button>


      <button
        className="sidebar-link"
        onClick={() => setPage("profile")}
      >
        <FaUser />
        Profil
      </button>


      <button
        className="sidebar-link logout"
        onClick={handleLogout}
      >
        <FaSignOutAlt />
        Déconnexion
      </button>

    </div>

  );

}


export default Sidebar;