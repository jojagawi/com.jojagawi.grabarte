-- AlterTable
-- ADD COLUMN en lugar de recrear la tabla: no copia ni mueve los registros existentes.
ALTER TABLE "Designs" ADD COLUMN "requests" INTEGER NOT NULL DEFAULT 0;
