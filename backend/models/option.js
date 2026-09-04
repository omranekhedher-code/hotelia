const db = require("../config/db");


const Option = {


    getAll: async () => {

        const result = await db.query(
            "SELECT * FROM options"
        );

        return result.rows;

    },


    create: async (nom)=>{

        const result = await db.query(

            `INSERT INTO options (nom)
            VALUES ($1)
            RETURNING *`,

            [nom]

        );


        return result.rows[0];

    }


};


module.exports = Option;