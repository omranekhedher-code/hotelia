const db = require("../config/db");

const Payment = {

    // =====================================================
    // TOUS LES PAIEMENTS
    // =====================================================

    getAll: async () => {

        const result = await db.query(`

            SELECT
                p.*,

                r.user_id,
                r.room_id,
                r.date_arriv,
                r.date_depart,
                r.nb_per,
                r.prix_total,

                u.nom,
                u.prenom,
                u.email,
                u.telephone

            FROM payments p

            INNER JOIN reservation r
                ON p.reservation_id = r.id

            INNER JOIN "user" u
                ON r.user_id = u.id

            ORDER BY p.id DESC

        `);

        return result.rows;
    },


    // =====================================================
    // PAIEMENT PAR ID
    // =====================================================

    getById: async (id) => {

        const result = await db.query(`

            SELECT
                p.*,

                r.user_id,
                r.room_id,
                r.date_arriv,
                r.date_depart,
                r.nb_per,
                r.prix_total,

                u.nom,
                u.prenom,
                u.email,
                u.telephone

            FROM payments p

            INNER JOIN reservation r
                ON p.reservation_id = r.id

            INNER JOIN "user" u
                ON r.user_id = u.id

            WHERE p.id = $1

        `, [id]);

        return result.rows[0];
    },


    // =====================================================
    // PAIEMENTS USER
    // =====================================================

    getByUser: async (userId) => {

        const result = await db.query(`

            SELECT
                p.*,

                r.user_id,
                r.room_id,
                r.date_arriv,
                r.date_depart,
                r.nb_per,
                r.prix_total

            FROM payments p

            INNER JOIN reservation r
                ON p.reservation_id = r.id

            WHERE r.user_id = $1

            ORDER BY p.id DESC

        `, [userId]);

        return result.rows;
    },


    // =====================================================
    // CRÉER PAIEMENT
    // =====================================================

    create: async (data) => {

        const {

            reservation_id,
            montant,
            mode_paiement,
            status,
            date_paiement,
            transaction_id

        } = data;


        const result = await db.query(`

            INSERT INTO payments
            (
                reservation_id,
                montant,
                mode_paiement,
                status,
                date_paiement,
                transaction_id
            )

            VALUES ($1,$2,$3,$4,$5,$6)

            RETURNING *

        `, [

            reservation_id,
            montant,
            mode_paiement,
            status,
            date_paiement,
            transaction_id

        ]);


        return result.rows[0];

    }

};


module.exports = Payment;