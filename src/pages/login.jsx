import React, { useState } from "react";
import {
    useNavigate,
    useLocation,
    Link
} from "react-router-dom";

import "./login.css";

function Login() {
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // =====================================================
    // LOGIN
    // =====================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:8080/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            // Vérifier le type de réponse
            const contentType =
                response.headers.get("content-type");

            let data;

            if (
                contentType &&
                contentType.includes("application/json")
            ) {
                data = await response.json();
            } else {
                const text = await response.text();

                console.error("Réponse backend :", text);

                throw new Error(
                    "Le serveur a retourné une réponse non JSON."
                );
            }

            console.log("Login response :", data);

            // =================================================
            // LOGIN ÉCHOUÉ
            // =================================================

            if (!response.ok) {
                setError(
                    data.message ||
                    "Email ou mot de passe incorrect."
                );
                return;
            }

            // =================================================
            // VÉRIFIER UTILISATEUR
            // Le backend retourne directement l'objet UserResponse
            // =================================================

            const user = data.user ?? data;

            if (
                !user ||
                user.id == null ||
                !user.email
            ) {
                setError(
                    "Informations utilisateur manquantes."
                );
                return;
            }

            // =================================================
            // SAUVEGARDER UTILISATEUR
            // =================================================

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            // =================================================
            // REDIRECTION
            // =================================================

            const from = location.state?.from;
            const role = user.role?.toLowerCase();

            if (role === "admin") {
                console.log("Connexion Admin");

                navigate("/admin", {
                    replace: true
                });

                return;
            }

            if (from) {
                console.log("Retour vers :", from);

                navigate(from, {
                    replace: true
                });
            } else {
                console.log("Connexion User");

                navigate("/user", {
                    replace: true
                });
            }

        } catch (error) {
            console.error("Erreur login :", error);

            setError(
                error.message ||
                "Impossible de contacter le serveur."
            );

        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // PAGE
    // =====================================================

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-card">

                    <h1>
                        Bon retour
                    </h1>

                    <p>
                        Connectez-vous à votre compte
                    </p>

                    <form onSubmit={handleSubmit}>

                        {/* EMAIL */}

                        <div className="input-group">
                            <label>
                                Email
                            </label>

                            <input
                                type="email"
                                placeholder="Entrez votre email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
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
                                placeholder="Entrez votre mot de passe"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                            />
                        </div>

                        {/* MOT DE PASSE OUBLIÉ */}

                        <div className="forgot-password">
                            <Link to="/forgot-password">
                                Mot de passe oublié ?
                            </Link>
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
                                ? "Connexion..."
                                : "Se connecter"
                            }
                        </button>

                    </form>

                    {/* SIGNUP */}

                    <span>
                        Vous n’avez pas encore de compte ?

                        <Link to="/signup">
                            {" "}S’inscrire
                        </Link>
                    </span>

                </div>
            </div>
        </div>
    );
}

export default Login;
