-- Add google_sub for Google-authenticated users (STORE_ADMIN)

ALTER TABLE "users" ADD COLUMN "google_sub" TEXT;

CREATE UNIQUE INDEX "users_google_sub_key" ON "users"("google_sub");
