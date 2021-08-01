--
-- PostgreSQL database dump
--

-- Dumped from database version 12.7
-- Dumped by pg_dump version 12.7

-- Started on 2021-08-01 20:01:17

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
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
-- TOC entry 203 (class 1259 OID 16427)
-- Name: babyfoot_games; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.babyfoot_games (
    id integer NOT NULL,
    "timestamp" time(0) without time zone DEFAULT now() NOT NULL,
    player1 text NOT NULL,
    score1 integer DEFAULT 0 NOT NULL,
    player2 text NOT NULL,
    score2 integer DEFAULT 0 NOT NULL,
    current_state text DEFAULT 'En cours'::text NOT NULL,
    timestamp_end time(0) without time zone,
    CONSTRAINT score_verification CHECK (((score1 > '-1'::integer) AND (score2 > '-1'::integer)))
);


ALTER TABLE public.babyfoot_games OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 16425)
-- Name: babyfoot_games_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.babyfoot_games_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.babyfoot_games_id_seq OWNER TO postgres;

--
-- TOC entry 2829 (class 0 OID 0)
-- Dependencies: 202
-- Name: babyfoot_games_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.babyfoot_games_id_seq OWNED BY public.babyfoot_games.id;


--
-- TOC entry 2688 (class 2604 OID 16430)
-- Name: babyfoot_games id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.babyfoot_games ALTER COLUMN id SET DEFAULT nextval('public.babyfoot_games_id_seq'::regclass);


--
-- TOC entry 2823 (class 0 OID 16427)
-- Dependencies: 203
-- Data for Name: babyfoot_games; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.babyfoot_games (id, "timestamp", player1, score1, player2, score2, current_state, timestamp_end) FROM stdin;
\.


--
-- TOC entry 2830 (class 0 OID 0)
-- Dependencies: 202
-- Name: babyfoot_games_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.babyfoot_games_id_seq', 49, true);


--
-- TOC entry 2695 (class 2606 OID 16438)
-- Name: babyfoot_games babyfoot_games_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.babyfoot_games
    ADD CONSTRAINT babyfoot_games_pkey PRIMARY KEY (id);


-- Completed on 2021-08-01 20:01:18

--
-- PostgreSQL database dump complete
--

