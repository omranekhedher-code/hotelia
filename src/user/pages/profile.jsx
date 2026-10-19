import React, { useEffect, useState } from "react";
import "../user.css";

function Profile() {

    const [user, setUser] = useState({
        nom: "",
        prenom: "",
        email: "",
        telephone: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");



    // Récupérer l'utilisateur connecté
    useEffect(() => {

        const storedUser = localStorage.getItem("user");

        if (!storedUser) {

            setError("Utilisateur non connecté.");
            setLoading(false);
            return;

        }

        const userData = JSON.parse(storedUser);

        const userId = userData.id;

        if (!userId) {

            setError("ID utilisateur introuvable.");
            setLoading(false);
            return;

        }


        fetch(`http://localhost:8080/api/users/${userId}`)
            .then(async (response) => {

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Erreur lors du chargement du profil"
                    );
                }

                return data;
            })
            .then((data) => {

                console.log("User :", data);

                setUser({
                    nom: data.nom || "",
                    prenom: data.prenom || "",
                    email: data.email || "",
                    telephone: data.telephone || ""
                });

                setLoading(false);

            })
            .catch((err) => {

                console.error("Erreur profil :", err);

                setError(err.message);
                setLoading(false);

            });

    }, []);



    // Modifier les champs
    const handleChange = (e) => {

        setUser({
            ...user,
            [e.target.name]: e.target.value
        });

    };



    // Enregistrer les modifications
    const handleSubmit = async (e) => {

        e.preventDefault();

        setSaving(true);
        setMessage("");
        setError("");

        try {

            const storedUser = localStorage.getItem("user");

            if (!storedUser) {
                throw new Error("Utilisateur non connecté.");
            }

            const userData = JSON.parse(storedUser);

            const userId = userData.id;


            const response = await fetch(
                `http://localhost:8080/api/users/${userId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        nom: user.nom,
                        prenom: user.prenom,
                        email: user.email,
                        telephone: user.telephone
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message || "Erreur lors de la mise à jour"
                );

            }


            console.log("Profil mis à jour :", data);


            // Mettre à jour localStorage
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );


            // Mettre à jour l'affichage
            setUser({
                nom: data.user.nom || "",
                prenom: data.user.prenom || "",
                email: data.user.email || "",
                telephone: data.user.telephone || ""
            });


            setMessage("Profil mis à jour avec succès.");

        } catch (err) {

            console.error("Erreur update profil :", err);

            setError(err.message);

        } finally {

            setSaving(false);

        }

    };



    if (loading) {

        return (
            <div className="profile-page">
                <h1>Mon profil</h1>
                <p>Chargement de vos informations...</p>
            </div>
        );

    }



    return (

        <div className="profile-page">

            <h1>
                Mon profil
            </h1>

            <p>
                Gérer vos informations personnelles
            </p>


            {message && (
                <p className="success-message">
                    {message}
                </p>
            )}


            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}



            <form
                className="profile-form"
                onSubmit={handleSubmit}
            >


                <label>
                    Nom
                </label>

                <input
                    type="text"
                    name="nom"
                    value={user.nom}
                    onChange={handleChange}
                    required
                />



                <label>
                    Prénom
                </label>

                <input
                    type="text"
                    name="prenom"
                    value={user.prenom}
                    onChange={handleChange}
                    required
                />



                <label>
                    Email
                </label>

                <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    required
                />



                <label>
                    Téléphone
                </label>

                <input
                    type="text"
                    name="telephone"
                    value={user.telephone}
                    onChange={handleChange}
                />



                <button
                    className="save-btn"
                    type="submit"
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

export default Profile;