const db = require("../config/db");

const Review = {

    // =====================================================
    // AFFICHER TOUS LES AVIS AVEC INFOS USER
    // =====================================================

    getAll: async () => {

        const result = await db.query(`
            SELECT
                r.id,
                r.user_id,
                r.room_id,
                r.rating,
                r.comment,
                r.created_at,

                u.nom,
                u.prenom,
                u.email

            FROM reviews r

            LEFT JOIN "user" u
                ON r.user_id = u.id

            ORDER BY r.id DESC
        `);

        return result.rows;
    },


    // =====================================================
    // AVIS D'UN UTILISATEUR
    // =====================================================

    getByUser: async (userId) => {

        const result = await db.query(`
            SELECT
                r.*,
                u.nom,
                u.prenom,
                u.email

            FROM reviews r

            LEFT JOIN "user" u
                ON r.user_id = u.id

            WHERE r.user_id = $1

            ORDER BY r.id DESC
        `, [userId]);

        return result.rows;
    },


    // =====================================================
    // AJOUTER UN AVIS
    // =====================================================

    create: async (data) => {

        const {
            user_id,
            room_id,
            rating,
            comment
        } = data;

        const result = await db.query(`
            INSERT INTO reviews
            (
                user_id,
                room_id,
                rating,
                comment
            )
            VALUES ($1, $2, $3, $4)

            RETURNING *
        `, [
            user_id,
            room_id,
            rating,
            comment
        ]);

        return result.rows[0];
    },


    // =====================================================
    // AVIS D'UNE CHAMBRE
    // =====================================================

    getByRoom: async (room_id) => {

        const result = await db.query(`
            SELECT
                r.*,
                u.nom,
                u.prenom,
                u.email

            FROM reviews r

            LEFT JOIN "user" u
                ON r.user_id = u.id

            WHERE r.room_id = $1

            ORDER BY r.id DESC
        `, [room_id]);

        return result.rows;
    },


    // =====================================================
    // SUPPRIMER UN AVIS
    // =====================================================

    delete: async (id) => {

        const result = await db.query(`
            DELETE FROM reviews
            WHERE id = $1
            RETURNING *
        `, [id]);

        return result.rows[0];
    }

};

module.exports = Review;