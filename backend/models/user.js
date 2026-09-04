const db = require("../config/db");
const bcrypt = require("bcrypt");

const User = {

    // ==========================================
    // Afficher tous les utilisateurs
    // ==========================================

    getAll: async () => {

        const result = await db.query(
            'SELECT id, nom, prenom, email, telephone, role FROM "user"'
        );

        return result.rows;
    },


    // ==========================================
    // Afficher un utilisateur par ID
    // ==========================================

    getById: async (id) => {

        const result = await db.query(
            'SELECT id, nom, prenom, email, telephone, role FROM "user" WHERE id = $1',
            [id]
        );

        return result.rows[0];
    },


    // ==========================================
    // Chercher utilisateur par email
    // ==========================================

    getByEmail: async (email) => {

        const result = await db.query(
            'SELECT * FROM "user" WHERE email = $1',
            [email]
        );

        return result.rows[0];
    },


    // ==========================================
    // Créer utilisateur
    // ==========================================

    create: async (data) => {

        const {
            nom,
            prenom,
            email,
            password,
            telephone,
            role
        } = data;


        const result = await db.query(

            `INSERT INTO "user"
            (nom, prenom, email, password, telephone, role)
            VALUES ($1,$2,$3,$4,$5,$6)
            RETURNING id, nom, prenom, email, telephone, role`,

            [
                nom,
                prenom,
                email,
                password,
                telephone,
                role
            ]

        );

        return result.rows[0];
    },


    // ==========================================
    // Modifier profil
    // ==========================================

    update: async (id, data) => {

        const {
            nom,
            prenom,
            email,
            telephone,
            password
        } = data;


        // Avec nouveau mot de passe
        if (
            password &&
            password.trim() !== ""
        ) {

            const hashedPassword =
                await bcrypt.hash(password, 10);


            const result = await db.query(

                `UPDATE "user"
                 SET nom = $1,
                     prenom = $2,
                     email = $3,
                     telephone = $4,
                     password = $5
                 WHERE id = $6
                 RETURNING id, nom, prenom, email, telephone, role`,

                [
                    nom,
                    prenom,
                    email,
                    telephone,
                    hashedPassword,
                    id
                ]

            );

            return result.rows[0];
        }


        // Sans changer le mot de passe
        const result = await db.query(

            `UPDATE "user"
             SET nom = $1,
                 prenom = $2,
                 email = $3,
                 telephone = $4
             WHERE id = $5
             RETURNING id, nom, prenom, email, telephone, role`,

            [
                nom,
                prenom,
                email,
                telephone,
                id
            ]

        );

        return result.rows[0];
    },


    // ==========================================
    // Supprimer utilisateur
    // ==========================================

    delete: async (id) => {

        const result = await db.query(

            `DELETE FROM "user"
             WHERE id = $1
             RETURNING id`,

            [id]

        );

        return result.rows[0];
    },


    // ==========================================
    // SAUVEGARDER OTP RESET PASSWORD
    // ==========================================

    saveResetOtp: async (id, otp, expires) => {

        const result = await db.query(

            `UPDATE "user"
             SET reset_otp = $1,
                 reset_otp_expires = $2
             WHERE id = $3
             RETURNING id, email, reset_otp, reset_otp_expires`,

            [
                otp,
                expires,
                id
            ]

        );

        return result.rows[0];
    },


    // ==========================================
    // RESET PASSWORD
    // ==========================================

    resetPassword: async (id, hashedPassword) => {

        const result = await db.query(

            `UPDATE "user"
             SET password = $1,
                 reset_otp = NULL,
                 reset_otp_expires = NULL
             WHERE id = $2
             RETURNING id, nom, prenom, email, telephone, role`,

            [
                hashedPassword,
                id
            ]

        );

        return result.rows[0];
    }

};


module.exports = User;