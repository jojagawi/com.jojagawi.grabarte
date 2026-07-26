-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Designs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "description" TEXT,
    "author" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "isTested" INTEGER NOT NULL DEFAULT 0,
    "isXustomizable" INTEGER NOT NULL DEFAULT 0,
    "showInHome" INTEGER NOT NULL DEFAULT 0,
    "showInSite" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "materialId" INTEGER,
    "numberMdfTables" INTEGER NOT NULL DEFAULT 0,
    "timeMachine" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Designs_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "CatMaterials" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Designs" ("author", "createdAt", "description", "id", "isTested", "materialId", "name", "numberMdfTables", "showInHome", "showInSite", "status", "timeMachine") SELECT "author", "createdAt", "description", "id", "isTested", "materialId", "name", "numberMdfTables", "showInHome", "showInSite", "status", "timeMachine" FROM "Designs";
DROP TABLE "Designs";
ALTER TABLE "new_Designs" RENAME TO "Designs";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
