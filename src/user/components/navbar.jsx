import React, { useState } from "react";
import "../user.css";

function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);

  // Récupérer l'utilisateur connecté
  const storedUser = localStorage.getItem("user");

  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  // Nom de l'utilisateur
  const firstName =
    user?.first_name ||
    user?.firstname ||
    user?.nom ||
    "";

  const lastName =
    user?.last_name ||
    user?.lastname ||
    user?.prenom ||
    "";

  const fullName =
    `${firstName} ${lastName}`.trim() ||
    user?.name ||
    "Utilisateur";

  return (
    <div className="user-navbar">

      <h3>
        Espace Client
      </h3>

      <div className="user-actions">

        <div className="notification-container">

          <button
            className="notification-btn"
            onClick={() =>
              setShowNotifications(!showNotifications)
            }
          >
            🔔

            <span className="notification-count">
              0
            </span>
          </button>

          {showNotifications && (
            <div className="notification-dropdown">

              <h4>
                Notifications
              </h4>

              <div className="notification-item">

                <p>
                  Aucune notification pour le moment.
                </p>

              </div>

            </div>
          )}

        </div>

        <div className="user-info">

          <p>
            {fullName}
          </p>

          <small>
            Client
          </small>

        </div>

      </div>

    </div>
  );
}

export default Navbar;