import React, { useEffect, useState } from "react";

function Reviews() {

    const [review, setReview] = useState({
        reservation_id: "",
        rating: 0,
        comment: ""
    });

    const [reservations, setReservations] = useState([]);
    const [reviews, setReviews] = useState([]);

    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");

    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    const user = storedUser
        ? JSON.parse(storedUser)
        : null;

    const userId = user?.id;


    // =========================
    // Charger réservations + avis
    // =========================

    useEffect(() => {

        const fetchData = async () => {

            if (!userId) {
                setError("Utilisateur non connecté.");
                setLoading(false);
                return;
            }

            try {

                const [reservationsResponse, reviewsResponse] =
                    await Promise.all([

                        fetch(
                            `http://localhost:5000/api/reservations/user/${userId}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            }
                        ),

                        fetch(
                            `http://localhost:5000/api/reviews/user/${userId}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            }
                        )

                    ]);


                const reservationsData =
                    await reservationsResponse.json();

                const reviewsData =
                    await reviewsResponse.json();


                if (!reservationsResponse.ok) {
                    throw new Error(
                        reservationsData.message ||
                        "Erreur réservations."
                    );
                }


                if (!reviewsResponse.ok) {
                    throw new Error(
                        reviewsData.message ||
                        "Erreur avis."
                    );
                }


                console.log(
                    "Reservations :",
                    reservationsData
                );

                console.log(
                    "Reviews :",
                    reviewsData
                );


                setReservations(reservationsData);
                setReviews(reviewsData);


            } catch (error) {

                console.error(
                    "Erreur Reviews :",
                    error
                );

                setError(error.message);

            } finally {

                setLoading(false);

            }

        };


        fetchData();

    }, [userId, token]);


    // =========================
    // Changement formulaire
    // =========================

    const handleChange = (e) => {

        setReview({
            ...review,
            [e.target.name]: e.target.value
        });

    };


    // =========================
    // Envoyer avis
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();


        if (!review.reservation_id) {

            alert(
                "Veuillez sélectionner une réservation."
            );

            return;
        }


        if (!review.comment.trim()) {

            alert(
                "Veuillez écrire un commentaire."
            );

            return;
        }


        // Trouver la réservation sélectionnée

        const selectedReservation =
            reservations.find(
                (reservation) =>
                    reservation.id ===
                    Number(review.reservation_id)
            );


        if (!selectedReservation) {

            alert(
                "Réservation introuvable."
            );

            return;
        }


        setSending(true);


        try {

            const response = await fetch(
                "http://localhost:5000/api/reviews",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({

                        user_id: userId,

                        room_id:
                            selectedReservation.room_id,

                        rating:
                            Number(review.rating),

                        comment:
                            review.comment

                    })

                }
            );


            const data =
                await response.json();


            console.log(
                "Review créé :",
                data
            );


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Impossible d'ajouter l'avis."
                );

            }


            alert(
                "Votre avis a été ajouté avec succès"
            );


            setReviews([
                data.review,
                ...reviews
            ]);


            setReview({
                reservation_id: "",
                rating: 5,
                comment: ""
            });


        } catch (error) {

            console.error(
                "Erreur création review :",
                error
            );

            alert(error.message);

        } finally {

            setSending(false);

        }

    };


    // =========================
    // Loading
    // =========================

    if (loading) {

        return (

            <div className="reviews-page">

                <h1>
                    Mes avis
                </h1>

                <p>
                    Chargement...
                </p>

            </div>

        );

    }


    return (

        <div className="reviews-page">


            <h1>
                Mes avis
            </h1>


            <p>
                Partagez votre expérience et consultez vos anciens avis
            </p>


            {error && (

                <p className="error-message">
                    {error}
                </p>

            )}


            {/* =========================
          AJOUTER UN AVIS
      ========================== */}

            <div className="add-review">

                <h2>
                    Ajouter un avis
                </h2>


                <form onSubmit={handleSubmit}>


                    {/* Réservation */}

                    <label>
                        Sélectionner votre réservation
                    </label>


                    <select

                        name="reservation_id"

                        value={review.reservation_id}

                        onChange={handleChange}

                        required

                    >

                        <option value="">
                            -- Choisir une réservation --
                        </option>


                        {reservations.map(
                            (reservation) => (

                                <option
                                    key={reservation.id}
                                    value={reservation.id}
                                >

                                    Réservation #{reservation.id}
                                    {" - "}
                                    Chambre #{reservation.room_id}
                                    {" - "}
                                    {reservation.date_arriv}
                                    {" → "}
                                    {reservation.date_depart}

                                </option>

                            )
                        )}

                    </select>


                    {/* Note */}

                    <label>
                        Note
                    </label>


                    <div className="rating-stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                type="button"
                                key={star}
                                className={
                                    star <= review.rating
                                        ? "star active"
                                        : "star"
                                }
                                onClick={() =>
                                    setReview({
                                        ...review,
                                        rating: star
                                    })
                                }
                            >
                                ★
                            </button>
                        ))}
                    </div>

                    <p className="rating-value">
                        {review.rating === 0
                            ? "Choisissez une note"
                            : `Note : ${review.rating}/5`}
                    </p>


                    {/* Commentaire */}

                    <label>
                        Commentaire
                    </label>


                    <textarea

                        name="comment"

                        placeholder="Votre commentaire"

                        value={review.comment}

                        onChange={handleChange}

                        required

                    />


                    <button
                        className="save-btn"
                        type="submit"
                        disabled={sending}
                    >

                        {sending
                            ? "Envoi..."
                            : "Envoyer"}

                    </button>


                </form>

            </div>


            {/* =========================
          ANCIENS AVIS
      ========================== */}

            <div className="my-reviews">

                <h2>
                    Mes anciens avis
                </h2>


                {reviews.length === 0 ? (

                    <div className="dashboard-card">

                        <p>
                            Vous n'avez pas encore ajouté d'avis.
                        </p>

                    </div>

                ) : (

                    reviews.map((item) => (

                        <div
                            className="review-card"
                            key={item.id}
                        >

                            <h3>
                                Chambre #{item.room_id}
                            </h3>

                            <p>
                                Note : {item.rating}/5
                            </p>

                            <p>
                                {item.comment}
                            </p>

                            <small>
                                {item.created_at
                                    ? new Date(
                                        item.created_at
                                    ).toLocaleDateString("fr-FR")
                                    : ""}
                            </small>

                        </div>

                    ))

                )}

            </div>


        </div>

    );

}

export default Reviews;