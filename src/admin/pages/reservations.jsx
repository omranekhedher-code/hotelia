import React, { useEffect, useState } from "react";

import SearchBar from "../components/searchbar";
import ConfirmModal from "../components/confirmmodal";


function Reservations() {

    const [reservations, setReservations] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [deleteModal, setDeleteModal] = useState(false);

    const [selectedReservation, setSelectedReservation] = useState(null);


    // ==========================================
    // GET RESERVATIONS
    // ==========================================

    const fetchReservations = async () => {

        try {

            setLoading(true);

            setError("");


            const response = await fetch(
                "http://localhost:5000/api/reservations"
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Erreur récupération réservations"
                );

            }


            console.log(
                "Réservations :",
                data
            );


            setReservations(data);

        } catch (err) {

            console.error(
                "Erreur Reservations :",
                err
            );

            setError(err.message);

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // LOAD
    // ==========================================

    useEffect(() => {

        fetchReservations();

    }, []);


    // ==========================================
    // DELETE / ANNULER
    // ==========================================

    const handleDelete = async () => {

        if (!selectedReservation) {
            return;
        }


        try {

            const response = await fetch(

                `http://localhost:5000/api/reservations/${selectedReservation.id}`,

                {
                    method: "DELETE"
                }

            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(

                    data.message ||
                    "Erreur suppression réservation"

                );

            }


            // Supprimer directement de l'affichage

            setReservations((prev) =>

                prev.filter(

                    (reservation) =>

                        reservation.id !==
                        selectedReservation.id

                )

            );


            setDeleteModal(false);

            setSelectedReservation(null);


        } catch (err) {

            console.error(
                "Erreur suppression :",
                err
            );

            alert(err.message);

        }

    };


    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }


        const d = new Date(date);


        if (isNaN(d.getTime())) {
            return date;
        }


        return d.toLocaleDateString(
            "fr-FR"
        );

    };


    // ==========================================
    // SEARCH
    // ==========================================

    const filteredReservations =
        reservations.filter((reservation) => {

            const client =

                `${reservation.prenom || ""} ${reservation.nom || ""}`
                    .toLowerCase();


            const chambre =

                `${reservation.numero || ""} ${reservation.type || ""}`
                    .toLowerCase();


            const searchValue =
                search.toLowerCase();


            return (

                client.includes(searchValue)

                ||

                chambre.includes(searchValue)

                ||

                String(
                    reservation.id
                ).includes(searchValue)

            );

        });


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="reservations-page">

                <h1>
                    Gestion des réservations
                </h1>

                <p>
                    Chargement des réservations...
                </p>

            </div>

        );

    }


    return (

        <div className="reservations-page">


            {/* ==================================
                HEADER
            ================================== */}

            <h1>
                Gestion des réservations
            </h1>


            <p className="page-description">

                Consulter et gérer les réservations
                des clients

            </p>


            {/* ==================================
                ERROR
            ================================== */}

            {error && (

                <p className="error-message">

                    {error}

                </p>

            )}


            {/* ==================================
                SEARCH
            ================================== */}

            <SearchBar

                search={search}

                setSearch={setSearch}

            />


            {/* ==================================
                TABLE
            ================================== */}

            <table>


                <thead>

                    <tr>

                        <th>
                            ID
                        </th>

                        <th>
                            Client
                        </th>

                        <th>
                            Chambre
                        </th>

                        <th>
                            Arrivée
                        </th>

                        <th>
                            Départ
                        </th>

                        <th>
                            Personnes
                        </th>

                        <th>
                            Prix total
                        </th>

                        <th>
                            Solde
                        </th>

                        <th>
                            Status
                        </th>

                        <th>
                            Actions
                        </th>

                    </tr>

                </thead>


                <tbody>


                    {filteredReservations.length === 0 ? (

                        <tr>

                            <td
                                colSpan="10"
                                style={{
                                    textAlign: "center"
                                }}
                            >

                                Aucune réservation trouvée.

                            </td>

                        </tr>

                    ) : (


                        filteredReservations.map(
                            (reservation) => (

                                <tr
                                    key={reservation.id}
                                >


                                    {/* ID */}

                                    <td>

                                        #{reservation.id}

                                    </td>


                                    {/* CLIENT */}

                                    <td>

                                        <strong>

                                            {reservation.prenom}

                                            {" "}

                                            {reservation.nom}

                                        </strong>

                                        <br />

                                        <small>

                                            {reservation.email}

                                        </small>

                                    </td>


                                    {/* CHAMBRE */}

                                    <td>

                                        {reservation.numero
                                            ? `N° ${reservation.numero}`
                                            : "-"}

                                        <br />

                                        <small>

                                            {reservation.type || ""}

                                        </small>

                                    </td>


                                    {/* ARRIVÉE */}

                                    <td>

                                        {formatDate(
                                            reservation.date_arriv
                                        )}

                                    </td>


                                    {/* DÉPART */}

                                    <td>

                                        {formatDate(
                                            reservation.date_depart
                                        )}

                                    </td>


                                    {/* PERSONNES */}

                                    <td>

                                        {reservation.nb_per}

                                    </td>


                                    {/* PRIX */}

                                    <td>

                                        {reservation.prix_total}

                                        {" "}DT

                                    </td>


                                    {/* SOLDE */}

                                    <td>

                                        {reservation.solde}

                                        {" "}DT

                                    </td>


                                    {/* STATUS */}

                                    <td>

                                        <span
                                            className={`status ${reservation.status
                                                    ?.toLowerCase()
                                                    .replace(
                                                        /\s+/g,
                                                        "-"
                                                    )
                                                }`}
                                        >

                                            {reservation.status}

                                        </span>

                                    </td>


                                    {/* ACTIONS */}

                                    <td>


                                        <button
                                            className="btn-edit"
                                            onClick={() => {

                                                window.location.href =
                                                    `/admin/reservations/${reservation.id}`;

                                            }}
                                        >
                                            Détails
                                        </button>


                                        <button

                                            className="btn-delete"

                                            onClick={() => {

                                                setSelectedReservation(
                                                    reservation
                                                );

                                                setDeleteModal(
                                                    true
                                                );

                                            }}

                                        >

                                            Annuler

                                        </button>


                                    </td>


                                </tr>

                            )

                        )

                    )}


                </tbody>


            </table>


            {/* ==================================
                DELETE MODAL
            ================================== */}

            <ConfirmModal

                isOpen={deleteModal}

                message={

                    selectedReservation

                        ? `Voulez-vous supprimer la réservation #${selectedReservation.id} ?`

                        : "Voulez-vous supprimer cette réservation ?"

                }

                onCancel={() => {

                    setDeleteModal(false);

                    setSelectedReservation(null);

                }}

                onConfirm={
                    handleDelete
                }

            />


        </div>

    );

}


export default Reservations;