import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import SearchBar from "../components/searchbar";
import ConfirmModal from "../components/confirmmodal";
import PromotionForm from "./promotionform";

function Promotions() {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedPromotion, setSelectedPromotion] = useState(null);

    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =====================================================
    // RÉCUPÉRER LES PROMOTIONS
    // =====================================================

    const fetchPromotions = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:5000/api/promotions"
            );

            const contentType =
                response.headers.get("content-type");

            if (!contentType?.includes("application/json")) {
                throw new Error(
                    "Le serveur ne retourne pas des données JSON."
                );
            }

            const data = await response.json();

            console.log("Promotions reçues :", data);

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Erreur récupération promotions"
                );
            }

            setPromotions(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (err) {
            console.error(
                "Erreur promotions :",
                err
            );

            setError(err.message);

        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // USE EFFECT
    // =====================================================

    useEffect(() => {
        fetchPromotions();
    }, []);

    // =====================================================
    // RECHERCHE
    // =====================================================

    const filteredPromotions = promotions.filter((promo) => {
        const title = String(
            promo.titre || ""
        ).toLowerCase();

        const room = String(
            promo.room_numero || ""
        ).toLowerCase();

        const searchValue =
            search.toLowerCase();

        return (
            title.includes(searchValue) ||
            room.includes(searchValue)
        );
    });

    // =====================================================
    // SUPPRIMER
    // =====================================================

    const handleDelete = (promotion) => {
        setSelectedPromotion(promotion);
        setDeleteModal(true);
    };

    // =====================================================
    // CONFIRMER SUPPRESSION
    // =====================================================

    const confirmDelete = async () => {
        if (!selectedPromotion) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/promotions/${selectedPromotion.id}`,
                {
                    method: "DELETE"
                }
            );

            const contentType =
                response.headers.get("content-type");

            if (!contentType?.includes("application/json")) {
                throw new Error(
                    "Réponse serveur invalide."
                );
            }

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Erreur suppression promotion"
                );
            }

            setPromotions((prev) =>
                prev.filter(
                    (promo) =>
                        promo.id !==
                        selectedPromotion.id
                )
            );

            setDeleteModal(false);
            setSelectedPromotion(null);

        } catch (err) {
            console.error(
                "Erreur suppression :",
                err
            );

            alert(err.message);
        }
    };

    // =====================================================
    // APRÈS AJOUT
    // =====================================================

    const handlePromotionAdded = () => {
        setShowForm(false);
        fetchPromotions();
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="promotions-page">

                <h1>
                    Gestion des promotions
                </h1>

                <p className="page-description">
                    Chargement des promotions...
                </p>

            </div>
        );
    }

    // =====================================================
    // PAGE
    // =====================================================

    return (
        <div className="promotions-page">

            {/* HEADER */}

            <h1>
                Gestion des promotions
            </h1>

            <p className="page-description">
                Créer et gérer les offres spéciales
                de l'hôtel
            </p>

            {/* ERROR */}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {/* ADD BUTTON */}

            <button
                className="btn-primary"
                onClick={() =>
                    setShowForm(!showForm)
                }
            >
                {showForm
                    ? "Fermer"
                    : "+ Ajouter une promotion"
                }
            </button>

            {/* FORM */}

            {showForm && (
                <PromotionForm
                    onPromotionAdded={
                        handlePromotionAdded
                    }
                />
            )}

            {/* SEARCH */}

            <SearchBar
                search={search}
                setSearch={setSearch}
            />

            {/* TABLE */}

            <table>

                <thead>

                    <tr>

                        <th>
                            Titre
                        </th>

                        <th>
                            Réduction
                        </th>

                        <th>
                            Chambre
                        </th>

                        <th>
                            Date début
                        </th>

                        <th>
                            Date fin
                        </th>

                        <th>
                            Status
                        </th>

                        <th>
                            Actions
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {filteredPromotions.length === 0 ? (

                        <tr>

                            <td
                                colSpan="7"
                                style={{
                                    textAlign: "center",
                                    padding: "30px"
                                }}
                            >
                                Aucune promotion trouvée.
                            </td>

                        </tr>

                    ) : (

                        filteredPromotions.map(
                            (promo) => (

                                <tr
                                    key={promo.id}
                                >

                                    {/* TITRE */}

                                    <td>
                                        <strong>
                                            {promo.titre}
                                        </strong>
                                    </td>

                                    {/* RÉDUCTION */}

                                    <td>
                                        <strong>
                                            {promo.reduction}%
                                        </strong>
                                    </td>

                                    {/* CHAMBRE */}

                                    <td>
                                        {promo.room_numero
                                            ? `Chambre ${promo.room_numero}`
                                            : "Toutes les chambres"
                                        }
                                    </td>

                                    {/* DATE DÉBUT */}

                                    <td>
                                        {promo.date_debut
                                            ? new Date(
                                                promo.date_debut
                                            ).toLocaleDateString(
                                                "fr-FR"
                                            )
                                            : "-"
                                        }
                                    </td>

                                    {/* DATE FIN */}

                                    <td>
                                        {promo.date_fin
                                            ? new Date(
                                                promo.date_fin
                                            ).toLocaleDateString(
                                                "fr-FR"
                                            )
                                            : "-"
                                        }
                                    </td>

                                    {/* STATUS */}

                                    <td>

                                        <span
                                            className={`status ${String(
                                                promo.status || ""
                                            ).toLowerCase().replaceAll(
                                                " ",
                                                "-"
                                            )}`}
                                        >
                                            {promo.status}
                                        </span>

                                    </td>

                                    {/* ACTIONS */}

                                    <td>

                                        {/* MODIFIER */}

                                        <button
                                            className="btn-edit"
                                            onClick={() =>
                                                navigate(
                                                    `/admin/promotions/${promo.id}/edit`
                                                )
                                            }
                                        >
                                            Modifier
                                        </button>

                                        {/* SUPPRIMER */}

                                        <button
                                            className="btn-delete"
                                            onClick={() =>
                                                handleDelete(
                                                    promo
                                                )
                                            }
                                        >
                                            Supprimer
                                        </button>

                                    </td>

                                </tr>
                            )
                        )
                    )}

                </tbody>

            </table>

            {/* DELETE MODAL */}

            <ConfirmModal
                isOpen={deleteModal}

                message={
                    selectedPromotion
                        ? `Voulez-vous supprimer la promotion "${selectedPromotion.titre}" ?`
                        : "Voulez-vous supprimer cette promotion ?"
                }

                onCancel={() => {
                    setDeleteModal(false);
                    setSelectedPromotion(null);
                }}

                onConfirm={confirmDelete}
            />

        </div>
    );
}

export default Promotions;