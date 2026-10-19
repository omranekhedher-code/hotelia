import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

function ForgotPassword() {

    const navigate = useNavigate();

    const [step, setStep] = useState(1);

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);


    // ==========================================
    // STEP 1 : EMAIL
    // ==========================================

    const handleEmailSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setMessage("");

        if (!email) {

            setError(
                "Veuillez entrer votre adresse email."
            );

            return;
        }

        setLoading(true);

        try {

            const response = await fetch(
                "http://localhost:8080/api/auth/forgot-password",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                setError(
                    data.message ||
                    "Impossible d'envoyer le code."
                );

                return;
            }


            setMessage(
                data.message ||
                "Un code de vérification a été envoyé à votre email."
            );

            setStep(2);


        } catch (error) {

            console.error(
                "Erreur forgot password :",
                error
            );

            setError(
                "Impossible de contacter le serveur."
            );

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // STEP 2 : OTP
    // ==========================================

    const handleOtpSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setMessage("");


        if (!otp) {

            setError(
                "Veuillez entrer le code de vérification."
            );

            return;
        }


        if (otp.length !== 6) {

            setError(
                "Le code doit contenir 6 chiffres."
            );

            return;
        }


        setLoading(true);


        try {

            const response = await fetch(
                "http://localhost:8080/api/auth/verify-otp",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        otp
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                setError(
                    data.message ||
                    "Code de vérification incorrect."
                );

                return;
            }


            setMessage(
                data.message ||
                "Code vérifié avec succès."
            );

            setStep(3);


        } catch (error) {

            console.error(
                "Erreur verification OTP :",
                error
            );

            setError(
                "Impossible de contacter le serveur."
            );

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // STEP 3 : NOUVEAU MOT DE PASSE
    // ==========================================

    const handlePasswordSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setMessage("");


        if (!password || !confirmPassword) {

            setError(
                "Veuillez remplir tous les champs."
            );

            return;
        }


        if (password.length < 6) {

            setError(
                "Le mot de passe doit contenir au moins 6 caractères."
            );

            return;
        }


        if (password !== confirmPassword) {

            setError(
                "Les mots de passe ne correspondent pas."
            );

            return;
        }


        setLoading(true);


        try {

            const response = await fetch(
                "http://localhost:8080/api/auth/reset-password",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        otp,
                        password
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                setError(
                    data.message ||
                    "Impossible de modifier le mot de passe."
                );

                return;
            }


            setMessage(
                data.message ||
                "Votre mot de passe a été réinitialisé avec succès."
            );


            // Vider les champs

            setPassword("");
            setConfirmPassword("");


        } catch (error) {

            console.error(
                "Erreur reset password :",
                error
            );

            setError(
                "Impossible de contacter le serveur."
            );

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // RETOUR À L'ÉTAPE 1
    // ==========================================

    const handleBackToEmail = () => {

        setStep(1);

        setOtp("");

        setError("");

        setMessage("");

    };


    return (

        <div className="forgot-password-page">

            <div className="forgot-password-container">

                <div className="forgot-password-card">


                    {/* =====================================
                        STEP 1 : EMAIL
                    ===================================== */}

                    {step === 1 && (

                        <>

                            <h1>
                                Mot de passe oublié ?
                            </h1>


                            <p>
                                Entrez votre adresse email
                                pour recevoir un code de vérification.
                            </p>


                            <form
                                onSubmit={handleEmailSubmit}
                            >

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


                                {error && (

                                    <p className="forgot-error">
                                        {error}
                                    </p>

                                )}


                                <button
                                    type="submit"
                                    disabled={loading}
                                >

                                    {loading
                                        ? "Envoi..."
                                        : "Envoyer le code"
                                    }

                                </button>


                            </form>


                            <Link
                                to="/login"
                                className="back-login"
                            >
                                ← Retour à la connexion
                            </Link>

                        </>

                    )}


                    {/* =====================================
                        STEP 2 : OTP
                    ===================================== */}

                    {step === 2 && (

                        <>

                            <h1>
                                Vérification
                            </h1>


                            <p>
                                Entrez le code à 6 chiffres
                                envoyé à :
                            </p>


                            <strong className="verification-email">
                                {email}
                            </strong>


                            <form
                                onSubmit={handleOtpSubmit}
                            >

                                <div className="input-group">

                                    <label>
                                        Code de vérification
                                    </label>


                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={6}
                                        placeholder="••••••"
                                        value={otp}
                                        onChange={(e) =>
                                            setOtp(
                                                e.target.value.replace(
                                                    /\D/g,
                                                    ""
                                                )
                                            )
                                        }
                                        required
                                    />

                                </div>


                                {error && (

                                    <p className="forgot-error">
                                        {error}
                                    </p>

                                )}


                                {message && (

                                    <p className="forgot-success">
                                        {message}
                                    </p>

                                )}


                                <button
                                    type="submit"
                                    disabled={loading}
                                >

                                    {loading
                                        ? "Vérification..."
                                        : "Vérifier le code"
                                    }

                                </button>


                            </form>


                            <button
                                type="button"
                                className="back-button"
                                onClick={handleBackToEmail}
                            >
                                ← Modifier l'email
                            </button>


                            <Link
                                to="/login"
                                className="back-login"
                            >
                                ← Retour à la connexion
                            </Link>

                        </>

                    )}


                    {/* =====================================
                        STEP 3 : NOUVEAU MOT DE PASSE
                    ===================================== */}

                    {step === 3 && (

                        <>

                            <h1>
                                Nouveau mot de passe
                            </h1>


                            <p>
                                Créez un nouveau mot de passe
                                pour votre compte.
                            </p>


                            <form
                                onSubmit={handlePasswordSubmit}
                            >


                                <div className="input-group">

                                    <label>
                                        Nouveau mot de passe
                                    </label>


                                    <input
                                        type="password"
                                        placeholder="Nouveau mot de passe"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                </div>


                                <div className="input-group">

                                    <label>
                                        Confirmer le mot de passe
                                    </label>


                                    <input
                                        type="password"
                                        placeholder="Confirmez votre mot de passe"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                </div>


                                {error && (

                                    <p className="forgot-error">
                                        {error}
                                    </p>

                                )}


                                {message && (

                                    <p className="forgot-success">
                                        {message}
                                    </p>

                                )}


                                <button
                                    type="submit"
                                    disabled={loading}
                                >

                                    {loading
                                        ? "Modification..."
                                        : "Modifier le mot de passe"
                                    }

                                </button>


                            </form>


                            {message && (

                                <button
                                    type="button"
                                    className="back-login"
                                    onClick={() =>
                                        navigate("/login")
                                    }
                                >
                                    Se connecter
                                </button>

                            )}

                        </>

                    )}

                </div>

            </div>

        </div>

    );

}


export default ForgotPassword;