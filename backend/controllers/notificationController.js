const db = require("../config/db");


// =====================================================
// GET NOTIFICATIONS
// =====================================================

const getNotifications = async (req, res) => {

    try {

        const result = await db.query(`

            SELECT
                *
            FROM (

                -- =====================================
                -- RÉSERVATIONS
                -- =====================================

                SELECT
                    'reservation-' || r.id AS id,

                    'Nouvelle réservation' AS title,

                    CONCAT(
                        u.prenom,
                        ' ',
                        u.nom,
                        ' a effectué une réservation'
                    ) AS message,

                    r.id AS reference_id,

                    'reservation' AS type,

                    r.id AS sort_id,

                    r.date_arriv AS event_date

                FROM reservation r

                INNER JOIN "user" u
                    ON r.user_id = u.id


                UNION ALL


                -- =====================================
                -- PAIEMENTS
                -- =====================================

                SELECT
                    'payment-' || p.id AS id,

                    'Paiement reçu' AS title,

                    CONCAT(
                        'Paiement de ',
                        p.montant,
                        ' DT confirmé'
                    ) AS message,

                    p.id AS reference_id,

                    'payment' AS type,

                    p.id AS sort_id,

                    p.date_paiement AS event_date

                FROM payments p


                UNION ALL


                -- =====================================
                -- AVIS
                -- =====================================

                SELECT
                    'review-' || rv.id AS id,

                    'Nouvel avis' AS title,

                    CONCAT(
                        'Un client a ajouté un nouvel avis (',
                        rv.rating,
                        '/5)'
                    ) AS message,

                    rv.id AS reference_id,

                    'review' AS type,

                    rv.id AS sort_id,

                    rv.created_at AS event_date

                FROM reviews rv

            ) AS notifications

            ORDER BY event_date DESC NULLS LAST

            LIMIT 50

        `);


        // =============================================
        // FORMAT DATE
        // =============================================

        const notifications =
            result.rows.map(notification => {

                let date = "-";


                if (notification.event_date) {

                    const eventDate =
                        new Date(
                            notification.event_date
                        );

                    const now =
                        new Date();


                    const diff =
                        now.getTime() -
                        eventDate.getTime();


                    const oneDay =
                        24 * 60 * 60 * 1000;


                    if (
                        diff >= 0 &&
                        diff < oneDay
                    ) {

                        date = "Aujourd'hui";

                    } else if (
                        diff >= oneDay &&
                        diff < 2 * oneDay
                    ) {

                        date = "Hier";

                    } else {

                        date =
                            eventDate.toLocaleDateString(
                                "fr-FR",
                                {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric"
                                }
                            );

                    }

                }


                return {

                    id:
                        notification.id,

                    title:
                        notification.title,

                    message:
                        notification.message,

                    date,

                    type:
                        notification.type,

                    reference_id:
                        notification.reference_id

                };

            });


        res.status(200).json(
            notifications
        );


    } catch (error) {

        console.error(
            "Erreur notifications :",
            error
        );


        res.status(500).json({

            message:
                "Erreur récupération notifications"

        });

    }

};


module.exports = {
    getNotifications
};