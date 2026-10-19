import React, { useEffect, useState } from "react";

function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const storedUser = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  const userId = user?.id;

  useEffect(() => {
    const fetchPayments = async () => {
      if (!userId) {
        setError("Utilisateur non connecté.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8080/api/payments/user/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        console.log("Payments :", data);

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Erreur lors du chargement des paiements."
          );
        }

        setPayments(data);

      } catch (error) {
        console.error(
          "Erreur payments :",
          error
        );

        setError(error.message);

      } finally {
        setLoading(false);
      }
    };

    fetchPayments();

  }, [userId, token]);


  if (loading) {
    return (
      <div className="payments-page">

        <h1>
          Mes paiements
        </h1>

        <p>
          Chargement de vos paiements...
        </p>

      </div>
    );
  }


  if (error) {
    return (
      <div className="payments-page">

        <h1>
          Mes paiements
        </h1>

        <p className="error-message">
          {error}
        </p>

      </div>
    );
  }


  return (
    <div className="payments-page">

      <h1>
        Mes paiements
      </h1>

      <p>
        Consultez l'historique de vos transactions
      </p>


      {payments.length === 0 ? (

        <div className="dashboard-card">

          <h2>
            Aucun paiement
          </h2>

          <p>
            Vous n'avez effectué aucun paiement.
          </p>

        </div>

      ) : (

        <table>

          <thead>

            <tr>

              <th>
                Réservation
              </th>

              <th>
                Chambre
              </th>

              <th>
                Montant
              </th>

              <th>
                Méthode
              </th>

              <th>
                Date
              </th>

              <th>
                Statut
              </th>

            </tr>

          </thead>


          <tbody>

            {payments.map((payment) => (

              <tr key={payment.id}>

                <td>
                  {payment.reservation_id ||
                    payment.reservation ||
                    `RES${payment.id}`}
                </td>


                <td>
                  {payment.room ||
                    payment.room_name ||
                    `Chambre ${payment.room_id || "-"}`}
                </td>


                <td>
                  {payment.amount ||
                    payment.montant ||
                    payment.prix ||
                    "0"}{" "}
                  DT
                </td>


                <td>
                  {payment.method ||
                    payment.methode ||
                    "Non spécifiée"}
                </td>


                <td>
                  {payment.date ||
                    payment.created_at ||
                    "-"}
                </td>


                <td>

                  <span className="status">
                    {payment.status ||
                      payment.statut ||
                      "En attente"}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

    </div>
  );
}

export default Payments;