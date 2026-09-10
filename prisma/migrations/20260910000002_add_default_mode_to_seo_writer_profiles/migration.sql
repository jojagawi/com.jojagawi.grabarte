ALTER TABLE "SeoWriterProfiles" ADD COLUMN "defaultMode" TEXT NOT NULL DEFAULT 'rewrite-soft';

UPDATE "SeoWriterProfiles"
SET "defaultMode" = 'rewrite-soft'
WHERE "defaultMode" IS NULL OR TRIM("defaultMode") = '';

