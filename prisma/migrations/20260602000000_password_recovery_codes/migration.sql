CREATE TABLE "password_recovery_codes" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "email" VARCHAR(320) NOT NULL,
  "code" VARCHAR(6) NOT NULL,
  "requested_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expires_at" TIMESTAMPTZ(6) NOT NULL,
  "consumed_at" TIMESTAMPTZ(6),

  CONSTRAINT "password_recovery_codes_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "password_recovery_codes_email_format" CHECK (
    "email" ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  ),
  CONSTRAINT "password_recovery_codes_code_format" CHECK (
    "code" ~ '^\d{6}$'
  )
);

CREATE INDEX "password_recovery_codes_email_idx" ON "password_recovery_codes" ("email");
CREATE INDEX "password_recovery_codes_email_requested_at_idx" ON "password_recovery_codes" ("email", "requested_at");
CREATE INDEX "password_recovery_codes_email_code_idx" ON "password_recovery_codes" ("email", "code");

-- Match existing pattern: Prisma generates UUID client-side.
ALTER TABLE "password_recovery_codes" ALTER COLUMN "id" DROP DEFAULT;
