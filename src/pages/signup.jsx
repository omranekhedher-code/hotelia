import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

function Signup() {

    const navigate = useNavigate();

    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [email, setEmail] = useState("");
    const [telephone, setTelephone] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response = await fetch(
                "http://localhost:8080/api/auth/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        nom,
                        prenom,
                        email,
                        password,
                        telephone
                    })
                }
            );


            const contentType =
                response.headers.get("content-type");


            let data;


            if (
                contentType &&
                contentType.includes("application/json")
            ) {

                data = await response.json();

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


            console.log(
                "Register response :",
                data
            );


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Erreur lors de l'inscription."
                );

            }


            // ==========================================
            // INSCRIPTION RÉUSSIE
            // ==========================================

            alert(
                "Compte créé avec succès !"
            );


            navigate("/login");


        } catch (err) {

            console.error(
                "Erreur inscription :",
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

        <div className="auth-container">

            <div className="auth-card">

                <h1>
                    Créer un compte
                </h1>

                <p>
                    Rejoignez l’expérience Hotelia
                </p>


                <form onSubmit={handleSubmit}>


                    {/* NOM */}

                    <div className="input-group">

                        <label>
                            Nom
                        </label>

                        <input
                            type="text"
                            placeholder="Votre nom"
                            value={nom}
                            onChange={(e) =>
                                setNom(e.target.value)
                            }
                            required
                        />

                    </div>


                    {/* PRÉNOM */}

                    <div className="input-group">

                        <label>
                            Prénom
                        </label>

                        <input
                            type="text"
                            placeholder="Votre prénom"
                            value={prenom}
                            onChange={(e) =>
                                setPrenom(e.target.value)
                            }
                            required
                        />

                    </div>


                    {/* EMAIL */}

                    <div className="input-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Votre email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />

                    </div>


                    {/* TELEPHONE */}

                    <div className="input-group">

                        <label>
                            Téléphone
                        </label>

                        <input
                            type="tel"
                            placeholder="Votre numéro"
                            value={telephone}
                            onChange={(e) =>
                                setTelephone(e.target.value)
                            }
                            required
                        />

                    </div>


                    {/* PASSWORD */}

                    <div className="input-group">

                        <label>
                            Mot de passe
                        </label>

                        <input
                            type="password"
                            placeholder="Créez votre mot de passe"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />

                    </div>


                    {/* ERROR */}

                    {error && (

                        <p className="login-error">
                            {error}
                        </p>

                    )}


                    {/* BUTTON */}

                    <button
                        type="submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Création..."
                            : "Créer mon compte"
                        }

                    </button>


                </form>


                <span>

                    Vous avez déjà un compte ?

                    <Link to="/login">
                        {" "}Se connecter
                    </Link>

                </span>


            </div>

        </div>

    );

}


export default Signup;