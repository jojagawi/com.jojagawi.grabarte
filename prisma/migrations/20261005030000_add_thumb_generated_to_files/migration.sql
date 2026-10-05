-- AlterTable
-- ADD COLUMN en lugar de recrear la tabla: no copia ni mueve los registros existentes.
ALTER TABLE "Files" ADD COLUMN "thumb_generated" BOOLEAN NOT NULL DEFAULT false;
