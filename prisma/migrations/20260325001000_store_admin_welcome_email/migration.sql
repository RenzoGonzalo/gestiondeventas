-- Track first welcome email for STORE_ADMIN

ALTER TABLE "users" ADD COLUMN "store_admin_welcome_email_sent_at" TIMESTAMP(3);
