CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE "users" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "first_name" VARCHAR(80) NOT NULL,
  "last_name" VARCHAR(80) NOT NULL,
  "email" VARCHAR(320) NOT NULL,
  "phone_number" VARCHAR(20) NOT NULL,
  "password_hash" TEXT NOT NULL,
  "email_verified_at" TIMESTAMPTZ(6),
  "phone_verified_at" TIMESTAMPTZ(6),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,

  CONSTRAINT "users_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "users_first_name_not_blank" CHECK (length(trim("first_name")) > 0),
  CONSTRAINT "users_last_name_not_blank" CHECK (length(trim("last_name")) > 0),
  CONSTRAINT "users_email_format" CHECK (
    "email" ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  ),
  CONSTRAINT "users_phone_number_format" CHECK (
    "phone_number" ~ '^\+?[1-9][0-9]{7,14}$'
  ),
  CONSTRAINT "users_password_hash_not_blank" CHECK (length(trim("password_hash")) > 0)
);

CREATE UNIQUE INDEX "users_email_key" ON "users" ("email");
CREATE UNIQUE INDEX "users_phone_number_key" ON "users" ("phone_number");
CREATE INDEX "users_email_idx" ON "users" ("email");
CREATE INDEX "users_phone_number_idx" ON "users" ("phone_number");
