-- AlterTable
ALTER TABLE "CatFileExtension" ADD COLUMN "mimeType" TEXT;

-- AlterTable
ALTER TABLE "CatFileType" ADD COLUMN "description" TEXT;

-- AlterTable
ALTER TABLE "Files" ADD COLUMN "filePath" TEXT;
