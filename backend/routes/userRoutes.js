const express = require("express");

const router = express.Router();


const {

    getAllUsers,

    getUserById,

    updateUser,

    deleteUser

} = require("../controllers/userController");


// GET /api/users
router.get(
    "/",
    getAllUsers
);


// GET /api/users/:id
router.get(
    "/:id",
    getUserById
);


// PUT /api/users/:id
router.put(
    "/:id",
    updateUser
);


// DELETE /api/users/:id
router.delete(
    "/:id",
    deleteUser
);


module.exports = router;