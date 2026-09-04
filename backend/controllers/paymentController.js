const Payment = require("../models/Payment");
const Reservation = require("../models/Reservation");


// =====================================================
// TOUS LES PAIEMENTS
// =====================================================

const getAllPayments = async (req, res) => {

    try {

        const payments =
            await Payment.getAll();

        res.status(200).json(payments);

    } catch (error) {

        console.error(
            "Erreur getAllPayments :",
            error
        );

        res.status(500).json({
            message: error.message
        });

    }

};


// =====================================================
// PAIEMENT PAR ID
// =====================================================

const getPaymentById = async (req, res) => {

    try {

        const { id } = req.params;

        const payment =
            await Payment.getById(id);


        if (!payment) {

            return res.status(404).json({

                message:
                    "Paiement introuvable"

            });

        }


        res.status(200).json(payment);

    } catch (error) {

        console.error(
            "Erreur paiement :",
            error
        );

        res.status(500).json({

            message:
                error.message

        });

    }

};


// =====================================================
// PAIEMENTS USER
// =====================================================

const getPaymentsByUser = async (req, res) => {

    try {

        const { userId } =
            req.params;


        const payments =
            await Payment.getByUser(
                userId
            );


        res.status(200).json(payments);

    } catch (error) {

        console.error(
            "Erreur getPaymentsByUser :",
            error
        );

        res.status(500).json({

            message:
                error.message

        });

    }

};


// =====================================================
// CRÉER PAIEMENT
// =====================================================

const createPayment = async (req, res) => {

    try {

        if (!req.user || !req.user.id) {

            return res.status(401).json({

                message:
                    "Utilisateur non authentifié"

            });

        }


        const {

            reservation_id,
            montant,
            mode_paiement

        } = req.body;


        // =============================================
        // VALIDATION
        // =============================================

        if (
            !reservation_id ||
            !montant ||
            !mode_paiement
        ) {

            return res.status(400).json({

                message:
                    "Informations de paiement incomplètes"

            });

        }


        // =============================================
        // RESERVATION
        // =============================================

        const reservation =
            await Reservation.getById(
                reservation_id
            );


        if (!reservation) {

            return res.status(404).json({

                message:
                    "Réservation introuvable"

            });

        }


        // =============================================
        // VÉRIFIER PROPRIÉTAIRE
        // =============================================

        if (
            Number(reservation.user_id) !==
            Number(req.user.id)
        ) {

            return res.status(403).json({

                message:
                    "Vous n'êtes pas autorisé à payer cette réservation."

            });

        }


        // =============================================
        // CRÉER PAYMENT
        // =============================================

        const payment =
            await Payment.create({

                reservation_id,

                montant,

                mode_paiement,

                status: "payé",

                date_paiement:
                    new Date(),

                transaction_id:
                    `HTL-${Date.now()}`

            });


        // =============================================
        // UPDATE RESERVATION
        // =============================================

        const updatedReservation =
            await Reservation.update(

                reservation_id,

                {

                    date_arriv:
                        reservation.date_arriv,

                    date_depart:
                        reservation.date_depart,

                    nb_per:
                        reservation.nb_per,

                    prix_total:
                        reservation.prix_total,

                    solde: 0,

                    status: "confirmée"

                }

            );


        res.status(201).json({

            message:
                "Paiement effectué avec succès",

            payment,

            reservation:
                updatedReservation

        });


    } catch (error) {

        console.error(
            "Erreur createPayment :",
            error
        );

        res.status(500).json({

            message:
                error.message

        });

    }

};


module.exports = {

    getAllPayments,

    getPaymentById,

    getPaymentsByUser,

    createPayment

};