const db = require("../config/db");

const Reservation = {

    // ==========================================
    // AFFICHER TOUTES LES RÉSERVATIONS
    // ==========================================

    getAll: async () => {

        const result = await db.query(`

            SELECT
                r.id,
                r.user_id,
                r.room_id,
                r.date_arriv,
                r.date_depart,
                r.nb_per,
                r.prix_total,
                r.solde,
                r.status,

                u.nom,
                u.prenom,
                u.email,
                u.telephone,

                ro.numero,
                ro.type,
                ro.prix_par_nuit

            FROM reservation r

            INNER JOIN "user" u
                ON r.user_id = u.id

            LEFT JOIN rooms ro
                ON r.room_id = ro.id

            ORDER BY r.id DESC

        `);

        return result.rows;
    },


    // ==========================================
    // UNE RÉSERVATION
    // ==========================================

    getById: async (id) => {

        const result = await db.query(`

            SELECT
                r.id,
                r.user_id,
                r.room_id,
                r.date_arriv,
                r.date_depart,
                r.nb_per,
                r.prix_total,
                r.solde,
                r.status,

                u.nom,
                u.prenom,
                u.email,
                u.telephone,

                ro.numero,
                ro.type,
                ro.prix_par_nuit

            FROM reservation r

            INNER JOIN "user" u
                ON r.user_id = u.id

            LEFT JOIN rooms ro
                ON r.room_id = ro.id

            WHERE r.id = $1

        `, [id]);

        return result.rows[0];
    },


    // ==========================================
    // RÉSERVATIONS D'UN USER
    // ==========================================

    getByUser: async (userId) => {

        const result = await db.query(`

            SELECT
                r.id,
                r.user_id,
                r.room_id,
                r.date_arriv,
                r.date_depart,
                r.nb_per,
                r.prix_total,
                r.solde,
                r.status,

                u.nom,
                u.prenom,
                u.email,
                u.telephone,

                ro.type,
                ro.numero,
                ro.prix_par_nuit

            FROM reservation r

            INNER JOIN "user" u
                ON r.user_id = u.id

            LEFT JOIN rooms ro
                ON r.room_id = ro.id

            WHERE r.user_id = $1

            ORDER BY r.id DESC

        `, [userId]);

        return result.rows;
    },


    // ==========================================
    // CRÉER
    // ==========================================

    create: async (data) => {

        const {

            user_id,
            room_id,
            date_arriv,
            date_depart,
            nb_per,
            prix_total,
            solde,
            status

        } = data;


        const result = await db.query(`

            INSERT INTO reservation
            (
                user_id,
                room_id,
                date_arriv,
                date_depart,
                nb_per,
                prix_total,
                solde,
                status
            )

            VALUES ($1,$2,$3,$4,$5,$6,$7,$8)

            RETURNING *

        `, [

            user_id,
            room_id,
            date_arriv,
            date_depart,
            nb_per,
            prix_total,
            solde,
            status

        ]);


        return result.rows[0];
    },


    // ==========================================
    // MODIFIER
    // ==========================================

    update: async (id, data) => {

        const {

            date_arriv,
            date_depart,
            nb_per,
            prix_total,
            solde,
            status

        } = data;


        const result = await db.query(`

            UPDATE reservation

            SET
                date_arriv = $1,
                date_depart = $2,
                nb_per = $3,
                prix_total = $4,
                solde = $5,
                status = $6

            WHERE id = $7

            RETURNING *

        `, [

            date_arriv,
            date_depart,
            nb_per,
            prix_total,
            solde,
            status,
            id

        ]);


        return result.rows[0];
    },


    // ==========================================
    // SUPPRIMER
    // ==========================================

    remove: async (id) => {

        const result = await db.query(`

            DELETE FROM reservation

            WHERE id = $1

            RETURNING *

        `, [id]);


        return result.rows[0];
    }

};


module.exports = Reservation;