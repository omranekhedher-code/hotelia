import React, { useEffect, useState } from "react";

import SearchBar from "../components/searchbar";
import ConfirmModal from "../components/confirmmodal";




function Payments() {

    const [search, setSearch] = useState("");

    const [payments, setPayments] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [deleteModal, setDeleteModal] = useState(false);

    const [selectedPayment, setSelectedPayment] = useState(null);

    const [showForm, setShowForm] = useState(false);


    // =====================================================
    // RÉCUPÉRER LES PAIEMENTS
    // =====================================================

    useEffect(() => {

        const fetchPayments = async () => {

            try {

                setLoading(true);

                const response = await fetch(
                    "http://localhost:8080/api/payments"
                );

                const data = await response.json();

                console.log("Paiements reçus :", data);


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Erreur récupération paiements"
                    );

                }


                if (Array.isArray(data)) {

                    setPayments(data);

                } else {

                    setPayments([]);

                }


            } catch (err) {

                console.error(
                    "Erreur paiements :",
                    err
                );

                setError(
                    err.message
                );

            } finally {

                setLoading(false);

            }

        };


        fetchPayments();

    }, []);


    // =====================================================
    // RECHERCHE
    // =====================================================

    const filteredPayments = payments.filter(
        payment => {

            const searchValue =
                search.toLowerCase();


            const clientName =
                `${payment.prenom || ""} ${payment.nom || ""}`
                    .toLowerCase();


            const reservation =
                String(
                    payment.reservation_id || ""
                ).toLowerCase();


            const mode =
                String(
                    payment.mode_paiement || ""
                ).toLowerCase();


            const transaction =
                String(
                    payment.transaction_id || ""
                ).toLowerCase();


            return (

                clientName.includes(searchValue)

                ||

                reservation.includes(searchValue)

                ||

                mode.includes(searchValue)

                ||

                transaction.includes(searchValue)

            );

        }
    );


    // =====================================================
    // SUPPRIMER
    // =====================================================

    const handleDelete = (payment) => {

        setSelectedPayment(payment);

        setDeleteModal(true);

    };


    const confirmDelete = async () => {

        if (!selectedPayment) {
            return;
        }


        try {

            const response = await fetch(

                `http://localhost:8080/api/payments/${selectedPayment.id}`,

                {
                    method: "DELETE"
                }

            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Erreur suppression paiement"
                );

            }


            setPayments(prev =>
                prev.filter(
                    payment =>
                        payment.id !==
                        selectedPayment.id
                )
            );


            setDeleteModal(false);

            setSelectedPayment(null);


        } catch (err) {

            console.error(
                "Erreur suppression :",
                err
            );

            alert(
                err.message
            );

        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="payments-page">

                <div className="dashboard-header">

                    <h1>
                        Gestion des paiements
                    </h1>

                    <p className="page-description">
                        Chargement des paiements...
                    </p>

                </div>

            </div>

        );

    }


    // =====================================================
    // AFFICHAGE
    // =====================================================

    return (

        <div className="payments-page">


            {/* HEADER */}

            <div className="dashboard-header">

                <h1>
                    Gestion des paiements
                </h1>

                <p className="page-description">

                    Suivre les paiements et les transactions
                    des réservations

                </p>

            </div>


            {/* ERROR */}

            {error && (

                <div className="error-message">

                    {error}

                </div>

            )}


            {/* BUTTON */}

            <button

                className="btn-primary"

                onClick={() =>
                    setShowForm(!showForm)
                }

            >

                {showForm
                    ? "Fermer"
                    : "+ Ajouter un paiement"
                }

            </button>


            {/* FORM */}

            {showForm && (

                <PaymentForm />

            )}


            {/* SEARCH */}

            <SearchBar

                search={search}

                setSearch={setSearch}

            />


            {/* TABLE */}

            <table>

                <thead>

                    <tr>

                        <th>
                            Client
                        </th>

                        <th>
                            Réservation
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
                            Transaction
                        </th>

                        <th>
                            Statut
                        </th>

                        <th>
                            Actions
                        </th>

                    </tr>

                </thead>


                <tbody>


                    {filteredPayments.length === 0 ? (

                        <tr>

                            <td
                                colSpan="8"
                                style={{
                                    textAlign: "center",
                                    padding: "30px"
                                }}
                            >

                                Aucun paiement trouvé.

                            </td>

                        </tr>

                    ) : (


                        filteredPayments.map(
                            payment => (

                                <tr
                                    key={payment.id}
                                >


                                    {/* CLIENT */}

                                    <td>

                                        <strong>

                                            {payment.prenom || ""}
                                            {" "}
                                            {payment.nom || ""}

                                        </strong>

                                        <br />

                                        <small>

                                            {payment.email || "-"}

                                        </small>

                                    </td>


                                    {/* RESERVATION */}

                                    <td>

                                        <strong>

                                            RES-
                                            {String(
                                                payment.reservation_id
                                            ).padStart(3, "0")}

                                        </strong>

                                    </td>


                                    {/* MONTANT */}

                                    <td>

                                        <strong>

                                            {payment.montant}
                                            {" DT"}

                                        </strong>

                                    </td>


                                    {/* MODE */}

                                    <td>

                                        {payment.mode_paiement || "-"}

                                    </td>


                                    {/* DATE */}

                                    <td>

                                        {payment.date_paiement
                                            ? new Date(
                                                payment.date_paiement
                                            ).toLocaleDateString("fr-FR")
                                            : "-"
                                        }

                                    </td>


                                    {/* TRANSACTION */}

                                    <td>

                                        {payment.transaction_id || "-"}

                                    </td>


                                    {/* STATUS */}

                                    <td>

                                        <span
                                            className={`status ${String(
                                                payment.status || ""
                                            )
                                                .toLowerCase()
                                                .replaceAll(" ", "-")}`}
                                        >

                                            {payment.status || "-"}

                                        </span>

                                    </td>


                                    {/* ACTIONS */}

                                    <td>

                                        <button
                                            className="btn-edit"
                                            onClick={() => {
                                                window.location.href =
                                                    `/admin/payments/${payment.id}`;
                                            }}
                                        >
                                            Détails
                                        </button>

                                        <button
                                            className="btn-delete"
                                            onClick={() => handleDelete(payment)}
                                        >
                                            Supprimer
                                        </button>

                                    </td>


                                </tr>

                            )

                        )

                    )}


                </tbody>

            </table>


            {/* DELETE MODAL */}

            <ConfirmModal

                isOpen={
                    deleteModal
                }

                message={
                    selectedPayment

                        ? `Voulez-vous supprimer le paiement #${selectedPayment.id} ?`

                        : "Voulez-vous supprimer ce paiement ?"
                }

                onCancel={() => {

                    setDeleteModal(false);

                    setSelectedPayment(null);

                }}

                onConfirm={
                    confirmDelete
                }

            />


        </div>

    );

}


export default Payments;