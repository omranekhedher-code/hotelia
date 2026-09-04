import React from "react";
import "../Admin.css";

function Table() {

  const reservations = [
    {
      id: 1,
      client: "Ahmed",
      room: "Suite Deluxe",
      date: "30/07/2026",
      status: "Confirmée"
    },
    {
      id: 2,
      client: "Sami",
      room: "Chambre Double",
      date: "31/07/2026",
      status: "En attente"
    },
    {
      id: 3,
      client: "Ali",
      room: "Suite Premium",
      date: "01/08/2026",
      status: "Annulée"
    }
  ];


  return (

    <table className="reservation-table">

      <thead>
        <tr>
          <th>Client</th>
          <th>Chambre</th>
          <th>Date</th>
          <th>Statut</th>
        </tr>
      </thead>


      <tbody>

        {reservations.map((reservation) => (

          <tr key={reservation.id}>

            <td>{reservation.client}</td>

            <td>{reservation.room}</td>

            <td>{reservation.date}</td>

            <td>
              <span className="status">
                {reservation.status}
              </span>
            </td>

          </tr>

        ))}

      </tbody>


    </table>

  );

}

export default Table;