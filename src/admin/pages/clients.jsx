import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import SearchBar from "../components/SearchBar";
import ConfirmModal from "../components/ConfirmModal";


function Clients() {

    const navigate = useNavigate();

    const [search, setSearch] = useState("");

    const [clients, setClients] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [deleteModal, setDeleteModal] = useState(false);

    const [selectedClient, setSelectedClient] = useState(null);


    // ==========================================
    // RÉCUPÉRER LES CLIENTS
    // ==========================================

    useEffect(() => {

        const fetchClients = async () => {

            try {

                setLoading(true);

                const response = await fetch(
                    "http://localhost:5000/api/users"
                );

                const users = await response.json();


                if (!response.ok) {

                    throw new Error(
                        users.message ||
                        "Erreur récupération clients"
                    );

                }


                // Garder seulement les utilisateurs normaux
                const normalUsers = users.filter(
                    user => user.role === "user"
                );


                // Récupérer le nombre de réservations
                const clientsWithReservations =
                    await Promise.all(

                        normalUsers.map(
                            async (user) => {

                                try {

                                    const reservationResponse =
                                        await fetch(
                                            `http://localhost:5000/api/reservations/user/${user.id}`
                                        );


                                    const reservations =
                                        await reservationResponse.json();


                                    return {

                                        ...user,

                                        name:
                                            `${user.prenom || ""} ${user.nom || ""}`.trim(),

                                        reservations:
                                            Array.isArray(
                                                reservations
                                            )
                                                ? reservations.length
                                                : 0,

                                        status:
                                            "Actif"

                                    };

                                } catch (error) {

                                    console.error(
                                        `Erreur réservations user ${user.id}:`,
                                        error
                                    );


                                    return {

                                        ...user,

                                        name:
                                            `${user.prenom || ""} ${user.nom || ""}`.trim(),

                                        reservations: 0,

                                        status:
                                            "Actif"

                                    };

                                }

                            }
                        )

                    );


                setClients(
                    clientsWithReservations
                );


            } catch (error) {

                console.error(
                    "Erreur clients :",
                    error
                );

                setError(
                    error.message
                );

            } finally {

                setLoading(false);

            }

        };


        fetchClients();

    }, []);


    // ==========================================
    // RECHERCHE
    // ==========================================

    const filteredClients =
        clients.filter(client => {

            const searchValue =
                search.toLowerCase();


            return (

                client.name
                    ?.toLowerCase()
                    .includes(searchValue)

                ||

                client.email
                    ?.toLowerCase()
                    .includes(searchValue)

                ||

                String(client.telephone || "")
                    .toLowerCase()
                    .includes(searchValue)

            );

        });


    // ==========================================
    // SUPPRIMER CLIENT
    // ==========================================

    const handleDelete = (client) => {

        setSelectedClient(client);

        setDeleteModal(true);

    };


    const confirmDelete = async () => {

        if (!selectedClient) {
            return;
        }


        try {

            const response = await fetch(

                `http://localhost:5000/api/users/${selectedClient.id}`,

                {
                    method: "DELETE"
                }

            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Erreur suppression client"
                );

            }


            // Retirer le client de la liste
            setClients(prev =>
                prev.filter(
                    client =>
                        client.id !==
                        selectedClient.id
                )
            );


            setDeleteModal(false);

            setSelectedClient(null);


        } catch (error) {

            console.error(
                "Erreur suppression :",
                error
            );

            alert(
                error.message
            );

        }

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="clients-page">

                <h1>
                    Gestion des clients
                </h1>

                <p>
                    Chargement des clients...
                </p>

            </div>

        );

    }


    // ==========================================
    // AFFICHAGE
    // ==========================================

    return (

        <div className="clients-page">


            <h1>
                Gestion des clients
            </h1>


            <p className="page-description">

                Consulter et gérer les informations
                des clients

            </p>


            {error && (

                <div className="error-message">

                    {error}

                </div>

            )}


            <SearchBar

                search={search}

                setSearch={setSearch}

            />


            <table>

                <thead>

                    <tr>

                        <th>
                            Nom
                        </th>

                        <th>
                            Email
                        </th>

                        <th>
                            Téléphone
                        </th>

                        <th>
                            Réservations
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

                    {filteredClients.length === 0 ? (

                        <tr>

                            <td
                                colSpan="6"
                                style={{
                                    textAlign: "center"
                                }}
                            >

                                Aucun client trouvé.

                            </td>

                        </tr>

                    ) : (

                        filteredClients.map(
                            client => (

                                <tr
                                    key={client.id}
                                >

                                    <td>

                                        {client.name ||
                                            "Non renseigné"}

                                    </td>


                                    <td>

                                        {client.email}

                                    </td>


                                    <td>

                                        {client.telephone ||
                                            "Non renseigné"}

                                    </td>


                                    <td>

                                        {client.reservations}

                                    </td>


                                    <td>

                                        <span
                                            className={`status ${client.status.toLowerCase()}`}
                                        >

                                            {client.status}

                                        </span>

                                    </td>


                                    <td>

                                        {/* ==========================
                                            PROFIL CLIENT
                                        ========================== */}

                                        <button

                                            className="btn-edit"

                                            onClick={() => {

                                                navigate(
                                                    `/admin/clients/${client.id}`
                                                );

                                            }}

                                        >

                                            Profil

                                        </button>


                                        {/* ==========================
                                            SUPPRIMER
                                        ========================== */}

                                        <button

                                            className="btn-delete"

                                            onClick={() =>
                                                handleDelete(
                                                    client
                                                )
                                            }

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


            {/* ================================
                CONFIRMATION SUPPRESSION
            ================================= */}

            <ConfirmModal

                isOpen={
                    deleteModal
                }

                message={

                    selectedClient

                        ? `Voulez-vous supprimer ${selectedClient.prenom} ${selectedClient.nom} ?`

                        : "Voulez-vous supprimer ce client ?"

                }

                onCancel={() => {

                    setDeleteModal(false);

                    setSelectedClient(null);

                }}

                onConfirm={
                    confirmDelete
                }

            />


        </div>

    );

}


export default Clients;