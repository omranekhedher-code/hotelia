const jwt = require("jsonwebtoken");


const auth = (req, res, next) => {

    try {

        // récupérer token
        const token = req.headers.authorization?.split(" ")[1];


        if (!token) {
            return res.status(401).json({
                message: "Accès refusé, token manquant"
            });
        }


        // vérifier token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        req.user = decoded;


        next();


    } catch(error) {

        res.status(401).json({
            message: "Token invalide"
        });

    }

};


module.exports = auth;