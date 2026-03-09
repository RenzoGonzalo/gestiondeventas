-- Add nombre to users
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "nombre" TEXT NOT NULL DEFAULT '';
