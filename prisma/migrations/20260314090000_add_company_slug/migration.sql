-- Add Company.slug for SaaS-style URLs

ALTER TABLE "companies" ADD COLUMN "slug" TEXT;

-- Backfill existing companies with a best-effort slug
UPDATE "companies"
SET "slug" = lower(regexp_replace("name", '[^a-zA-Z0-9]+', '-', 'g'))
WHERE "slug" IS NULL;

-- Trim leading/trailing hyphens
UPDATE "companies"
SET "slug" = regexp_replace("slug", '(^-+|-+$)', '', 'g')
WHERE "slug" IS NOT NULL;

-- De-duplicate slugs if needed by appending an id suffix
WITH ranked AS (
  SELECT id, slug, row_number() OVER (PARTITION BY slug ORDER BY id) AS rn
  FROM "companies"
)
UPDATE "companies" c
SET "slug" = c.slug || '-' || substring(c.id, 1, 6)
FROM ranked r
WHERE c.id = r.id
  AND r.rn > 1;

ALTER TABLE "companies" ALTER COLUMN "slug" SET NOT NULL;

CREATE UNIQUE INDEX "companies_slug_key" ON "companies"("slug");
