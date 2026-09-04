const db = require("../config/db");

const DEFAULT_IMAGE = "imaged.png";

const Room = {

    // ==========================================
    // RÉCUPÉRER TOUTES LES CHAMBRES
    // AVEC RATING + NOMBRE D'AVIS
    // ==========================================

    getAll: async () => {

        const result = await db.query(`
            SELECT 
                r.*,

                COALESCE(
                    ROUND(AVG(rv.rating), 1),
                    0
                ) AS rating,

                COUNT(rv.id) AS review_count

            FROM rooms r

            LEFT JOIN reviews rv
                ON r.id = rv.room_id

            GROUP BY r.id

            ORDER BY r.id ASC
        `);

        return result.rows;
    },


    // ==========================================
    // RÉCUPÉRER UNE CHAMBRE PAR ID
    // AVEC RATING + AVIS + OPTIONS
    // ==========================================

    getById: async (id) => {

        // ==========================================
        // RÉCUPÉRER LA CHAMBRE
        // ==========================================

        const result = await db.query(
            `
            SELECT 
                r.*,

                COALESCE(
                    ROUND(AVG(rv.rating), 1),
                    0
                ) AS rating,

                COUNT(rv.id) AS review_count

            FROM rooms r

            LEFT JOIN reviews rv
                ON r.id = rv.room_id

            WHERE r.id = $1

            GROUP BY r.id
            `,
            [id]
        );


        // ==========================================
        // CHAMBRE INTROUVABLE
        // ==========================================

        if (result.rows.length === 0) {

            return null;

        }


        const room = result.rows[0];


        // ==========================================
        // RÉCUPÉRER LES OPTIONS
        // rooms
        //    ↓
        // room_options
        //    ↓
        // options
        // ==========================================

        const optionsResult = await db.query(
            `
            SELECT
                o.id,
                o.nom

            FROM options o

            INNER JOIN room_options ro
                ON ro.option_id = o.id

            WHERE ro.room_id = $1

            ORDER BY o.id ASC
            `,
            [id]
        );


        // Ajouter les options à la chambre

        room.options = optionsResult.rows;


        // ==========================================
        // RETOURNER LA CHAMBRE
        // ==========================================

        return room;
    },


    // ==========================================
    // AJOUTER UNE CHAMBRE
    // ==========================================

    create: async (room) => {

        if (!room) {

            throw new Error(
                "Les données de la chambre sont manquantes"
            );

        }


        const {
            numero,
            type,
            description,
            prix_par_nuit,
            capacite,
            disponible,
            image
        } = room;


        // ==========================================
        // IMAGE PAR DÉFAUT
        // ==========================================

        const finalImage =
            image || DEFAULT_IMAGE;


        // ==========================================
        // INSERTION
        // ==========================================

        const result = await db.query(
            `
            INSERT INTO rooms
            (
                numero,
                type,
                description,
                prix_par_nuit,
                capacite,
                disponible,
                image
            )

            VALUES ($1,$2,$3,$4,$5,$6,$7)

            RETURNING *
            `,
            [
                numero,
                type,
                description || "",
                prix_par_nuit,
                capacite,
                disponible,
                finalImage
            ]
        );


        return result.rows[0];
    },


    // ==========================================
    // MODIFIER UNE CHAMBRE
    // ==========================================

    update: async (id, room) => {

        if (!room) {

            throw new Error(
                "Les données de la chambre sont manquantes"
            );

        }


        const {
            numero,
            type,
            description,
            prix_par_nuit,
            capacite,
            disponible,
            image
        } = room;


        // ==========================================
        // SANS NOUVELLE IMAGE
        // GARDER L'ANCIENNE
        // ==========================================

        if (!image) {

            const result = await db.query(
                `
                UPDATE rooms

                SET
                    numero = $1,
                    type = $2,
                    description = $3,
                    prix_par_nuit = $4,
                    capacite = $5,
                    disponible = $6

                WHERE id = $7

                RETURNING *
                `,
                [
                    numero,
                    type,
                    description || "",
                    prix_par_nuit,
                    capacite,
                    disponible,
                    id
                ]
            );


            return result.rows[0];
        }


        // ==========================================
        // AVEC NOUVELLE IMAGE
        // ==========================================

        const result = await db.query(
            `
            UPDATE rooms

            SET
                numero = $1,
                type = $2,
                description = $3,
                prix_par_nuit = $4,
                capacite = $5,
                disponible = $6,
                image = $7

            WHERE id = $8

            RETURNING *
            `,
            [
                numero,
                type,
                description || "",
                prix_par_nuit,
                capacite,
                disponible,
                image,
                id
            ]
        );


        return result.rows[0];
    },


    // ==========================================
    // SUPPRIMER UNE CHAMBRE
    // ==========================================

    remove: async (id) => {

        const result = await db.query(
            `
            DELETE FROM rooms

            WHERE id = $1

            RETURNING *
            `,
            [id]
        );


        return result.rows[0];
    }

};


module.exports = Room;