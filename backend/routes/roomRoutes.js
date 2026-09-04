const express = require("express");

const router = express.Router();

const {

    getAllRooms,

    getRoomById,

    createRoom,

    updateRoom,

    deleteRoom

} = require("../controllers/roomController");


const upload =
    require("../middleware/upload");


// GET ALL
router.get(
    "/",
    getAllRooms
);


// GET BY ID
router.get(
    "/:id",
    getRoomById
);


// CREATE
router.post(
    "/",
    upload.single("image"),
    createRoom
);


// UPDATE
router.put(
    "/:id",
    upload.single("image"),
    updateRoom
);


// DELETE
router.delete(
    "/:id",
    deleteRoom
);


module.exports = router;