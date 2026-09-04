const User = require("../models/User");


// ==========================================
// GET /api/users
// ==========================================

const getAllUsers = async (req, res) => {

    try {

        const users =
            await User.getAll();


        res.status(200).json(users);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message
        });

    }

};


// ==========================================
// GET /api/users/:id
// ==========================================

const getUserById = async (req, res) => {

    try {

        const { id } = req.params;


        const user =
            await User.getById(id);


        if (!user) {

            return res.status(404).json({
                message: "Utilisateur introuvable"
            });

        }


        res.status(200).json(user);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message
        });

    }

};


// ==========================================
// PUT /api/users/:id
// ==========================================

const updateUser = async (req, res) => {

    try {

        const { id } = req.params;


        const user =
            await User.update(
                id,
                req.body
            );


        if (!user) {

            return res.status(404).json({
                message: "Utilisateur introuvable"
            });

        }


        res.status(200).json({

            message:
                "Profil mis à jour avec succès",

            user

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message
        });

    }

};


// ==========================================
// DELETE /api/users/:id
// ==========================================

const deleteUser = async (req, res) => {

    try {

        const { id } = req.params;


        const user =
            await User.delete(id);


        if (!user) {

            return res.status(404).json({

                message:
                    "Utilisateur introuvable"

            });

        }


        res.status(200).json({

            message:
                "Client supprimé avec succès",

            id: user.id

        });

    } catch (error) {

        console.error(
            "Erreur suppression utilisateur :",
            error
        );


        // FK constraint
        if (
            error.code === "23503"
        ) {

            return res.status(409).json({

                message:
                    "Impossible de supprimer ce client car il possède des réservations ou des paiements."

            });

        }


        res.status(500).json({

            message:
                error.message

        });

    }

};


module.exports = {

    getAllUsers,

    getUserById,

    updateUser,

    deleteUser

};