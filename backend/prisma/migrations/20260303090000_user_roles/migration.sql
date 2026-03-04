-- Convert users.roleId (1 role) to many-to-many via user_roles

-- 1) Create join table
CREATE TABLE IF NOT EXISTS "user_roles" (
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("userId", "roleId")
);

-- 2) Foreign keys
ALTER TABLE "user_roles"
    ADD CONSTRAINT "user_roles_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "user_roles"
    ADD CONSTRAINT "user_roles_roleId_fkey"
    FOREIGN KEY ("roleId") REFERENCES "roles"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

-- 3) Migrate existing roleId values into join table
INSERT INTO "user_roles" ("userId", "roleId")
SELECT "id", "roleId" FROM "users"
ON CONFLICT DO NOTHING;

-- 4) Drop old FK + column
ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_roleId_fkey";
ALTER TABLE "users" DROP COLUMN IF EXISTS "roleId";
