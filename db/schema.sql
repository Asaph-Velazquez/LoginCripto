-- PostgreSQL schema for the login/registration flow.
-- The UI fields map as:
-- name -> first_name
-- lastName -> last_name
-- email -> email
-- phone -> phone_number
-- password -> password_hash

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(80) NOT NULL,
  last_name VARCHAR(80) NOT NULL,
  email VARCHAR(320) NOT NULL UNIQUE,
  phone_number VARCHAR(20) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  email_verified_at TIMESTAMPTZ,
  phone_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT users_first_name_not_blank CHECK (length(trim(first_name)) > 0),
  CONSTRAINT users_last_name_not_blank CHECK (length(trim(last_name)) > 0),
  CONSTRAINT users_email_format CHECK (
    email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  ),
  CONSTRAINT users_phone_number_format CHECK (
    phone_number ~ '^\+?[1-9][0-9]{7,14}$'
  ),
  CONSTRAINT users_password_hash_not_blank CHECK (length(trim(password_hash)) > 0)
);

CREATE INDEX IF NOT EXISTS users_email_idx ON users (email);
CREATE INDEX IF NOT EXISTS users_phone_number_idx ON users (phone_number);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_set_updated_at ON users;

CREATE TRIGGER users_set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
