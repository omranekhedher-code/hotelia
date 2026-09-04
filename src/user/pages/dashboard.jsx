import React, { useEffect, useState } from "react";

import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";

import StatCard from "../components/statcard";

import MyReservations from "./myreservations";
import Profile from "./profile";
import Payments from "./payments";
import Reviews from "./reviews";


function Dashboard() {
  const [page, setPage] = useState(() => {
    return localStorage.getItem("dashboardPage") || "dashboard";
  });

  const handleSetPage = (newPage) => {
    setPage(newPage);
    localStorage.setItem("dashboardPage", newPage);
  };

  const [reservations, setReservations] =
    useState([]);

  const [payments, setPayments] =
    useState([]);

  const [loadingStats, setLoadingStats] =
    useState(true);


  // =====================================================
  // USER
  // =====================================================

  const storedUser =
    localStorage.getItem("user");

  const token =
    localStorage.getItem("token");


  const user =
    storedUser
      ? JSON.parse(storedUser)
      : null;


  const userId =
    user?.id;


  // =====================================================
  // NOM USER
  // =====================================================

  const userName = user
    ? `${user.first_name || user.nom || ""} ${user.last_name || user.prenom || ""
      }`.trim()
    : "Utilisateur";


  // =====================================================
  // FETCH DASHBOARD DATA
  // =====================================================

  useEffect(() => {

    const fetchDashboardData = async () => {

      if (!userId || !token) {

        setLoadingStats(false);

        return;

      }


      try {

        // ===============================================
        // RESERVATIONS
        // ===============================================

        const reservationsResponse =
          await fetch(
            `http://localhost:5000/api/reservations/user/${userId}`,
            {
              method: "GET",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`
              }
            }
          );


        const reservationsData =
          await reservationsResponse.json();


        if (!reservationsResponse.ok) {

          throw new Error(
            reservationsData.message ||
            "Erreur réservations"
          );

        }


        const reservationList =
          Array.isArray(reservationsData)
            ? reservationsData
            : [];


        setReservations(
          reservationList
        );


        // ===============================================
        // PAYMENTS
        // ===============================================

        const paymentsResponse =
          await fetch(
            `http://localhost:5000/api/payments/user/${userId}`,
            {
              method: "GET",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`
              }
            }
          );


        const paymentsData =
          await paymentsResponse.json();


        if (!paymentsResponse.ok) {

          throw new Error(
            paymentsData.message ||
            "Erreur paiements"
          );

        }


        const paymentList =
          Array.isArray(paymentsData)
            ? paymentsData
            : [];


        setPayments(
          paymentList
        );


      } catch (error) {

        console.error(
          "Erreur Dashboard :",
          error
        );

      } finally {

        setLoadingStats(false);

      }

    };


    fetchDashboardData();

  }, [userId, token]);


  // =====================================================
  // STATISTIQUES
  // =====================================================

  const totalReservations =
    reservations.length;


  // =====================================================
  // SÉJOURS TERMINÉS
  // =====================================================

  const today =
    new Date();


  const completedStays =
    reservations.filter(
      (reservation) => {

        if (!reservation.date_depart) {
          return false;
        }

        const departure =
          new Date(
            reservation.date_depart
          );

        return departure < today;

      }
    ).length;


  // =====================================================
  // TOTAL DÉPENSÉ
  // =====================================================

  const totalSpent =
    payments.reduce(
      (total, payment) => {

        return (
          total +
          Number(
            payment.montant || 0
          )
        );

      },
      0
    );


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="user-container">


      <Sidebar setPage={handleSetPage} />


      <div className="user-main">


        <Navbar />


        <main className="user-content">


          {/* =================================================
              DASHBOARD
          ================================================= */}

          {page === "dashboard" && (

            <>

              <div className="dashboard-header">

                <h1>
                  Bienvenue {userName}
                </h1>

                <p>
                  Gérez vos réservations et votre compte
                </p>

              </div>


              {/* =================================================
                  STATS
              ================================================= */}

              <div className="stats-container">


                <StatCard
                  title="Réservations"
                  value={
                    loadingStats
                      ? "..."
                      : totalReservations
                  }
                />


                <StatCard
                  title="Séjours terminés"
                  value={
                    loadingStats
                      ? "..."
                      : completedStays
                  }
                />


                <StatCard
                  title="Total dépensé"
                  value={
                    loadingStats
                      ? "..."
                      : `${totalSpent.toFixed(2)} DT`
                  }
                />


              </div>


              {/* =================================================
                  DERNIÈRES RÉSERVATIONS
              ================================================= */}

              <div className="dashboard-card">


                <h2>
                  Dernières réservations
                </h2>


                {loadingStats ? (

                  <p>
                    Chargement...
                  </p>

                ) : reservations.length === 0 ? (

                  <p>
                    Vous n'avez pas encore
                    effectué de réservation.
                  </p>

                ) : (

                  <div className="dashboard-reservations">


                    {reservations
                      .slice(0, 3)
                      .map((reservation) => (

                        <div
                          key={reservation.id}
                          className="dashboard-reservation-item"
                        >

                          <div>

                            <strong>
                              {reservation.type ||
                                `Chambre ${reservation.room_id}`}
                            </strong>

                            <p>
                              {reservation.date_arriv}
                              {" → "}
                              {reservation.date_depart}
                            </p>

                          </div>


                          <div>

                            <strong>
                              {Number(
                                reservation.prix_total || 0
                              ).toFixed(2)}
                              {" DT"}
                            </strong>

                            <p>
                              {reservation.status ||
                                "En attente"}
                            </p>

                          </div>


                        </div>

                      ))}


                  </div>

                )}


              </div>


            </>

          )}


          {/* =================================================
              RESERVATIONS
          ================================================= */}

          {page === "reservations" && (

            <MyReservations />

          )}


          {/* =================================================
              PROFILE
          ================================================= */}

          {page === "profile" && (

            <Profile />

          )}


          {/* =================================================
              PAYMENTS
          ================================================= */}

          {page === "payments" && (

            <Payments />

          )}


          {/* =================================================
              REVIEWS
          ================================================= */}

          {page === "reviews" && (

            <Reviews />

          )}


        </main>


      </div>


    </div>

  );

}


export default Dashboard;