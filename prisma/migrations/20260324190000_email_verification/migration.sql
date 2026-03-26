-- Add email verification fields to users

ALTER TABLE "users"
ADD COLUMN     "email_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "email_verification_token_hash" TEXT,
ADD COLUMN     "email_verification_token_expires_at" TIMESTAMP(3);

-- Unique token hash (nullable)
CREATE UNIQUE INDEX "users_email_verification_token_hash_key"
ON "users"("email_verification_token_hash");
