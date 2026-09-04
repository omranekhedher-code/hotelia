const express = require("express");
const router = express.Router();

const Room = require("../models/Room");


// afficher les chambres
router.get("/", async (req,res)=>{
    const rooms = await Room.findAll();
    res.json(rooms);
});


// ajouter chambre
router.post("/", async(req,res)=>{

    const room = await Room.create({
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        image:req.body.image
    });

    res.json(room);

});


module.exports = router;