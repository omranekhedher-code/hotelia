const db = require("../config/db");

const Promotion = {

    // =====================================================
    // AFFICHER TOUTES LES PROMOTIONS
    // =====================================================

    getAll: async () => {

        const result = await db.query(`

            SELECT
                p.id,
                p.titre,
                p.reduction,
                p.room_id AS promotion_room_id,
                p.date_debut,
                p.date_fin,
                p.status,
                p.created_at,

                r.id AS room_id,
                r.numero AS room_numero,
                r.type AS room_type,
                r.prix_par_nuit,
                r.description,
                r.image

            FROM promotions p

            LEFT JOIN rooms r
                ON p.room_id = r.id

            ORDER BY p.id DESC

        `);

        return result.rows;
    },


    // =====================================================
    // AFFICHER UNE PROMOTION
    // =====================================================

    getById: async (id) => {

        const result = await db.query(`

            SELECT
                p.id,
                p.titre,
                p.reduction,
                p.room_id AS promotion_room_id,
                p.date_debut,
                p.date_fin,
                p.status,
                p.created_at,

                r.id AS room_id,
                r.numero AS room_numero,
                r.type AS room_type,
                r.prix_par_nuit,
                r.description,
                r.image

            FROM promotions p

            LEFT JOIN rooms r
                ON p.room_id = r.id

            WHERE p.id = $1

        `, [id]);

        return result.rows[0];
    },


    // =====================================================
    // CREATE
    // =====================================================

    create: async (data) => {

        const {
            titre,
            reduction,
            room_id,
            date_debut,
            date_fin,
            status
        } = data;

        const result = await db.query(`

            INSERT INTO promotions
            (
                titre,
                reduction,
                room_id,
                date_debut,
                date_fin,
                status
            )

            VALUES
            ($1, $2, $3, $4, $5, $6)

            RETURNING *

        `, [
            titre,
            reduction,
            room_id || null,
            date_debut,
            date_fin,
            status || "Active"
        ]);

        return result.rows[0];
    },


    // =====================================================
    // UPDATE
    // =====================================================

    update: async (id, data) => {

        const {
            titre,
            reduction,
            room_id,
            date_debut,
            date_fin,
            status
        } = data;

        const result = await db.query(`

            UPDATE promotions

            SET
                titre = $1,
                reduction = $2,
                room_id = $3,
                date_debut = $4,
                date_fin = $5,
                status = $6

            WHERE id = $7

            RETURNING *

        `, [
            titre,
            reduction,
            room_id || null,
            date_debut,
            date_fin,
            status,
            id
        ]);

        return result.rows[0];
    },


    // =====================================================
    // DELETE
    // =====================================================

    delete: async (id) => {

        const result = await db.query(`

            DELETE FROM promotions

            WHERE id = $1

            RETURNING *

        `, [id]);

        return result.rows[0];
    }

};

module.exports = Promotion;