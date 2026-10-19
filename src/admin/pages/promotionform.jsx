import React, { useEffect, useState } from "react";


function PromotionForm({ onPromotionAdded }) {

    const [promotion, setPromotion] = useState({

        titre: "",
        reduction: "",
        room_id: "",
        date_debut: "",
        date_fin: "",
        status: "Active"

    });


    const [rooms, setRooms] = useState([]);

    const [loadingRooms, setLoadingRooms] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");



    // =====================================================
    // RÉCUPÉRER LES CHAMBRES
    // =====================================================

    useEffect(() => {

        const fetchRooms = async () => {

            try {

                const response = await fetch(
                    "http://localhost:8080/api/rooms"
                );


                const data = await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Impossible de récupérer les chambres"
                    );

                }


                setRooms(
                    Array.isArray(data)
                        ? data
                        : []
                );


            } catch (err) {

                console.error(
                    "Erreur chambres :",
                    err
                );

                setError(
                    err.message
                );

            } finally {

                setLoadingRooms(false);

            }

        };


        fetchRooms();

    }, []);



    // =====================================================
    // HANDLE CHANGE
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setPromotion({

            ...promotion,

            [name]: value

        });

    };



    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");


        // Validation

        if (!promotion.titre.trim()) {

            setError(
                "Veuillez saisir le titre de la promotion."
            );

            return;

        }


        if (!promotion.reduction) {

            setError(
                "Veuillez saisir la réduction."
            );

            return;

        }


        if (!promotion.date_debut) {

            setError(
                "Veuillez sélectionner la date de début."
            );

            return;

        }


        if (!promotion.date_fin) {

            setError(
                "Veuillez sélectionner la date de fin."
            );

            return;

        }


        if (
            new Date(promotion.date_fin) <
            new Date(promotion.date_debut)
        ) {

            setError(
                "La date de fin doit être après la date de début."
            );

            return;

        }


        try {

            setSaving(true);


            const response = await fetch(

                "http://localhost:8080/api/promotions",

                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        titre:
                            promotion.titre,

                        reduction:
                            Number(
                                promotion.reduction
                            ),

                        room_id:
                            promotion.room_id
                                ? Number(
                                    promotion.room_id
                                )
                                : null,

                        date_debut:
                            promotion.date_debut,

                        date_fin:
                            promotion.date_fin,

                        status:
                            promotion.status

                    })

                }

            );


            const data =
                await response.json();


            console.log(
                "Promotion créée :",
                data
            );


            if (!response.ok) {

                throw new Error(

                    data.message ||
                    "Erreur lors de la création de la promotion."

                );

            }


            alert(
                "Promotion ajoutée avec succès !"
            );


            // Reset form

            setPromotion({

                titre: "",
                reduction: "",
                room_id: "",
                date_debut: "",
                date_fin: "",
                status: "Active"

            });


            // Actualiser la liste dans Promotions.jsx

            if (onPromotionAdded) {

                onPromotionAdded();

            }


        } catch (err) {

            console.error(
                "Erreur création promotion :",
                err
            );


            setError(
                err.message
            );


        } finally {

            setSaving(false);

        }

    };



    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="room-form">


            <h2>
                Ajouter une promotion
            </h2>



            {/* ERROR */}

            {error && (

                <div className="error-message">

                    {error}

                </div>

            )}



            <form
                onSubmit={handleSubmit}
            >


                {/* TITRE */}

                <label>
                    Titre
                </label>


                <input

                    type="text"

                    name="titre"

                    value={
                        promotion.titre
                    }

                    placeholder="Ex: Offre été"

                    onChange={
                        handleChange
                    }

                    required

                />



                {/* RÉDUCTION */}

                <label>
                    Réduction (%)
                </label>


                <input

                    type="number"

                    name="reduction"

                    value={
                        promotion.reduction
                    }

                    placeholder="Ex: 20"

                    min="1"

                    max="100"

                    onChange={
                        handleChange
                    }

                    required

                />



                {/* CHAMBRE */}

                <label>
                    Chambre concernée
                </label>


                <select

                    name="room_id"

                    value={
                        promotion.room_id
                    }

                    onChange={
                        handleChange
                    }

                >

                    <option value="">
                        Toutes les chambres
                    </option>


                    {loadingRooms ? (

                        <option disabled>
                            Chargement des chambres...
                        </option>

                    ) : (

                        rooms.map(
                            (room) => (

                                <option
                                    key={room.id}
                                    value={room.id}
                                >

                                    {room.numero
                                        ? `Chambre ${room.numero}`
                                        : `Chambre #${room.id}`
                                    }

                                </option>

                            )
                        )

                    )}

                </select>



                {/* DATE DÉBUT */}

                <label>
                    Date début
                </label>


                <input

                    type="date"

                    name="date_debut"

                    value={
                        promotion.date_debut
                    }

                    onChange={
                        handleChange
                    }

                    required

                />



                {/* DATE FIN */}

                <label>
                    Date fin
                </label>


                <input

                    type="date"

                    name="date_fin"

                    value={
                        promotion.date_fin
                    }

                    onChange={
                        handleChange
                    }

                    required

                />



                {/* STATUS */}

                <label>
                    Statut
                </label>


                <select

                    name="status"

                    value={
                        promotion.status
                    }

                    onChange={
                        handleChange
                    }

                >

                    <option value="Active">
                        Active
                    </option>

                    <option value="Inactive">
                        Inactive
                    </option>

                </select>



                {/* BUTTON */}

                <button

                    type="submit"

                    className="btn-primary"

                    disabled={saving}

                >

                    {saving
                        ? "Enregistrement..."
                        : "Enregistrer"
                    }

                </button>


            </form>


        </div>

    );

}


export default PromotionForm;