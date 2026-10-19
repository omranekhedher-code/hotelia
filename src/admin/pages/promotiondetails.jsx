import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../../components/header";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

import "./promotiondetails.css";


function PromotionDetails() {

    const { id } = useParams();

    const navigate = useNavigate();


    // =====================================================
    // STATES
    // =====================================================

    const [promotion, setPromotion] = useState(null);

    const [originalPromotion, setOriginalPromotion] = useState(null);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [editMode, setEditMode] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // =====================================================
    // RÉCUPÉRER LA PROMOTION
    // =====================================================

    useEffect(() => {

        const fetchPromotion = async () => {

            try {

                setLoading(true);

                setError("");

                setSuccess("");


                const response = await fetch(
                    `http://localhost:8080/api/promotions/${id}`
                );


                const contentType =
                    response.headers.get("content-type");


                if (!contentType?.includes("application/json")) {

                    throw new Error(
                        "Le serveur ne retourne pas des données JSON."
                    );

                }


                const data =
                    await response.json();


                console.log(
                    "Promotion reçue :",
                    data
                );


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Promotion introuvable"
                    );

                }


                setPromotion(data);

                setOriginalPromotion(data);


            } catch (err) {

                console.error(
                    "Erreur récupération promotion :",
                    err
                );


                setError(
                    err.message
                );


            } finally {

                setLoading(false);

            }

        };


        fetchPromotion();

    }, [id]);


    // =====================================================
    // FORMAT DATE AFFICHAGE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }


        const parsedDate = new Date(date);


        if (isNaN(parsedDate.getTime())) {
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
    // FORMAT DATE INPUT
    // =====================================================

    const formatInputDate = (date) => {

        if (!date) {
            return "";
        }


        // Si PostgreSQL retourne déjà YYYY-MM-DD
        if (
            typeof date === "string" &&
            /^\d{4}-\d{2}-\d{2}$/.test(date)
        ) {

            return date;

        }


        const parsedDate =
            new Date(date);


        if (isNaN(parsedDate.getTime())) {
            return "";
        }


        const year =
            parsedDate.getFullYear();


        const month =
            String(
                parsedDate.getMonth() + 1
            ).padStart(2, "0");


        const day =
            String(
                parsedDate.getDate()
            ).padStart(2, "0");


        return `${year}-${month}-${day}`;

    };


    // =====================================================
    // STATUS CLASS
    // =====================================================

    const getStatusClass = (status) => {

        const value =
            String(status || "")
                .toLowerCase()
                .trim();


        if (value === "active") {

            return "active";

        }


        if (value === "inactive") {

            return "inactive";

        }


        return "default";

    };


    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (field, value) => {

        setPromotion((previous) => ({

            ...previous,

            [field]: value

        }));


        setError("");

        setSuccess("");

    };


    // =====================================================
    // ACTIVER MODE MODIFICATION
    // =====================================================

    const handleEdit = () => {

        setError("");

        setSuccess("");

        setEditMode(true);

    };


    // =====================================================
    // ANNULER MODIFICATION
    // =====================================================

    const handleCancel = () => {

        setPromotion(originalPromotion);

        setEditMode(false);

        setError("");

        setSuccess("");

    };


    // =====================================================
    // VALIDATION
    // =====================================================

    const validatePromotion = () => {

        if (!promotion.titre?.trim()) {

            return "Le titre de la promotion est obligatoire.";

        }


        if (
            promotion.reduction === "" ||
            promotion.reduction === null ||
            promotion.reduction === undefined
        ) {

            return "La réduction est obligatoire.";

        }


        const reduction =
            Number(promotion.reduction);


        if (
            isNaN(reduction) ||
            reduction < 0 ||
            reduction > 100
        ) {

            return (
                "La réduction doit être comprise entre 0 et 100%."
            );

        }


        if (!promotion.date_debut) {

            return "La date de début est obligatoire.";

        }


        if (!promotion.date_fin) {

            return "La date de fin est obligatoire.";

        }


        const startDate =
            new Date(promotion.date_debut);


        const endDate =
            new Date(promotion.date_fin);


        if (endDate < startDate) {

            return (
                "La date de fin doit être après la date de début."
            );

        }


        if (!promotion.status) {

            return "Le statut est obligatoire.";

        }


        return null;

    };


    // =====================================================
    // ENREGISTRER MODIFICATION
    // =====================================================

    const handleSave = async () => {

        try {

            setSaving(true);

            setError("");

            setSuccess("");


            // ---------------------------------------------
            // VALIDATION
            // ---------------------------------------------

            const validationError =
                validatePromotion();


            if (validationError) {

                setError(
                    validationError
                );

                setSaving(false);

                return;

            }


            // ---------------------------------------------
            // STATUS
            // ---------------------------------------------

            let status =
                String(
                    promotion.status || ""
                ).trim();


            if (
                status.toLowerCase() === "active"
            ) {

                status = "Active";

            } else if (
                status.toLowerCase() === "inactive"
            ) {

                status = "Inactive";

            }


            // ---------------------------------------------
            // DATA
            // ---------------------------------------------

            const updatedData = {

                titre:
                    promotion.titre.trim(),

                reduction:
                    Number(
                        promotion.reduction
                    ),

                room_id:
                    promotion.room_id
                        ? Number(
                            promotion.room_id
                        )
                        : null,

                date_debut:
                    formatInputDate(
                        promotion.date_debut
                    ),

                date_fin:
                    formatInputDate(
                        promotion.date_fin
                    ),

                status:
                    status

            };


            console.log(
                "Données envoyées :",
                updatedData
            );


            // ---------------------------------------------
            // PUT
            // ---------------------------------------------

            const response = await fetch(
                `http://localhost:8080/api/promotions/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            updatedData
                        )
                }
            );


            const contentType =
                response.headers.get(
                    "content-type"
                );


            if (
                !contentType?.includes(
                    "application/json"
                )
            ) {

                throw new Error(
                    "Le serveur ne retourne pas une réponse JSON."
                );

            }


            const data =
                await response.json();


            console.log(
                "Réponse modification :",
                data
            );


            // ---------------------------------------------
            // ERREUR BACKEND
            // ---------------------------------------------

            if (!response.ok) {

                throw new Error(
                    data.error ||
                    data.message ||
                    "Erreur lors de la modification de la promotion."
                );

            }


            // ---------------------------------------------
            // UPDATE LOCAL
            // ---------------------------------------------

            const updatedPromotion = {

                ...promotion,

                ...data,

                room_numero:
                    promotion.room_numero

            };


            setPromotion(
                updatedPromotion
            );


            setOriginalPromotion(
                updatedPromotion
            );


            setEditMode(false);


            setSuccess(
                "La promotion a été modifiée avec succès."
            );


        } catch (err) {

            console.error(
                "Erreur modification promotion :",
                err
            );


            setError(
                err.message ||
                "Erreur lors de la modification."
            );


        } finally {

            setSaving(false);

        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="promotion-details-page">

                <Header />

                <Navbar />


                <main className="promotion-details-main">

                    <div className="promotion-details-container">

                        <div className="promotion-loading">

                            <div className="promotion-loader"></div>


                            <h2>
                                Chargement...
                            </h2>


                            <p>
                                Récupération des informations
                                de la promotion
                            </p>

                        </div>

                    </div>

                </main>


                <Footer />

            </div>

        );

    }


    // =====================================================
    // ERROR SANS PROMOTION
    // =====================================================

    if (error && !promotion) {

        return (

            <div className="promotion-details-page">

                <Header />

                <Navbar />


                <main className="promotion-details-main">

                    <div className="promotion-details-container">

                        <div className="promotion-error-card">


                            <div className="promotion-error-icon">
                                !
                            </div>


                            <h2>
                                Promotion introuvable
                            </h2>


                            <p>
                                {error}
                            </p>


                            


                        </div>

                    </div>

                </main>


                <Footer />

            </div>

        );

    }


    if (!promotion) {

        return null;

    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="promotion-details-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <Header />

            <Navbar />


            {/* =================================================
                MAIN
            ================================================= */}

            <main className="promotion-details-main">

                <div className="promotion-details-container">


                    {/* =================================================
                        PAGE HEADER
                    ================================================= */}

                    <div className="promotion-page-header">


                        <div className="promotion-header-content">

                            <span className="promotion-header-label">
                                HOTELIA
                            </span>


                            <h1>
                                Détails de la promotion
                            </h1>


                            <p>
                                Consultez et modifiez les informations
                                relatives à cette offre.
                            </p>

                        </div>


                        <div className="promotion-header-id">

                            <span>
                                PROMOTION
                            </span>


                            <strong>
                                #{promotion.id}
                            </strong>

                        </div>


                    </div>



                    {/* =================================================
                        SUCCESS
                    ================================================= */}

                    {success && (

                        <div className="promotion-success-message">

                            <span>
                                ✓
                            </span>

                            {success}

                        </div>

                    )}



                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && promotion && (

                        <div className="promotion-inline-error">

                            <span>
                                !
                            </span>

                            {error}

                        </div>

                    )}



                    {/* =================================================
                        CARD
                    ================================================= */}

                    <div className="promotion-details-card">


                        {/* =================================================
                            CARD HEADER
                        ================================================= */}

                        <div className="promotion-card-header">


                            <div>

                                <span className="promotion-card-label">
                                    OFFRE SPÉCIALE
                                </span>


                                {editMode ? (

                                    <input
                                        type="text"
                                        className="promotion-title-input"
                                        value={
                                            promotion.titre || ""
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                "titre",
                                                e.target.value
                                            )
                                        }
                                    />

                                ) : (

                                    <h2>
                                        {promotion.titre || "-"}
                                    </h2>

                                )}

                            </div>


                            {/* STATUS */}

                            {editMode ? (

                                <select
                                    className="promotion-status-select"
                                    value={
                                        String(
                                            promotion.status || ""
                                        ).toLowerCase()
                                    }
                                    onChange={(e) =>
                                        handleChange(
                                            "status",
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="active">
                                        Active
                                    </option>

                                    <option value="inactive">
                                        Inactive
                                    </option>

                                </select>

                            ) : (

                                <span
                                    className={`promotion-status ${getStatusClass(
                                        promotion.status
                                    )}`}
                                >

                                    <span className="promotion-status-dot"></span>

                                    {promotion.status || "-"}

                                </span>

                            )}

                        </div>



                        {/* =================================================
                            SUMMARY
                        ================================================= */}

                        <div className="promotion-summary">


                            {/* REDUCTION */}

                            <div className="promotion-summary-item">

                                <span>
                                    Réduction
                                </span>


                                {editMode ? (

                                    <div className="promotion-summary-input-wrapper">

                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            className="promotion-number-input"
                                            value={
                                                promotion.reduction ?? ""
                                            }
                                            onChange={(e) =>
                                                handleChange(
                                                    "reduction",
                                                    e.target.value
                                                )
                                            }
                                        />

                                        <span>
                                            %
                                        </span>

                                    </div>

                                ) : (

                                    <strong className="promotion-summary-discount">

                                        {promotion.reduction || 0}%

                                    </strong>

                                )}

                            </div>



                            <div className="promotion-summary-divider"></div>



                            {/* CHAMBRE */}

                            <div className="promotion-summary-item">

                                <span>
                                    Chambre
                                </span>


                                <strong>

                                    {promotion.room_numero
                                        ? `Chambre ${promotion.room_numero}`
                                        : "Toutes les chambres"
                                    }

                                </strong>

                            </div>



                            <div className="promotion-summary-divider"></div>



                            {/* STATUS */}

                            <div className="promotion-summary-item">

                                <span>
                                    Statut
                                </span>


                                <strong>
                                    {promotion.status || "-"}
                                </strong>

                            </div>


                        </div>



                        {/* =================================================
                            INFORMATIONS
                        ================================================= */}

                        <div className="promotion-details-section">


                            <div className="promotion-section-heading">

                                <div className="promotion-section-line"></div>


                                <div>

                                    <h2>
                                        Informations de la promotion
                                    </h2>


                                    <p>
                                        Informations générales de l'offre
                                    </p>

                                </div>

                            </div>



                            <div className="promotion-details-grid">


                                {/* ID */}

                                <div className="promotion-detail-item">

                                    <span>
                                        ID Promotion
                                    </span>


                                    <strong>
                                        #{promotion.id}
                                    </strong>

                                </div>



                                {/* TITRE */}

                                <div className="promotion-detail-item">

                                    <span>
                                        Titre
                                    </span>


                                    {editMode ? (

                                        <input
                                            type="text"
                                            className="promotion-detail-input"
                                            value={
                                                promotion.titre || ""
                                            }
                                            onChange={(e) =>
                                                handleChange(
                                                    "titre",
                                                    e.target.value
                                                )
                                            }
                                        />

                                    ) : (

                                        <strong>
                                            {promotion.titre || "-"}
                                        </strong>

                                    )}

                                </div>



                                {/* REDUCTION */}

                                <div className="promotion-detail-item">

                                    <span>
                                        Réduction
                                    </span>


                                    {editMode ? (

                                        <div className="promotion-input-with-unit">

                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                className="promotion-detail-input"
                                                value={
                                                    promotion.reduction ?? ""
                                                }
                                                onChange={(e) =>
                                                    handleChange(
                                                        "reduction",
                                                        e.target.value
                                                    )
                                                }
                                            />

                                            <span>
                                                %
                                            </span>

                                        </div>

                                    ) : (

                                        <strong className="promotion-amount">

                                            {promotion.reduction || "-"} %

                                        </strong>

                                    )}

                                </div>



                                {/* STATUS */}

                                <div className="promotion-detail-item">

                                    <span>
                                        Statut
                                    </span>


                                    {editMode ? (

                                        <select
                                            className="promotion-detail-select"
                                            value={
                                                String(
                                                    promotion.status || ""
                                                ).toLowerCase()
                                            }
                                            onChange={(e) =>
                                                handleChange(
                                                    "status",
                                                    e.target.value
                                                )
                                            }
                                        >

                                            <option value="active">
                                                Active
                                            </option>

                                            <option value="inactive">
                                                Inactive
                                            </option>

                                        </select>

                                    ) : (

                                        <strong>

                                            <span
                                                className={`promotion-mini-status ${getStatusClass(
                                                    promotion.status
                                                )}`}
                                            >
                                                {promotion.status || "-"}
                                            </span>

                                        </strong>

                                    )}

                                </div>


                            </div>

                        </div>



                        {/* =================================================
                            CHAMBRE
                        ================================================= */}

                        <div className="promotion-details-section">


                            <div className="promotion-section-heading">

                                <div className="promotion-section-line"></div>


                                <div>

                                    <h2>
                                        Chambre concernée
                                    </h2>


                                    <p>
                                        Chambre bénéficiant de cette promotion
                                    </p>

                                </div>

                            </div>



                            <div className="promotion-details-grid">


                                <div className="promotion-detail-item">

                                    <span>
                                        ID Chambre
                                    </span>


                                    <strong>

                                        {promotion.room_id
                                            ? `#${promotion.room_id}`
                                            : "Toutes les chambres"
                                        }

                                    </strong>

                                </div>



                                <div className="promotion-detail-item">

                                    <span>
                                        Numéro de chambre
                                    </span>


                                    <strong>

                                        {promotion.room_numero
                                            ? `Chambre ${promotion.room_numero}`
                                            : "Toutes les chambres"
                                        }

                                    </strong>

                                </div>


                            </div>

                        </div>



                        {/* =================================================
                            PÉRIODE
                        ================================================= */}

                        <div className="promotion-details-section">


                            <div className="promotion-section-heading">

                                <div className="promotion-section-line"></div>


                                <div>

                                    <h2>
                                        Période de validité
                                    </h2>


                                    <p>
                                        Dates pendant lesquelles l'offre est disponible
                                    </p>

                                </div>

                            </div>



                            <div className="promotion-details-grid">


                                {/* DATE DEBUT */}

                                <div className="promotion-detail-item">

                                    <span>
                                        Date de début
                                    </span>


                                    {editMode ? (

                                        <input
                                            type="date"
                                            className="promotion-detail-input"
                                            value={
                                                formatInputDate(
                                                    promotion.date_debut
                                                )
                                            }
                                            onChange={(e) =>
                                                handleChange(
                                                    "date_debut",
                                                    e.target.value
                                                )
                                            }
                                        />

                                    ) : (

                                        <strong>
                                            {formatDate(
                                                promotion.date_debut
                                            )}
                                        </strong>

                                    )}

                                </div>



                                {/* DATE FIN */}

                                <div className="promotion-detail-item">

                                    <span>
                                        Date de fin
                                    </span>


                                    {editMode ? (

                                        <input
                                            type="date"
                                            className="promotion-detail-input"
                                            value={
                                                formatInputDate(
                                                    promotion.date_fin
                                                )
                                            }
                                            onChange={(e) =>
                                                handleChange(
                                                    "date_fin",
                                                    e.target.value
                                                )
                                            }
                                        />

                                    ) : (

                                        <strong>
                                            {formatDate(
                                                promotion.date_fin
                                            )}
                                        </strong>

                                    )}

                                </div>



                                {/* CREATED */}

                                <div className="promotion-detail-item">

                                    <span>
                                        Créée le
                                    </span>


                                    <strong>
                                        {formatDate(
                                            promotion.created_at
                                        )}
                                    </strong>

                                </div>


                            </div>

                        </div>



                        {/* =================================================
                            FOOTER
                        ================================================= */}

                        <div className="promotion-details-footer">


                            {editMode ? (

                                <>

                                    <button
                                        className="promotion-cancel-btn"
                                        onClick={handleCancel}
                                        disabled={saving}
                                    >
                                        Annuler
                                    </button>


                                    <button
                                        className="promotion-save-btn"
                                        onClick={handleSave}
                                        disabled={saving}
                                    >

                                        {saving ? (

                                            <>
                                                <span className="promotion-small-loader"></span>
                                                Enregistrement...
                                            </>

                                        ) : (

                                            <>
                                                ✓ Enregistrer les modifications
                                            </>

                                        )}

                                    </button>

                                </>

                            ) : (

                                <>

                                    


                                    <button
                                        className="promotion-edit-btn"
                                        onClick={handleEdit}
                                    >
                                        ✎ Modifier la promotion
                                    </button>

                                </>

                            )}

                        </div>


                    </div>

                </div>

            </main>


            {/* =================================================
                FOOTER
            ================================================= */}

            <Footer />

        </div>

    );

}


export default PromotionDetails;