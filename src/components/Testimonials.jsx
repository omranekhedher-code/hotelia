import "./Testimonials.css";
import { useEffect, useState } from "react";

function Testimonials() {

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);


    // =====================================================
    // RÉCUPÉRER LES AVIS
    // =====================================================

    useEffect(() => {

        const fetchReviews = async () => {

            try {

                const response = await fetch(
                    "http://localhost:5000/api/reviews"
                );

                if (!response.ok) {
                    throw new Error(
                        "Erreur récupération des avis"
                    );
                }

                const data = await response.json();

                console.log(
                    "Testimonials reviews :",
                    data
                );

                setReviews(data);

            } catch (error) {

                console.error(
                    "Erreur reviews :",
                    error
                );

            } finally {

                setLoading(false);

            }

        };


        fetchReviews();

    }, []);


    // =====================================================
    // ÉTOILES DYNAMIQUES
    // =====================================================

    const renderStars = (rating) => {

        const value = Number(rating) || 0;

        return (

            <div className="rating">

                {[1, 2, 3, 4, 5].map((star) => (

                    <span
                        key={star}
                        className={
                            star <= value
                                ? "star active"
                                : "star"
                        }
                    >
                        ★
                    </span>

                ))}

            </div>

        );

    };


    // =====================================================
    // INITIALLES USER
    // =====================================================

    const getInitials = (review) => {

        const prenom =
            review.prenom?.charAt(0) || "";

        const nom =
            review.nom?.charAt(0) || "";

        return (
            prenom + nom
        ).toUpperCase();

    };


    return (

        <section className="testimonials">


            {/* =====================================================
                TITLE
            ===================================================== */}

            <div className="testimonials-title">

                <h2>
                    Témoignages de nos clients
                </h2>

                <p>
                    Des moments de confort, de beauté
                    et de souvenirs durables
                </p>

            </div>


            {/* =====================================================
                LOADING
            ===================================================== */}

            {loading && (

                <div className="reviews-loading">

                    Chargement des témoignages...

                </div>

            )}


            {/* =====================================================
                REVIEWS
            ===================================================== */}

            {!loading && reviews.length > 0 && (

                <div className="reviews">

                    {reviews.slice(0, 3).map((review) => (

                        <div
                            className="review-card"
                            key={review.id}
                        >

                            {/* AVATAR */}

                            <div className="review-avatar">

                                {getInitials(review)}

                            </div>


                            {/* USER NAME */}

                            <h3>

                                {review.prenom || ""}
                                {" "}
                                {review.nom || ""}

                            </h3>


                            {/* RATING */}

                            {renderStars(
                                review.rating
                            )}


                            {/* COMMENT */}

                            <p>

                                {review.comment ||
                                    "Aucun commentaire."}

                            </p>


                        </div>

                    ))}

                </div>

            )}


            {/* =====================================================
                NO REVIEWS
            ===================================================== */}

            {!loading && reviews.length === 0 && (

                <div className="reviews-empty">

                    <p>
                        Aucun témoignage pour le moment.
                    </p>

                </div>

            )}

        </section>

    );

}

export default Testimonials;