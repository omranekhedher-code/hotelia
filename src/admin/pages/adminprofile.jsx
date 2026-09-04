import React, { useEffect, useState } from "react";

function AdminProfile() {

    const [admin, setAdmin] = useState({

        id: "",
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        role: "",
        password: ""

    });


    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState("");

    const [error, setError] = useState("");


    // ==========================================
    // RÉCUPÉRER L'ADMIN CONNECTÉ
    // ==========================================

    useEffect(() => {

        const fetchAdmin = async () => {

            try {

                const storedUser =
                    JSON.parse(
                        localStorage.getItem("user")
                    );


                console.log(
                    "User localStorage :",
                    storedUser
                );


                if (!storedUser || !storedUser.id) {

                    setError(
                        "Aucun utilisateur connecté."
                    );

                    setLoading(false);

                    return;
                }


                const response = await fetch(

                    `http://localhost:5000/api/users/${storedUser.id}`

                );


                const data =
                    await response.json();


                console.log(
                    "Profil reçu :",
                    data
                );


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Impossible de récupérer le profil."
                    );

                }


                setAdmin({

                    id: data.id,

                    nom: data.nom || "",

                    prenom: data.prenom || "",

                    email: data.email || "",

                    telephone:
                        data.telephone || "",

                    role: data.role || "",

                    password: ""

                });


            } catch (error) {

                console.error(
                    "Erreur récupération profil :",
                    error
                );

                setError(
                    error.message
                );

            } finally {

                setLoading(false);

            }

        };


        fetchAdmin();

    }, []);


    // ==========================================
    // CHANGEMENT DES INPUTS
    // ==========================================

    const handleChange = (e) => {

        setAdmin({

            ...admin,

            [e.target.name]:
                e.target.value

        });

    };


    // ==========================================
    // MODIFIER PROFIL
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");

        setError("");

        setSaving(true);


        try {

            console.log(
                "Données envoyées :",
                admin
            );


            const response = await fetch(

                `http://localhost:5000/api/users/${admin.id}`,

                {

                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        nom: admin.nom,

                        prenom: admin.prenom,

                        email: admin.email,

                        telephone:
                            admin.telephone,

                        password:
                            admin.password

                    })

                }

            );


            const data =
                await response.json();


            console.log(
                "Réponse update :",
                data
            );


            if (!response.ok) {

                throw new Error(

                    data.message ||
                    "Erreur lors de la modification."

                );

            }


            // Mettre à jour le state
            setAdmin({

                id: data.user.id,

                nom: data.user.nom,

                prenom: data.user.prenom,

                email: data.user.email,

                telephone:
                    data.user.telephone || "",

                role: data.user.role,

                password: ""

            });


            // Mettre à jour localStorage
            localStorage.setItem(

                "user",

                JSON.stringify(
                    data.user
                )

            );


            setMessage(
                "Profil modifié avec succès."
            );


        } catch (error) {

            console.error(
                "Erreur modification :",
                error
            );

            setError(
                error.message
            );

        } finally {

            setSaving(false);

        }

    };


    // ==========================================
    // CHARGEMENT
    // ==========================================

    if (loading) {

        return (

            <div className="admin-profile">

                <h1>
                    Profil Administrateur
                </h1>

                <p>
                    Chargement du profil...
                </p>

            </div>

        );

    }


    // ==========================================
    // AFFICHAGE
    // ==========================================

    return (

        <div className="admin-profile">


            <h1>
                Profil Administrateur
            </h1>


            <p>
                Gérer vos informations personnelles
            </p>


            {message && (

                <div className="success-message">

                    {message}

                </div>

            )}


            {error && (

                <div className="error-message">

                    {error}

                </div>

            )}


            <div className="profile-card">


                <form
                    onSubmit={handleSubmit}
                >


                    {/* NOM */}

                    <label>
                        Nom
                    </label>

                    <input

                        type="text"

                        name="nom"

                        value={admin.nom}

                        onChange={handleChange}

                        required

                    />


                    {/* PRÉNOM */}

                    <label>
                        Prénom
                    </label>

                    <input

                        type="text"

                        name="prenom"

                        value={admin.prenom}

                        onChange={handleChange}

                        required

                    />


                    {/* EMAIL */}

                    <label>
                        Email
                    </label>

                    <input

                        type="email"

                        name="email"

                        value={admin.email}

                        onChange={handleChange}

                        required

                    />


                    {/* TELEPHONE */}

                    <label>
                        Téléphone
                    </label>

                    <input

                        type="text"

                        name="telephone"

                        value={
                            admin.telephone
                        }

                        onChange={handleChange}

                    />


                    {/* PASSWORD */}

                    <label>
                        Nouveau mot de passe
                    </label>

                    <input

                        type="password"

                        name="password"

                        value={
                            admin.password
                        }

                        onChange={handleChange}

                        placeholder="Laisser vide pour conserver l'ancien"

                    />


                    {/* ROLE */}

                    <label>
                        Rôle
                    </label>

                    <input

                        type="text"

                        value={

                            admin.role === "admin"

                                ? "Administrateur"

                                : admin.role

                        }

                        disabled

                    />


                    {/* BUTTON */}

                    <button

                        type="submit"

                        disabled={saving}

                    >

                        {saving

                            ? "Modification..."

                            : "Modifier profil"

                        }

                    </button>


                </form>


            </div>


        </div>

    );

}


export default AdminProfile;