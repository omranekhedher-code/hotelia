const app = require("./app");
const db = require("./config/db");


const PORT = process.env.PORT || 5000;


// Test connexion database
db.connect()
.then(() => {
    console.log("Database connected");
})
.catch((error) => {
    console.log("Database error:", error.message);
});


// Lancer serveur
app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});