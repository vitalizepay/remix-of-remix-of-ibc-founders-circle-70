CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
BEGIN;

--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

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

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: app_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.app_role AS ENUM (
    'admin',
    'moderator',
    'user'
);


--
-- Name: application_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.application_status_enum AS ENUM (
    'pending',
    'approved',
    'rejected'
);


--
-- Name: business_stage_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.business_stage_enum AS ENUM (
    'early',
    'growing',
    'established'
);


--
-- Name: ibc_stories_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.ibc_stories_enum AS ENUM (
    'yes',
    'maybe'
);


--
-- Name: membership_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.membership_type_enum AS ENUM (
    'founding',
    'annual'
);


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
    INSERT INTO public.profiles (id, email)
    VALUES (new.id, new.email);
    RETURN new;
END;
$$;


--
-- Name: has_role(uuid, public.app_role); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: ibc_membership_applications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ibc_membership_applications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    application_status public.application_status_enum DEFAULT 'pending'::public.application_status_enum NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    full_name text NOT NULL,
    company_name text NOT NULL,
    role_designation text NOT NULL,
    industry text NOT NULL,
    years_in_business integer NOT NULL,
    website_or_linkedin text,
    email text NOT NULL,
    mobile_number text NOT NULL,
    business_description text NOT NULL,
    business_stage public.business_stage_enum NOT NULL,
    reason_to_join text NOT NULL,
    expected_gain text NOT NULL,
    contribution_to_community text NOT NULL,
    membership_type public.membership_type_enum NOT NULL,
    participate_in_events boolean NOT NULL,
    understands_curation boolean NOT NULL,
    ibc_stories_interest public.ibc_stories_enum,
    declaration_confirmed boolean NOT NULL,
    CONSTRAINT ibc_membership_applications_declaration_confirmed_check CHECK ((declaration_confirmed = true)),
    CONSTRAINT ibc_membership_applications_years_in_business_check CHECK ((years_in_business >= 0))
);


--
-- Name: membership_inquiries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.membership_inquiries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    full_name text NOT NULL,
    email text NOT NULL,
    mobile_number text NOT NULL,
    company_name text NOT NULL,
    role_designation text NOT NULL,
    industry text NOT NULL,
    years_in_business integer NOT NULL,
    website_or_linkedin text,
    business_description text NOT NULL,
    business_stage text NOT NULL,
    reason_to_join text NOT NULL,
    expected_gain text NOT NULL,
    contribution_to_community text NOT NULL,
    membership_type text NOT NULL,
    participate_in_events boolean DEFAULT false NOT NULL,
    understands_curation boolean DEFAULT false NOT NULL,
    ibc_stories_interest text,
    declaration_confirmed boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    email text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role public.app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: ibc_membership_applications ibc_membership_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ibc_membership_applications
    ADD CONSTRAINT ibc_membership_applications_pkey PRIMARY KEY (id);


--
-- Name: ibc_membership_applications ibc_membership_applications_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ibc_membership_applications
    ADD CONSTRAINT ibc_membership_applications_user_id_key UNIQUE (user_id);


--
-- Name: membership_inquiries membership_inquiries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.membership_inquiries
    ADD CONSTRAINT membership_inquiries_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);


--
-- Name: ibc_membership_applications update_applications_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.ibc_membership_applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: profiles update_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: ibc_membership_applications ibc_membership_applications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ibc_membership_applications
    ADD CONSTRAINT ibc_membership_applications_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_roles Admins can manage roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage roles" ON public.user_roles TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: ibc_membership_applications Admins can update applications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update applications" ON public.ibc_membership_applications FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: ibc_membership_applications Admins can view all applications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all applications" ON public.ibc_membership_applications FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: membership_inquiries Admins can view all inquiries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all inquiries" ON public.membership_inquiries FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: user_roles Admins can view all roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: membership_inquiries Anyone can submit inquiry; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can submit inquiry" ON public.membership_inquiries FOR INSERT WITH CHECK (true);


--
-- Name: ibc_membership_applications Users can insert their own application; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own application" ON public.ibc_membership_applications FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));


--
-- Name: profiles Users can update their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = id));


--
-- Name: ibc_membership_applications Users can view their own application; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own application" ON public.ibc_membership_applications FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: profiles Users can view their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING ((auth.uid() = id));


--
-- Name: user_roles Users can view their own roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: ibc_membership_applications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ibc_membership_applications ENABLE ROW LEVEL SECURITY;

--
-- Name: membership_inquiries; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.membership_inquiries ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--




COMMIT;