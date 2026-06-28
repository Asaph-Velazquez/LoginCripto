UPDATE "users"
SET "email_verified_at" = CURRENT_TIMESTAMP
WHERE "email_verified_at" IS NULL;

CREATE TABLE "email_verification_codes" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL,
  "code" VARCHAR(6) NOT NULL,
  "requested_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expires_at" TIMESTAMPTZ(6) NOT NULL,
  "consumed_at" TIMESTAMPTZ(6),

  CONSTRAINT "email_verification_codes_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "email_verification_codes_code_format" CHECK ("code" ~ '^\d{6}$'),
  CONSTRAINT "email_verification_codes_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "email_verification_codes_user_id_idx"
  ON "email_verification_codes"("user_id");
CREATE INDEX "email_verification_codes_user_id_requested_at_idx"
  ON "email_verification_codes"("user_id", "requested_at");

ALTER TABLE "email_verification_codes" ALTER COLUMN "id" DROP DEFAULT;
