import React, {
    useEffect,
    useState
} from "react";

import SearchBar from "../components/SearchBar";
import ConfirmModal from "../components/ConfirmModal";
import RoomForm from "./RoomForm";


function Rooms() {

    const [rooms, setRooms] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [showForm, setShowForm] =
        useState(false);

    const [roomToEdit, setRoomToEdit] =
        useState(null);

    const [deleteModal, setDeleteModal] =
        useState(false);

    const [selectedRoom, setSelectedRoom] =
        useState(null);


    // ==========================================
    // IMAGE URL
    // ==========================================

    const getImageUrl = (image) => {

        if (!image) {
            return "/imaged.png";
        }

        return `/${image}`;
    };


    // ==========================================
    // GET ROOMS
    // ==========================================

    const fetchRooms = async () => {

        try {

            setLoading(true);
            setError("");


            const response =
                await fetch(
                    "http://localhost:8080/api/rooms"
                );


            const contentType =
                response.headers.get(
                    "content-type"
                );


            let data;


            if (
                contentType &&
                contentType.includes(
                    "application/json"
                )
            ) {

                data =
                    await response.json();

            } else {

                const text =
                    await response.text();

                console.error(
                    "Backend response :",
                    text
                );

                throw new Error(
                    "Le serveur a retourné une réponse non JSON."
                );
            }


            if (!response.ok) {

                throw new Error(

                    data.message ||
                    "Erreur récupération chambres"

                );

            }


            console.log(
                "Chambres :",
                data
            );


            setRooms(data);


        } catch (err) {

            console.error(err);

            setError(
                err.message
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchRooms();

    }, []);


    // ==========================================
    // DELETE
    // ==========================================

    const handleDelete = async () => {

        if (!selectedRoom) {
            return;
        }


        try {

            const response =
                await fetch(

                    `http://localhost:8080/api/rooms/${selectedRoom.id}`,

                    {
                        method: "DELETE"
                    }

                );


            const contentType =
                response.headers.get(
                    "content-type"
                );


            let data;


            if (
                contentType &&
                contentType.includes(
                    "application/json"
                )
            ) {

                data =
                    await response.json();

            } else {

                throw new Error(
                    "Réponse backend non JSON"
                );

            }


            if (!response.ok) {

                throw new Error(

                    data.message ||
                    "Erreur suppression"

                );

            }


            setRooms(
                (prev) =>
                    prev.filter(
                        (room) =>
                            room.id !==
                            selectedRoom.id
                    )
            );


            setDeleteModal(false);

            setSelectedRoom(null);


        } catch (err) {

            console.error(err);

            alert(
                err.message
            );

        }

    };


    // ==========================================
    // SEARCH
    // ==========================================

    const filteredRooms =
        rooms.filter(

            (room) => {

                const searchValue =
                    search.toLowerCase();


                return (

                    room.type
                        ?.toLowerCase()
                        .includes(
                            searchValue
                        )

                    ||

                    String(
                        room.numero
                    ).includes(
                        searchValue
                    )

                );

            }

        );


    // ==========================================
    // FORM SUCCESS
    // ==========================================

    const handleSuccess =
        () => {

            setShowForm(false);

            setRoomToEdit(null);

            fetchRooms();

        };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="rooms-page">

                <h1>
                    Gestion des chambres
                </h1>

                <p>
                    Chargement des chambres...
                </p>

            </div>

        );

    }


    return (

        <div className="rooms-page">


            {/* HEADER */}

            <div className="page-header">

                <div>

                    <h1>
                        Gestion des chambres
                    </h1>

                    <p className="page-description">

                        Ajouter, modifier et gérer
                        les chambres de l'hôtel

                    </p>

                </div>


                <button

                    className="add-btn"

                    onClick={() => {

                        setRoomToEdit(null);

                        setShowForm(true);

                    }}

                >

                    + Ajouter une chambre

                </button>

            </div>


            {/* ERROR */}

            {error && (

                <p className="error-message">

                    {error}

                </p>

            )}


            {/* FORM */}

            {showForm && (

                <RoomForm

                    roomToEdit={
                        roomToEdit
                    }

                    onSuccess={
                        handleSuccess
                    }

                    onCancel={() => {

                        setShowForm(false);

                        setRoomToEdit(null);

                    }}

                />

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
                            Image
                        </th>

                        <th>
                            Numéro
                        </th>

                        <th>
                            Type
                        </th>

                        <th>
                            Prix / nuit
                        </th>

                        <th>
                            Capacité
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

                    {filteredRooms.length === 0 ? (

                        <tr>

                            <td

                                colSpan="7"

                                style={{
                                    textAlign:
                                        "center"
                                }}

                            >

                                Aucune chambre trouvée.

                            </td>

                        </tr>

                    ) : (

                        filteredRooms.map(

                            (room) => (

                                <tr
                                    key={room.id}
                                >


                                    {/* IMAGE */}

                                    <td>

                                        <img

                                            src={
                                                getImageUrl(
                                                    room.image
                                                )
                                            }

                                            alt={
                                                `Chambre ${room.numero}`
                                            }

                                            style={{
                                                width:
                                                    "70px",

                                                height:
                                                    "50px",

                                                objectFit:
                                                    "cover",

                                                borderRadius:
                                                    "8px"
                                            }}

                                        />

                                    </td>


                                    {/* NUMERO */}

                                    <td>
                                        {room.numero}
                                    </td>


                                    {/* TYPE */}

                                    <td>
                                        {room.type}
                                    </td>


                                    {/* PRIX */}

                                    <td>

                                        {
                                            room.prix_par_nuit
                                        }

                                        {" "}DT

                                    </td>


                                    {/* CAPACITE */}

                                    <td>
                                        {room.capacite}
                                    </td>


                                    {/* STATUS */}

                                    <td>

                                        <span

                                            className={

                                                room.disponible

                                                    ? "status available"

                                                    : "status occupied"

                                            }

                                        >

                                            {room.disponible

                                                ? "Disponible"

                                                : "Occupée"

                                            }

                                        </span>

                                    </td>


                                    {/* ACTIONS */}

                                    <td>

                                        <button

                                            className="btn-edit"

                                            onClick={() => {

                                                setRoomToEdit(
                                                    room
                                                );

                                                setShowForm(
                                                    true
                                                );

                                            }}

                                        >

                                            Modifier

                                        </button>


                                        <button

                                            className="btn-delete"

                                            onClick={() => {

                                                setSelectedRoom(
                                                    room
                                                );

                                                setDeleteModal(
                                                    true
                                                );

                                            }}

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

                    selectedRoom

                        ? `Voulez-vous supprimer la chambre ${selectedRoom.numero} ?`

                        : "Voulez-vous supprimer cette chambre ?"

                }

                onCancel={() => {

                    setDeleteModal(false);

                    setSelectedRoom(null);

                }}

                onConfirm={
                    handleDelete
                }

            />

        </div>

    );

}


export default Rooms;