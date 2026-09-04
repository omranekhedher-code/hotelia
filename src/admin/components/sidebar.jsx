import React from "react";
import {
  FaHome,
  FaBed,
  FaCalendarCheck,
  FaUsers,
  FaMoneyBill,
  FaGift,
  FaStar,
  FaCog
} from "react-icons/fa";

import "../admin.css";


function Sidebar({ setPage }) {

  return (

    <div className="sidebar">

      <h2>Hotelia</h2>


      <button
        className="sidebar-link"
        onClick={() => setPage("dashboard")}
      >
        <FaHome />
        <span>Dashboard</span>
      </button>



      <button
        className="sidebar-link"
        onClick={() => setPage("rooms")}
      >
        <FaBed />
        <span>Chambres</span>
      </button>



      <button
        className="sidebar-link"
        onClick={() => setPage("reservations")}
      >
        <FaCalendarCheck />
        <span>Réservations</span>
      </button>



      <button
        className="sidebar-link"
        onClick={() => setPage("clients")}
      >
        <FaUsers />
        <span>Clients</span>
      </button>



      <button
        className="sidebar-link"
        onClick={() => setPage("payments")}
      >
        <FaMoneyBill />
        Paiements
      </button>



      <button
        className="sidebar-link"
        onClick={() => setPage("promotions")}
      >
        <FaGift />
        <span>Promotions</span>
      </button>



      <button
        className="sidebar-link"
        onClick={() => setPage("reviews")}
      >

        <FaStar />

        Avis

      </button>



      <button
        className="sidebar-link"
        onClick={() => setPage("settings")}
      >

        <FaCog />

        Paramètres

      </button>


    </div>

  );
}


export default Sidebar;