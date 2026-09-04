import React from "react";


function ReservationDetails(){


const reservation = {


room:"Suite Deluxe",

checkIn:"10/08/2026",

checkOut:"15/08/2026",

guests:2,

price:"500 DT",

payment:"Carte bancaire",

status:"Confirmée",

services:"Petit déjeuner, Wi-Fi, Piscine"

};





return (


<div className="reservation-details">



<h1>
Détails de la réservation
</h1>



<p>
Informations complètes concernant votre séjour
</p>







<div className="details-card">



<h2>
{reservation.room}
</h2>





<div className="details-grid">



<div>

<label>
Date d'arrivée
</label>

<p>
{reservation.checkIn}
</p>

</div>





<div>

<label>
Date de départ
</label>

<p>
{reservation.checkOut}
</p>

</div>





<div>

<label>
Nombre de personnes
</label>

<p>
{reservation.guests}
</p>

</div>





<div>

<label>
Montant total
</label>

<p>
{reservation.price}
</p>

</div>





<div>

<label>
Méthode de paiement
</label>

<p>
{reservation.payment}
</p>

</div>





<div>

<label>
Statut
</label>


<p>

<span className="status">

{reservation.status}

</span>

</p>


</div>




</div>







<div className="services-section">


<h3>
Services inclus
</h3>


<p>
{reservation.services}
</p>


</div>







<button className="cancel-btn">

Annuler la réservation

</button>




</div>






</div>


);


}


export default ReservationDetails;