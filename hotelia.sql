--
-- PostgreSQL database dump
--

\restrict DGbM5xpBEkIefbcNVqrRlHQWLLED6qEBbkGGbgBeseVDgSaWPLGVVBp1kaRPrQU

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-10-19 22:05:12

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 223 (class 1259 OID 16434)
-- Name: options; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.options (
    id integer NOT NULL,
    nom character varying(200)
);


ALTER TABLE public.options OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16464)
-- Name: options_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.options ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.options_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 225 (class 1259 OID 16447)
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id integer NOT NULL,
    reservation_id integer NOT NULL,
    montant real NOT NULL,
    mode_paiement character varying(50) NOT NULL,
    status character varying(100) NOT NULL,
    date_paiement date NOT NULL,
    transaction_id character varying(255) NOT NULL
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16465)
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.payments ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.payments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 233 (class 1259 OID 24681)
-- Name: promotions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotions (
    id integer NOT NULL,
    titre character varying(150) NOT NULL,
    reduction numeric(5,2) NOT NULL,
    room_id integer,
    date_debut date NOT NULL,
    date_fin date NOT NULL,
    status character varying(30) DEFAULT 'Active'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT promotion_dates_check CHECK ((date_fin >= date_debut)),
    CONSTRAINT promotion_status_check CHECK (((status)::text = ANY ((ARRAY['Active'::character varying, 'Inactive'::character varying])::text[]))),
    CONSTRAINT promotions_reduction_check CHECK (((reduction > (0)::numeric) AND (reduction <= (100)::numeric)))
);


ALTER TABLE public.promotions OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 24680)
-- Name: promotions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.promotions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.promotions_id_seq OWNER TO postgres;

--
-- TOC entry 5089 (class 0 OID 0)
-- Dependencies: 232
-- Name: promotions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.promotions_id_seq OWNED BY public.promotions.id;


--
-- TOC entry 221 (class 1259 OID 16404)
-- Name: reservation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reservation (
    id integer NOT NULL,
    user_id integer NOT NULL,
    room_id integer NOT NULL,
    date_arriv date NOT NULL,
    date_depart date NOT NULL,
    nb_per integer NOT NULL,
    prix_total real NOT NULL,
    solde real NOT NULL,
    status character varying(250) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.reservation OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16466)
-- Name: reservation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.reservation ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.reservation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 231 (class 1259 OID 16497)
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    user_id integer,
    room_id integer,
    rating integer,
    comment character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16496)
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.reviews ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.reviews_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 224 (class 1259 OID 16438)
-- Name: room_options; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.room_options (
    room_id integer NOT NULL,
    option_id integer NOT NULL
);


ALTER TABLE public.room_options OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16419)
-- Name: rooms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rooms (
    id integer NOT NULL,
    numero integer NOT NULL,
    type character varying(100) NOT NULL,
    description text NOT NULL,
    prix_par_nuit real NOT NULL,
    capacite integer NOT NULL,
    disponible character varying(500) NOT NULL,
    image character varying(1000) NOT NULL
);


ALTER TABLE public.rooms OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16467)
-- Name: rooms_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.rooms ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.rooms_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 220 (class 1259 OID 16389)
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    nom character varying(100) NOT NULL,
    prenom character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password character varying(1000) NOT NULL,
    telephone character varying(20) NOT NULL,
    role character varying(80) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    reset_otp character varying(6),
    reset_otp_expires timestamp without time zone
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16388)
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."user" ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 4893 (class 2604 OID 24684)
-- Name: promotions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions ALTER COLUMN id SET DEFAULT nextval('public.promotions_id_seq'::regclass);


--
-- TOC entry 5073 (class 0 OID 16434)
-- Dependencies: 223
-- Data for Name: options; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.options (id, nom) FROM stdin;
2	Petit déjeuner
3	Piscine
4	Parking
5	Wi-Fi
1	WiFi haut débit
\.


--
-- TOC entry 5075 (class 0 OID 16447)
-- Dependencies: 225
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, reservation_id, montant, mode_paiement, status, date_paiement, transaction_id) FROM stdin;
5	4	500	Carte bancaire	Payé	2026-08-10	TXN001
6	7	4800	Carte bancaire	payé	2026-08-18	HTL-1787046708098
7	6	2000	Carte bancaire	payé	2026-08-18	HTL-1787080187590
8	9	100	Carte bancaire	En attente	2026-10-18	3285f213-716c-4bcc-90c6-ea409a3949b3
\.


--
-- TOC entry 5083 (class 0 OID 24681)
-- Dependencies: 233
-- Data for Name: promotions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promotions (id, titre, reduction, room_id, date_debut, date_fin, status, created_at) FROM stdin;
1	offre été	30.00	5	2026-08-14	2026-08-18	Active	2026-08-14 17:01:28.974201
\.


--
-- TOC entry 5071 (class 0 OID 16404)
-- Dependencies: 221
-- Data for Name: reservation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reservation (id, user_id, room_id, date_arriv, date_depart, nb_per, prix_total, solde, status, created_at) FROM stdin;
4	2	2	2026-08-15	2026-08-20	2	1250	1250	Confirmée	2026-08-12 22:24:37.889713+01
5	3	1	2026-08-27	2026-08-31	1	1600	1600	En attente de paiement	2026-08-18 10:17:00.291312+01
7	3	1	2026-08-19	2026-08-31	2	4800	0	confirmée	2026-08-18 10:51:18.113461+01
6	3	1	2026-08-19	2026-08-24	3	2000	0	confirmée	2026-08-18 10:35:51.858199+01
8	6	5	2026-08-20	2026-08-22	2	1800	1800	en attente	2026-08-18 22:27:15.926644+01
9	2	2	2026-11-10	2026-11-12	2	360	360	En attente	2026-10-18 00:57:39.719343+01
\.


--
-- TOC entry 5081 (class 0 OID 16497)
-- Dependencies: 231
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (id, user_id, room_id, rating, comment, created_at) FROM stdin;
1	2	2	5	54\n	2026-08-14 18:12:16.210641
3	2	2	3	d	2026-08-14 19:13:37.837979
4	3	1	5	merci\n	2026-08-18 20:40:26.438835
5	3	1	4	merci	2026-08-18 20:40:42.984395
6	3	1	4	merci	2026-08-18 20:41:20.415519
\.


--
-- TOC entry 5074 (class 0 OID 16438)
-- Dependencies: 224
-- Data for Name: room_options; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.room_options (room_id, option_id) FROM stdin;
1	1
1	2
1	3
\.


--
-- TOC entry 5072 (class 0 OID 16419)
-- Dependencies: 222
-- Data for Name: rooms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rooms (id, numero, type, description, prix_par_nuit, capacite, disponible, image) FROM stdin;
4	104	suite	grand suite	700	2	true	imaged.png
5	105	deluxe	belle	900	2	true	imaged.png
1	101	Suite Premium	Nouvelle description	400	3	false	suite2.jpg
2	102	Chambre Double	Chambre confortable pour deux personnes	180	2	true	room2.jpg
3	103	Chambre Simple	Chambre simple moderne	120	1	true	room3.jpg
\.


--
-- TOC entry 5070 (class 0 OID 16389)
-- Dependencies: 220
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, nom, prenom, email, password, telephone, role, created_at, reset_otp, reset_otp_expires) FROM stdin;
5	Admin	Hotelia	omrane@hotelia.com	$2b$10$Q0vSCOwvP99o3fbtQoJcpOvOxeFbUd/2u5ciHhKdXsioi6Ti9u74i	93100969	admin	2026-08-11 16:05:06.543352+01	\N	\N
6	khedher	hela	helakhedher7@gmail.com	$2b$10$m6IXj7Rpe5gWT2pkryXRaO.sofA/hruXe8.4KJJeBdcJnFHRIDNV2	92457871	user	2026-08-16 21:08:51.376311+01	619381	2026-08-16 22:17:22.841
3	Khedher	Omrane	omrane@test.com	$2b$10$R3FHdVh0YGOELuIsoXU0ne5Z3/3IdJVE2fAOTJBtLceb4KiC3sPOS	99000888	user	2026-08-06 22:19:26.082949+01	\N	\N
2	omrane	User	test@test.com	$2b$10$KKxSvOEFLbgT7FYLEXu.h.1ipvG4q3g7o8es6tD3g3Fdy9KsZhLa2	93100969	user	2026-08-06 21:41:09.258067+01	\N	\N
7	Test	Hotelia	test.hotelia@example.com	$2a$10$/.QVZDJtXjZ6v9lZQ6NUvOeO5.20L.GWE0SKGPuoyaCP8qosIUdtG	20123456	USER	2026-10-17 13:14:15.603589+01	\N	\N
8	Test	Hotelia	testtest@gmail.com	$2a$10$L1xkd/zFLXnoIqVmgjaBcuRftmraeXv52j0HO5irLti/SsRxU1trq	20123456	USER	2026-10-17 13:15:09.366235+01	\N	\N
\.


--
-- TOC entry 5090 (class 0 OID 0)
-- Dependencies: 226
-- Name: options_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.options_id_seq', 6, true);


--
-- TOC entry 5091 (class 0 OID 0)
-- Dependencies: 227
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payments_id_seq', 8, true);


--
-- TOC entry 5092 (class 0 OID 0)
-- Dependencies: 232
-- Name: promotions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.promotions_id_seq', 2, true);


--
-- TOC entry 5093 (class 0 OID 0)
-- Dependencies: 228
-- Name: reservation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reservation_id_seq', 9, true);


--
-- TOC entry 5094 (class 0 OID 0)
-- Dependencies: 230
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reviews_id_seq', 7, true);


--
-- TOC entry 5095 (class 0 OID 0)
-- Dependencies: 229
-- Name: rooms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rooms_id_seq', 11, true);


--
-- TOC entry 5096 (class 0 OID 0)
-- Dependencies: 219
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_id_seq', 8, true);


--
-- TOC entry 4906 (class 2606 OID 16446)
-- Name: options options_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.options
    ADD CONSTRAINT options_pkey PRIMARY KEY (id);


--
-- TOC entry 4910 (class 2606 OID 16458)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- TOC entry 4914 (class 2606 OID 24697)
-- Name: promotions promotions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_pkey PRIMARY KEY (id);


--
-- TOC entry 4902 (class 2606 OID 16417)
-- Name: reservation reservation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation
    ADD CONSTRAINT reservation_pkey PRIMARY KEY (id);


--
-- TOC entry 4912 (class 2606 OID 16503)
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- TOC entry 4908 (class 2606 OID 24699)
-- Name: room_options room_options_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room_options
    ADD CONSTRAINT room_options_pkey PRIMARY KEY (room_id, option_id);


--
-- TOC entry 4904 (class 2606 OID 16433)
-- Name: rooms rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (id);


--
-- TOC entry 4900 (class 2606 OID 16402)
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- TOC entry 4919 (class 2606 OID 16473)
-- Name: payments fk_payments_1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT fk_payments_1 FOREIGN KEY (reservation_id) REFERENCES public.reservation(id) NOT VALID;


--
-- TOC entry 4915 (class 2606 OID 16459)
-- Name: reservation fk_reservation_1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation
    ADD CONSTRAINT fk_reservation_1 FOREIGN KEY (user_id) REFERENCES public."user"(id) NOT VALID;


--
-- TOC entry 4916 (class 2606 OID 16468)
-- Name: reservation fk_reservation_2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation
    ADD CONSTRAINT fk_reservation_2 FOREIGN KEY (room_id) REFERENCES public.rooms(id) NOT VALID;


--
-- TOC entry 4917 (class 2606 OID 16478)
-- Name: room_options fk_room_option_1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room_options
    ADD CONSTRAINT fk_room_option_1 FOREIGN KEY (room_id) REFERENCES public.rooms(id) NOT VALID;


--
-- TOC entry 4918 (class 2606 OID 16483)
-- Name: room_options fk_room_option_2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room_options
    ADD CONSTRAINT fk_room_option_2 FOREIGN KEY (option_id) REFERENCES public.options(id) NOT VALID;


--
-- TOC entry 4920 (class 2606 OID 16509)
-- Name: reviews reviews_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id);


--
-- TOC entry 4921 (class 2606 OID 16504)
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id);


-- Completed on 2026-10-19 22:05:12

--
-- PostgreSQL database dump complete
--

\unrestrict DGbM5xpBEkIefbcNVqrRlHQWLLED6qEBbkGGbgBeseVDgSaWPLGVVBp1kaRPrQU
