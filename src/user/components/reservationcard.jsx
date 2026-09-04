import React from "react";

import "../user.css";


function ReservationCard({reservation}) {


return (


<div className="reservation-card">



<h2>
{reservation.room}
</h2>





<div className="reservation-info">


<p>
Date d'arrivée : {reservation.checkIn}
</p>


<p>
Date de départ : {reservation.checkOut}
</p>


<p>
Nombre de personnes : {reservation.guests}
</p>


<p>
Montant : {reservation.price}
</p>


<p>

Statut :

<span className="status">

{reservation.status}

</span>

</p>



</div>





<button className="details-btn">

Voir détails

</button>




</div>


);


}


export default ReservationCard;