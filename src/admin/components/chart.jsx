
import React, { useEffect, useState } from "react";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

import "../Admin.css";


function Chart() {

    const [data, setData] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ==========================================
    // RÉCUPÉRER LES RÉSERVATIONS
    // ==========================================

    useEffect(() => {

        const fetchReservations = async () => {

            try {

                const response = await fetch(
                    "http://localhost:5000/api/reservations"
                );


                const reservations =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        reservations.message ||
                        "Erreur récupération réservations"
                    );

                }


                console.log(
                    "Réservations reçues :",
                    reservations
                );


                // ==========================================
                // MOIS
                // ==========================================

                const months = [
                    "Jan",
                    "Fev",
                    "Mar",
                    "Avr",
                    "Mai",
                    "Juin",
                    "Juil",
                    "Août",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Déc"
                ];


                // ==========================================
                // INITIALISER LES 12 MOIS
                // ==========================================

                const monthlyReservations =
                    months.map((month, index) => ({

                        name: month,

                        reservations: 0,

                        monthNumber: index

                    }));


                // ==========================================
                // COMPTER LES RÉSERVATIONS
                // ==========================================

                reservations.forEach((reservation) => {

                    if (!reservation.date_depart) {
                        return;
                    }


                    const date =
                        new Date(
                            reservation.date_depart
                        );


                    const month =
                        date.getMonth();


                    monthlyReservations[month].reservations++;

                });


                // ==========================================
                // ENLEVER monthNumber
                // ==========================================

                const finalData =
                    monthlyReservations.map(
                        ({ name, reservations }) => ({

                            name,

                            reservations

                        })
                    );


                setData(finalData);


            } catch (err) {

                console.error(
                    "Erreur Chart :",
                    err
                );

                setError(
                    err.message
                );


            } finally {

                setLoading(false);

            }

        };


        fetchReservations();

    }, []);


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="chart-container">

                <p>
                    Chargement du graphique...
                </p>

            </div>

        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (

            <div className="chart-container">

                <p>
                    Erreur : {error}
                </p>

            </div>

        );

    }


    // ==========================================
    // CHART
    // ==========================================

    return (

        <div className="chart-container">

            <ResponsiveContainer
                width="100%"
                height={300}
            >

                <LineChart data={data}>

                    <CartesianGrid
                        strokeDasharray="3 3"
                    />


                    <XAxis
                        dataKey="name"
                    />


                    <YAxis
                        allowDecimals={false}
                    />


                    <Tooltip />


                    <Line
                        type="monotone"
                        dataKey="reservations"
                        stroke="#C89B4A"
                        strokeWidth={3}
                        dot={{ r: 5 }}
                        activeDot={{ r: 7 }}
                    />

                </LineChart>

            </ResponsiveContainer>

        </div>

    );

}


export default Chart;
