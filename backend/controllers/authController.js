const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");


// =====================================================
// EMAIL CONFIGURATION
// =====================================================

const transporter = nodemailer.createTransport({

    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }

});


// =====================================================
// REGISTER
// =====================================================

const register = async (req, res) => {

    try {

        const {
            nom,
            prenom,
            email,
            password,
            telephone
        } = req.body;


        const existingUser =
            await User.getByEmail(email);


        if (existingUser) {

            return res.status(400).json({
                message: "Email déjà utilisé"
            });

        }


        const hashedPassword =
            await bcrypt.hash(password, 10);


        const user = await User.create({

            nom,
            prenom,
            email,
            password: hashedPassword,
            telephone,
            role: "user"

        });


        res.status(201).json({

            message:
                "Utilisateur créé avec succès",

            user: {

                id: user.id,
                nom: user.nom,
                prenom: user.prenom,
                email: user.email,
                telephone: user.telephone,
                role: user.role

            }

        });


    } catch (error) {

        console.error(
            "Erreur register :",
            error
        );

        res.status(500).json({

            message:
                error.message

        });

    }

};


// =====================================================
// LOGIN
// =====================================================

const login = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        const user =
            await User.getByEmail(email);


        if (!user) {

            return res.status(404).json({

                message:
                    "Utilisateur introuvable"

            });

        }


        const match =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!match) {

            return res.status(400).json({

                message:
                    "Mot de passe incorrect"

            });

        }


        const token = jwt.sign(

            {
                id: user.id,
                role: user.role
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "1d"
            }

        );


        res.status(200).json({

            message:
                "Connexion réussie",

            token,

            user: {

                id: user.id,
                nom: user.nom,
                prenom: user.prenom,
                email: user.email,
                telephone: user.telephone,
                role: user.role

            }

        });


    } catch (error) {

        console.error(
            "Erreur login :",
            error
        );

        res.status(500).json({

            message:
                error.message

        });

    }

};


// =====================================================
// FORGOT PASSWORD
// ENVOYER OTP
// =====================================================

const forgotPassword = async (req, res) => {

    try {

        const { email } = req.body;


        if (!email) {

            return res.status(400).json({

                message:
                    "Veuillez entrer votre email."

            });

        }


        // Chercher utilisateur

        const user =
            await User.getByEmail(email);


        if (!user) {

            return res.status(404).json({

                message:
                    "Aucun compte associé à cet email."

            });

        }


        // Générer OTP 6 chiffres

        const otp =
            Math.floor(
                100000 +
                Math.random() * 900000
            ).toString();


        // OTP valide pendant 10 minutes

        const expires =
            new Date(
                Date.now() + 10 * 60 * 1000
            );


        // Sauvegarder OTP

        await User.saveResetOtp(
            user.id,
            otp,
            expires
        );


        // Envoyer email

        await transporter.sendMail({

            from:
                process.env.EMAIL_USER,

            to:
                user.email,

            subject:
                "Hotelia - Code de vérification",

            html: `

<!DOCTYPE html>

<html>

<head>

    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>Hotelia - Code de vérification</title>

</head>


<body style="
    margin: 0;
    padding: 0;
    background-color: #f4f5f7;
    font-family: Arial, Helvetica, sans-serif;
">


    <div style="
        width: 100%;
        padding: 40px 0;
    ">


        <!-- CONTAINER -->

        <div style="
            max-width: 600px;
            margin: auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 8px 30px rgba(0,0,0,0.08);
        ">


            <!-- HEADER -->

            <div style="
                background: #172033;
                padding: 28px;
                text-align: center;
            ">

                <h1 style="
                    margin: 0;
                    color: #ffffff;
                    font-size: 28px;
                    letter-spacing: 1px;
                ">
                    Hotelia
                </h1>

                <p style="
                    margin: 8px 0 0;
                    color: #c89b4a;
                    font-size: 13px;
                    letter-spacing: 1px;
                ">
                    VOTRE SÉJOUR, NOTRE PRIORITÉ
                </p>

            </div>


            <!-- CONTENT -->

            <div style="
                padding: 40px 35px;
            ">


                <h2 style="
                    margin-top: 0;
                    color: #172033;
                    font-size: 22px;
                ">
                    Bonjour ${user.prenom || ""},
                </h2>


                <p style="
                    color: #555555;
                    font-size: 15px;
                    line-height: 1.7;
                ">
                    Vous avez demandé la réinitialisation
                    de votre mot de passe Hotelia.
                </p>


                <p style="
                    color: #555555;
                    font-size: 15px;
                    line-height: 1.7;
                ">
                    Utilisez le code ci-dessous pour
                    continuer :
                </p>


                <!-- OTP -->

                <div style="
                    margin: 30px 0;
                    padding: 25px;
                    background: #faf8f3;
                    border: 1px solid #ead9b8;
                    border-radius: 12px;
                    text-align: center;
                ">

                    <p style="
                        margin: 0 0 12px;
                        color: #777777;
                        font-size: 13px;
                    ">
                        CODE DE VÉRIFICATION
                    </p>


                    <div style="
                        font-size: 34px;
                        font-weight: bold;
                        letter-spacing: 10px;
                        color: #c89b4a;
                    ">
                        ${otp}
                    </div>

                </div>


                <p style="
                    text-align: center;
                    color: #777777;
                    font-size: 14px;
                ">
                    Ce code est valable pendant
                    <strong style="color: #172033;">
                        10 minutes
                    </strong>.
                </p>


                <div style="
                    margin-top: 30px;
                    padding: 15px;
                    background: #f8f8f8;
                    border-radius: 8px;
                ">

                    <p style="
                        margin: 0;
                        color: #777777;
                        font-size: 13px;
                        line-height: 1.6;
                    ">
                        🔒 Pour votre sécurité, ne partagez
                        jamais ce code avec quelqu'un d'autre.
                    </p>

                </div>


                <p style="
                    margin-top: 30px;
                    color: #888888;
                    font-size: 13px;
                    line-height: 1.6;
                ">
                    Si vous n'avez pas demandé cette
                    réinitialisation, vous pouvez ignorer
                    cet email.
                </p>


            </div>


            <!-- FOOTER -->

            <div style="
                border-top: 1px solid #eeeeee;
                padding: 20px;
                text-align: center;
                background: #fafafa;
            ">

                <p style="
                    margin: 0;
                    color: #999999;
                    font-size: 12px;
                ">
                    © 2026 Hotelia. Tous droits réservés.
                </p>

            </div>


        </div>

    </div>

</body>

</html>

`

        });


        res.status(200).json({

            message:
                "Code de vérification envoyé à votre email."

        });


    } catch (error) {

        console.error(
            "Erreur forgot password :",
            error
        );

        res.status(500).json({

            message:
                "Impossible d'envoyer le code."

        });

    }

};


// =====================================================
// VERIFY OTP
// =====================================================

const verifyOtp = async (req, res) => {

    try {

        const {
            email,
            otp
        } = req.body;


        if (!email || !otp) {

            return res.status(400).json({

                message:
                    "Email et code OTP obligatoires."

            });

        }


        const user =
            await User.getByEmail(email);


        if (!user) {

            return res.status(404).json({

                message:
                    "Utilisateur introuvable."

            });

        }


        // Vérifier si OTP existe

        if (!user.reset_otp) {

            return res.status(400).json({

                message:
                    "Aucun code de vérification demandé."

            });

        }


        // Vérifier expiration

        if (
            !user.reset_otp_expires ||
            new Date() >
            new Date(user.reset_otp_expires)
        ) {

            return res.status(400).json({

                message:
                    "Le code a expiré."

            });

        }


        // Vérifier OTP

        if (
            user.reset_otp !==
            otp.toString()
        ) {

            return res.status(400).json({

                message:
                    "Code de vérification incorrect."

            });

        }


        res.status(200).json({

            message:
                "Code vérifié avec succès."

        });


    } catch (error) {

        console.error(
            "Erreur verify OTP :",
            error
        );

        res.status(500).json({

            message:
                "Erreur serveur."

        });

    }

};


// =====================================================
// RESET PASSWORD
// =====================================================

const resetPassword = async (req, res) => {

    try {

        const {
            email,
            otp,
            password
        } = req.body;


        if (
            !email ||
            !otp ||
            !password
        ) {

            return res.status(400).json({

                message:
                    "Email, OTP et nouveau mot de passe obligatoires."

            });

        }


        // Vérifier mot de passe minimum

        if (password.length < 6) {

            return res.status(400).json({

                message:
                    "Le mot de passe doit contenir au moins 6 caractères."

            });

        }


        const user =
            await User.getByEmail(email);


        if (!user) {

            return res.status(404).json({

                message:
                    "Utilisateur introuvable."

            });

        }


        // Vérifier OTP

        if (
            !user.reset_otp ||
            user.reset_otp !==
            otp.toString()
        ) {

            return res.status(400).json({

                message:
                    "Code de vérification incorrect."

            });

        }


        // Vérifier expiration

        if (
            !user.reset_otp_expires ||
            new Date() >
            new Date(user.reset_otp_expires)
        ) {

            return res.status(400).json({

                message:
                    "Le code a expiré."

            });

        }


        // Hasher nouveau mot de passe

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        // Modifier password
        // + supprimer OTP

        await User.resetPassword(

            user.id,

            hashedPassword

        );


        res.status(200).json({

            message:
                "Mot de passe modifié avec succès."

        });


    } catch (error) {

        console.error(
            "Erreur reset password :",
            error
        );

        res.status(500).json({

            message:
                "Erreur serveur."

        });

    }

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    register,
    login,
    forgotPassword,
    verifyOtp,
    resetPassword

};