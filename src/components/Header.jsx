import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./header.css";

function Header() {

    const navigate = useNavigate();

    const [scrolled, setScrolled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);


    // ==========================================
    // SCROLL
    // ==========================================

    useEffect(() => {

        const onScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        onScroll();

        window.addEventListener("scroll", onScroll);

        return () => {
            window.removeEventListener("scroll", onScroll);
        };

    }, []);


    // ==========================================
    // VÉRIFIER CONNEXION
    // ==========================================

    useEffect(() => {

        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (token) {

            setIsLoggedIn(true);

            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }

        } else {

            setIsLoggedIn(false);
            setUser(null);

        }

    }, []);


    // ==========================================
    // DÉCONNEXION
    // ==========================================

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setIsLoggedIn(false);
        setUser(null);

        navigate("/");

    };


    return (

        <header
            className={`header ${
                scrolled ? "scrolled" : ""
            }`}
        >

            {/* ==================================
                LOGO
            ================================== */}

            <Link
                to="/"
                className="logo"
                onClick={() => {
                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });
                }}
            >
                Hotelia
            </Link>


            {/* ==================================
                SLOGAN
            ================================== */}

            <div className="slogan">
                Un séjour raffiné, réservé en toute simplicité
            </div>


            {/* ==================================
                AUTH BUTTONS
            ================================== */}

            <div className="auth-buttons">

                {!isLoggedIn ? (

                    <>

                        <Link to="/login">

                            <button className="login-btn">
                                Connexion
                            </button>

                        </Link>


                        <Link to="/signup">

                            <button className="signup-btn">
                                S’inscrire
                            </button>

                        </Link>

                    </>

                ) : (

                    <>

                        <span className="welcome-user">

                            Bonjour{" "}
                            {user?.prenom ||
                                user?.nom ||
                                "Client"}

                        </span>


                        <button
                            className="login-btn"
                            onClick={() => {

                                const storedUser =
                                    localStorage.getItem("user");

                                const currentUser =
                                    storedUser
                                        ? JSON.parse(storedUser)
                                        : null;


                                if (!currentUser) {

                                    navigate("/login");

                                    return;

                                }


                                if (
                                    currentUser.role ===
                                    "admin"
                                ) {

                                    navigate("/admin");

                                } else {

                                    navigate("/user");

                                }

                            }}
                        >
                            Mon espace
                        </button>


                        <button
                            className="signup-btn"
                            onClick={handleLogout}
                        >
                            Déconnexion
                        </button>

                    </>

                )}

            </div>

        </header>

    );

}

export default Header;