/*
  Warnings:

  - You are about to drop the column `fileData` on the `Files` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Files" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fileTypeId" INTEGER,
    "fileExtensionId" INTEGER,
    "filePath" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Files_fileTypeId_fkey" FOREIGN KEY ("fileTypeId") REFERENCES "CatFileType" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Files_fileExtensionId_fkey" FOREIGN KEY ("fileExtensionId") REFERENCES "CatFileExtension" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Files" ("createdAt", "fileExtensionId", "filePath", "fileTypeId", "id", "status") SELECT "createdAt", "fileExtensionId", "filePath", "fileTypeId", "id", "status" FROM "Files";
DROP TABLE "Files";
ALTER TABLE "new_Files" RENAME TO "Files";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
