-- Add seller_code for PIN/code login users (SELLER)

ALTER TABLE "users" ADD COLUMN "seller_code" TEXT;

CREATE UNIQUE INDEX "users_seller_code_key" ON "users"("seller_code");
