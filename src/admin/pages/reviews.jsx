import React, { useEffect, useMemo, useState } from "react";

import "./reviews.css";

function Reviews() {

    // =====================================================
    // STATES
    // =====================================================

    const [reviews, setReviews] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [ratingFilter, setRatingFilter] = useState("all");

    const [selectedReview, setSelectedReview] = useState(null);

    const [deletingId, setDeletingId] = useState(null);


    // =====================================================
    // RÉCUPÉRER LES AVIS
    // =====================================================

    useEffect(() => {

        const fetchReviews = async () => {

            try {

                setLoading(true);

                setError("");

                const response = await fetch(
                    "http://localhost:5000/api/reviews"
                );

                const contentType =
                    response.headers.get("content-type");

                if (!contentType?.includes("application/json")) {

                    throw new Error(
                        "Le serveur ne retourne pas des données JSON."
                    );

                }

                const data = await response.json();

                console.log(
                    "Avis reçus :",
                    data
                );

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Erreur lors de la récupération des avis."
                    );

                }

                if (!Array.isArray(data)) {

                    throw new Error(
                        "Format des données invalide."
                    );

                }

                setReviews(data);

            } catch (err) {

                console.error(
                    "Erreur récupération avis :",
                    err
                );

                setError(
                    err.message
                );

            } finally {

                setLoading(false);

            }

        };

        fetchReviews();

    }, []);


    // =====================================================
    // SUPPRIMER UN AVIS
    // =====================================================

    const deleteReview = async (id) => {

        const confirmed = window.confirm(
            "Êtes-vous sûr de vouloir supprimer cet avis ?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setDeletingId(id);

            const response = await fetch(
                `http://localhost:5000/api/reviews/${id}`,
                {
                    method: "DELETE"
                }
            );

            const contentType =
                response.headers.get("content-type");

            if (!contentType?.includes("application/json")) {

                throw new Error(
                    "Le serveur ne retourne pas des données JSON."
                );

            }

            const data = await response.json();

            console.log(
                "Avis supprimé :",
                data
            );

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Erreur lors de la suppression de l'avis."
                );

            }

            // Retirer l'avis de la liste
            setReviews((prevReviews) =>
                prevReviews.filter(
                    (review) => review.id !== id
                )
            );

            // Fermer le modal si l'avis supprimé est ouvert
            if (
                selectedReview &&
                selectedReview.id === id
            ) {

                setSelectedReview(null);

            }

        } catch (err) {

            console.error(
                "Erreur suppression avis :",
                err
            );

            alert(
                err.message ||
                "Erreur lors de la suppression de l'avis."
            );

        } finally {

            setDeletingId(null);

        }

    };


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {

            return "-";

        }

        const parsedDate =
            new Date(date);

        if (
            isNaN(
                parsedDate.getTime()
            )
        ) {

            return "-";

        }

        return parsedDate.toLocaleDateString(
            "fr-FR",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );

    };


    // =====================================================
    // ÉTOILES
    // =====================================================

    const renderStars = (rating) => {

        const value =
            Number(rating) || 0;

        return (

            <div className="reviews-stars">

                {[1, 2, 3, 4, 5].map(
                    (star) => (

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

                    )
                )}

            </div>

        );

    };


    // =====================================================
    // RECHERCHE + FILTRE
    // =====================================================

    const filteredReviews = useMemo(() => {

        return reviews.filter(
            (review) => {

                const searchValue =
                    search
                        .toLowerCase()
                        .trim();

                const matchesSearch =
                    !searchValue ||

                    String(
                        review.id || ""
                    )
                        .toLowerCase()
                        .includes(searchValue) ||

                    String(
                        review.user_id || ""
                    )
                        .toLowerCase()
                        .includes(searchValue) ||

                    String(
                        review.room_id || ""
                    )
                        .toLowerCase()
                        .includes(searchValue) ||

                    String(
                        review.comment || ""
                    )
                        .toLowerCase()
                        .includes(searchValue);


                const matchesRating =
                    ratingFilter === "all" ||
                    String(
                        review.rating
                    ) === ratingFilter;


                return (
                    matchesSearch &&
                    matchesRating
                );

            }
        );

    }, [
        reviews,
        search,
        ratingFilter
    ]);


    // =====================================================
    // STATISTIQUES
    // =====================================================

    const statistics = useMemo(() => {

        const total =
            reviews.length;


        if (total === 0) {

            return {
                total: 0,
                average: "0.0",
                fiveStars: 0,
                fourStars: 0
            };

        }


        const totalRating =
            reviews.reduce(
                (sum, review) =>
                    sum +
                    Number(
                        review.rating || 0
                    ),
                0
            );


        const average =
            totalRating / total;


        const fiveStars =
            reviews.filter(
                (review) =>
                    Number(
                        review.rating
                    ) === 5
            ).length;


        const fourStars =
            reviews.filter(
                (review) =>
                    Number(
                        review.rating
                    ) === 4
            ).length;


        return {

            total,

            average:
                average.toFixed(1),

            fiveStars,

            fourStars

        };

    }, [reviews]);


    // =====================================================
    // EMPTY
    // =====================================================

    const isEmpty =
        !loading &&
        !error &&
        filteredReviews.length === 0;


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="reviews-page">

                <main className="reviews-main">

                    <div className="reviews-container">

                        <div className="reviews-loading">

                            <div className="reviews-loader"></div>

                            <h2>
                                Chargement des avis...
                            </h2>

                            <p>
                                Récupération des avis clients
                            </p>

                        </div>

                    </div>

                </main>

            </div>

        );

    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="reviews-page">


            {/* =================================================
                MAIN
            ================================================= */}

            <main className="reviews-main">

                <div className="reviews-container">


                    {/* =================================================
                        PAGE HEADER
                    ================================================= */}

                    <div className="reviews-page-header">

                        <div>

                            <span className="reviews-header-label">
                                HOTELIA
                            </span>

                            <h1>
                                Avis clients
                            </h1>

                            <p>
                                Consultez les avis et évaluations
                                laissés par les clients.
                            </p>

                        </div>


                        <div className="reviews-header-badge">

                            <span>
                                TOTAL AVIS
                            </span>

                            <strong>
                                {statistics.total}
                            </strong>

                        </div>

                    </div>


                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && (

                        <div className="reviews-error">

                            <div className="reviews-error-icon">
                                !
                            </div>

                            <div>

                                <strong>
                                    Impossible de récupérer les avis
                                </strong>

                                <p>
                                    {error}
                                </p>

                            </div>

                        </div>

                    )}


                    {!error && (

                        <>


                            {/* =================================================
                                STATISTICS
                            ================================================= */}

                            <div className="reviews-statistics">


                                <div className="reviews-stat-card">

                                    <div className="reviews-stat-icon">
                                        ★
                                    </div>

                                    <div>

                                        <span>
                                            Total des avis
                                        </span>

                                        <strong>
                                            {statistics.total}
                                        </strong>

                                    </div>

                                </div>


                                <div className="reviews-stat-card">

                                    <div className="reviews-stat-icon">
                                        ⭐
                                    </div>

                                    <div>

                                        <span>
                                            Note moyenne
                                        </span>

                                        <strong>
                                            {statistics.average} / 5
                                        </strong>

                                    </div>

                                </div>


                                <div className="reviews-stat-card">

                                    <div className="reviews-stat-icon">
                                        5★
                                    </div>

                                    <div>

                                        <span>
                                            Avis 5 étoiles
                                        </span>

                                        <strong>
                                            {statistics.fiveStars}
                                        </strong>

                                    </div>

                                </div>


                                <div className="reviews-stat-card">

                                    <div className="reviews-stat-icon">
                                        4★
                                    </div>

                                    <div>

                                        <span>
                                            Avis 4 étoiles
                                        </span>

                                        <strong>
                                            {statistics.fourStars}
                                        </strong>

                                    </div>

                                </div>


                            </div>


                            {/* =================================================
                                FILTERS
                            ================================================= */}

                            <div className="reviews-toolbar">


                                <div className="reviews-search">

                                    <span className="reviews-search-icon">
                                        ⌕
                                    </span>

                                    <input
                                        type="text"
                                        placeholder="Rechercher un avis..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(
                                                e.target.value
                                            )
                                        }
                                    />


                                    {search && (

                                        <button
                                            className="reviews-clear-search"
                                            onClick={() =>
                                                setSearch("")
                                            }
                                        >
                                            ×
                                        </button>

                                    )}

                                </div>


                                <div className="reviews-filter">

                                    <label>
                                        Note
                                    </label>

                                    <select
                                        value={ratingFilter}
                                        onChange={(e) =>
                                            setRatingFilter(
                                                e.target.value
                                            )
                                        }
                                    >

                                        <option value="all">
                                            Toutes les notes
                                        </option>

                                        <option value="5">
                                            5 étoiles
                                        </option>

                                        <option value="4">
                                            4 étoiles
                                        </option>

                                        <option value="3">
                                            3 étoiles
                                        </option>

                                        <option value="2">
                                            2 étoiles
                                        </option>

                                        <option value="1">
                                            1 étoile
                                        </option>

                                    </select>

                                </div>


                            </div>


                            {/* =================================================
                                TABLE
                            ================================================= */}

                            <div className="reviews-card">


                                <div className="reviews-card-header">

                                    <div>

                                        <span>
                                            LISTE DES AVIS
                                        </span>

                                        <h2>
                                            Avis récents
                                        </h2>

                                    </div>

                                    <span className="reviews-count">
                                        {filteredReviews.length} résultat(s)
                                    </span>

                                </div>


                                {isEmpty ? (

                                    <div className="reviews-empty">

                                        <div className="reviews-empty-icon">
                                            ☆
                                        </div>

                                        <h3>
                                            Aucun avis trouvé
                                        </h3>

                                        <p>
                                            Aucun avis ne correspond
                                            à votre recherche.
                                        </p>

                                    </div>

                                ) : (

                                    <div className="reviews-table-wrapper">

                                        <table className="reviews-table">

                                            <thead>

                                                <tr>

                                                    <th>
                                                        ID
                                                    </th>

                                                    <th>
                                                        Client
                                                    </th>

                                                    <th>
                                                        Chambre
                                                    </th>

                                                    <th>
                                                        Note
                                                    </th>

                                                    <th>
                                                        Commentaire
                                                    </th>

                                                    <th>
                                                        Date
                                                    </th>

                                                    <th>
                                                        Action
                                                    </th>

                                                </tr>

                                            </thead>


                                            <tbody>

                                                {filteredReviews.map(
                                                    (review) => (

                                                        <tr
                                                            key={
                                                                review.id
                                                            }
                                                        >


                                                            {/* ID */}

                                                            <td>

                                                                <span className="reviews-id">
                                                                    #{review.id}
                                                                </span>

                                                            </td>


                                                            {/* CLIENT */}

                                                            <td>

                                                                <div className="reviews-client">

                                                                    <div className="reviews-avatar">

                                                                        {String(
                                                                            review.user_id ||
                                                                            "?"
                                                                        )
                                                                            .charAt(
                                                                                0
                                                                            )
                                                                            .toUpperCase()}

                                                                    </div>


                                                                    <div>

                                                                        <strong>
                                                                            Client #
                                                                            {
                                                                                review.user_id
                                                                            }
                                                                        </strong>

                                                                        <span>
                                                                            ID utilisateur
                                                                        </span>

                                                                    </div>

                                                                </div>

                                                            </td>


                                                            {/* CHAMBRE */}

                                                            <td>

                                                                <span className="reviews-room">

                                                                    {review.room_id
                                                                        ? `Chambre #${review.room_id}`
                                                                        : "-"
                                                                    }

                                                                </span>

                                                            </td>


                                                            {/* RATING */}

                                                            <td>

                                                                <div className="reviews-rating-cell">

                                                                    {renderStars(
                                                                        review.rating
                                                                    )}

                                                                    <span>
                                                                        {
                                                                            review.rating
                                                                        }
                                                                        /5
                                                                    </span>

                                                                </div>

                                                            </td>


                                                            {/* COMMENT */}

                                                            <td>

                                                                <div className="reviews-comment">

                                                                    {review.comment
                                                                        ? review.comment
                                                                        : "Aucun commentaire"
                                                                    }

                                                                </div>

                                                            </td>


                                                            {/* DATE */}

                                                            <td>

                                                                <span className="reviews-date">

                                                                    {formatDate(
                                                                        review.created_at
                                                                    )}

                                                                </span>

                                                            </td>


                                                            {/* ACTION */}

                                                            <td>

                                                                <div className="reviews-actions">

                                                                    <button
                                                                        className="reviews-view-btn"
                                                                        onClick={() =>
                                                                            setSelectedReview(
                                                                                review
                                                                            )
                                                                        }
                                                                    >
                                                                        Voir
                                                                    </button>


                                                                    <button
                                                                        className="reviews-delete-btn"
                                                                        onClick={() =>
                                                                            deleteReview(
                                                                                review.id
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            deletingId ===
                                                                            review.id
                                                                        }
                                                                    >

                                                                        {deletingId ===
                                                                        review.id
                                                                            ? "Suppression..."
                                                                            : "Supprimer"
                                                                        }

                                                                    </button>

                                                                </div>

                                                            </td>


                                                        </tr>

                                                    )
                                                )}

                                            </tbody>

                                        </table>

                                    </div>

                                )}

                            </div>


                        </>

                    )}


                </div>

            </main>


            {/* =================================================
                MODAL DÉTAILS
            ================================================= */}

            {selectedReview && (

                <div
                    className="reviews-modal-overlay"
                    onClick={() =>
                        setSelectedReview(null)
                    }
                >

                    <div
                        className="reviews-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >


                        <div className="reviews-modal-header">

                            <div>

                                <span>
                                    AVIS CLIENT
                                </span>

                                <h2>
                                    Détails de l'avis
                                </h2>

                            </div>


                            <button
                                className="reviews-modal-close"
                                onClick={() =>
                                    setSelectedReview(null)
                                }
                            >
                                ×
                            </button>

                        </div>


                        <div className="reviews-modal-body">


                            {/* ID */}

                            <div className="reviews-modal-item">

                                <span>
                                    ID Avis
                                </span>

                                <strong>
                                    #{selectedReview.id}
                                </strong>

                            </div>


                            {/* USER */}

                            <div className="reviews-modal-item">

                                <span>
                                    Client
                                </span>

                                <strong>
                                    Client #{selectedReview.user_id}
                                </strong>

                            </div>


                            {/* ROOM */}

                            <div className="reviews-modal-item">

                                <span>
                                    Chambre
                                </span>

                                <strong>

                                    {selectedReview.room_id
                                        ? `Chambre #${selectedReview.room_id}`
                                        : "-"
                                    }

                                </strong>

                            </div>


                            {/* RATING */}

                            <div className="reviews-modal-item">

                                <span>
                                    Note
                                </span>

                                <div className="reviews-modal-rating">

                                    {renderStars(
                                        selectedReview.rating
                                    )}

                                    <strong>
                                        {selectedReview.rating}/5
                                    </strong>

                                </div>

                            </div>


                            {/* COMMENT */}

                            <div className="reviews-modal-comment">

                                <span>
                                    Commentaire
                                </span>

                                <p>

                                    {selectedReview.comment
                                        ? selectedReview.comment
                                        : "Aucun commentaire"
                                    }

                                </p>

                            </div>


                            {/* DATE */}

                            <div className="reviews-modal-item">

                                <span>
                                    Date
                                </span>

                                <strong>
                                    {formatDate(
                                        selectedReview.created_at
                                    )}
                                </strong>

                            </div>


                        </div>


                        <div className="reviews-modal-footer">

                            <button
                                className="reviews-modal-delete-btn"
                                onClick={() =>
                                    deleteReview(
                                        selectedReview.id
                                    )
                                }
                                disabled={
                                    deletingId ===
                                    selectedReview.id
                                }
                            >

                                {deletingId === selectedReview.id
                                    ? "Suppression..."
                                    : "Supprimer l'avis"
                                }

                            </button>


                            <button
                                className="reviews-modal-close-btn"
                                onClick={() =>
                                    setSelectedReview(null)
                                }
                            >
                                Fermer
                            </button>

                        </div>


                    </div>

                </div>

            )}


        </div>

    );

}

export default Reviews;