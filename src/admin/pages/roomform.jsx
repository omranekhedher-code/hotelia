import React, { useState } from "react";

function RoomForm({ roomToEdit, onSuccess, onCancel }) {

    const [room, setRoom] = useState({

        numero:
            roomToEdit?.numero || "",

        type:
            roomToEdit?.type || "",

        prix_par_nuit:
            roomToEdit?.prix_par_nuit || "",

        capacite:
            roomToEdit?.capacite || "",

        description:
            roomToEdit?.description || "",

        disponible:
            roomToEdit?.disponible === true ||
            roomToEdit?.disponible === "true",

        image: null

    });


    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");


    // ==========================================
    // HANDLE INPUT
    // ==========================================

    const handleChange = (e) => {

        const {
            name,
            value,
            type,
            checked
        } = e.target;


        setRoom((prev) => ({

            ...prev,

            [name]:
                type === "checkbox"
                    ? checked
                    : value

        }));

    };


    // ==========================================
    // IMAGE
    // ==========================================

    const handleImageChange = (e) => {

        const file =
            e.target.files[0];


        setRoom((prev) => ({

            ...prev,

            image:
                file || null

        }));

    };


    // ==========================================
    // SUBMIT
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);


        try {

            const formData =
                new FormData();


            formData.append(
                "numero",
                room.numero
            );


            formData.append(
                "type",
                room.type
            );


            formData.append(
                "prix_par_nuit",
                room.prix_par_nuit
            );


            formData.append(
                "capacite",
                room.capacite
            );


            formData.append(
                "description",
                room.description
            );


            formData.append(
                "disponible",
                room.disponible
                    ? "true"
                    : "false"
            );


            // ==========================================
            // IMAGE
            // ==========================================

            if (room.image) {

                formData.append(
                    "image",
                    room.image
                );

            }


            // ==========================================
            // URL
            // ==========================================

            const url =
                roomToEdit

                    ? `http://localhost:5000/api/rooms/${roomToEdit.id}`

                    : "http://localhost:5000/api/rooms";


            // ==========================================
            // REQUEST
            // ==========================================

            const response =
                await fetch(

                    url,

                    {
                        method:
                            roomToEdit
                                ? "PUT"
                                : "POST",

                        body:
                            formData
                    }

                );


            // ==========================================
            // RESPONSE
            // ==========================================

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
                    "Réponse backend :",
                    text
                );


                throw new Error(
                    "Le serveur a retourné une réponse non JSON. Vérifie le backend."
                );
            }


            if (!response.ok) {

                throw new Error(

                    data.message ||
                    "Erreur lors de l'opération"

                );

            }


            // ==========================================
            // SUCCESS
            // ==========================================

            alert(

                roomToEdit

                    ? "Chambre modifiée avec succès"

                    : "Chambre ajoutée avec succès"

            );


            if (onSuccess) {

                onSuccess(
                    data.room || data
                );

            }


        } catch (err) {

            console.error(
                "Erreur RoomForm :",
                err
            );


            setError(
                err.message
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="room-form">

            <h1>

                {roomToEdit

                    ? "Modifier une chambre"

                    : "Ajouter une chambre"

                }

            </h1>


            {error && (

                <p className="error-message">

                    {error}

                </p>

            )}


            <form
                onSubmit={handleSubmit}
            >


                {/* NUMERO */}

                <label>
                    Numéro chambre
                </label>

                <input

                    type="text"

                    name="numero"

                    value={room.numero}

                    onChange={handleChange}

                    required

                />


                {/* TYPE */}

                <label>
                    Type chambre
                </label>

                <input

                    type="text"

                    name="type"

                    placeholder="Suite, Deluxe..."

                    value={room.type}

                    onChange={handleChange}

                    required

                />


                {/* PRIX */}

                <label>
                    Prix par nuit
                </label>

                <input

                    type="number"

                    name="prix_par_nuit"

                    value={room.prix_par_nuit}

                    onChange={handleChange}

                    min="0"

                    required

                />


                {/* CAPACITE */}

                <label>
                    Capacité
                </label>

                <input

                    type="number"

                    name="capacite"

                    value={room.capacite}

                    onChange={handleChange}

                    min="1"

                    required

                />


                {/* DESCRIPTION */}

                <label>
                    Description
                </label>

                <textarea

                    name="description"

                    value={room.description}

                    onChange={handleChange}

                />


                {/* IMAGE */}

                <label>
                    Image
                </label>

                <input

                    type="file"

                    name="image"

                    accept="image/*"

                    onChange={handleImageChange}

                />


                {/* IMAGE ACTUELLE */}

                {roomToEdit && (

                    <div className="current-image">

                        <p>
                            Image actuelle :
                        </p>

                        <img
                            src={
                                roomToEdit?.image
                                    ? `/${roomToEdit.image}`
                                    : "/imaged.png"
                            }
                            alt="Chambre"
                            style={{
                                width: "120px",
                                height: "80px",
                                objectFit: "cover",
                                borderRadius: "8px"
                            }}
                        />



                    </div>

                )}


                {/* CHECKBOX */}

                <label className="checkbox-label">

                    <input

                        type="checkbox"

                        name="disponible"

                        checked={
                            room.disponible === true
                        }

                        onChange={handleChange}

                    />

                    Disponible

                </label>


                {/* BUTTONS */}

                <div className="form-buttons">


                    <button

                        type="submit"

                        disabled={loading}

                    >

                        {loading

                            ? "Enregistrement..."

                            : roomToEdit

                                ? "Modifier chambre"

                                : "Ajouter chambre"

                        }

                    </button>


                    {onCancel && (

                        <button

                            type="button"

                            onClick={onCancel}

                            disabled={loading}

                        >

                            Annuler

                        </button>

                    )}


                </div>


            </form>

        </div>

    );

}


export default RoomForm;