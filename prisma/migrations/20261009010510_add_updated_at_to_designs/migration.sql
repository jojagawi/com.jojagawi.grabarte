-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Designs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "description" TEXT,
    "keywords" TEXT,
    "seoDescription" TEXT,
    "longDescription" TEXT,
    "features" TEXT,
    "benefits" TEXT,
    "useCases" TEXT,
    "audience" TEXT,
    "faq" TEXT,
    "imageDescription" TEXT,
    "productionTime" TEXT,
    "shippingTime" TEXT,
    "availability" TEXT,
    "dimensions" TEXT,
    "notes" TEXT,
    "author" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "isTested" INTEGER NOT NULL DEFAULT 0,
    "isCustomizable" INTEGER NOT NULL DEFAULT 0,
    "showInHome" INTEGER NOT NULL DEFAULT 0,
    "showInSite" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "materialId" INTEGER,
    "numberMdfTables" INTEGER NOT NULL DEFAULT 0,
    "timeMachine" INTEGER NOT NULL DEFAULT 0,
    "suggestedPrice" REAL,
    "mayoreo" REAL,
    "minimumPrice" REAL,
    "requests" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Designs_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "CatMaterials" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
-- updatedAt arranca en createdAt: sin historial de ediciones, la fecha de alta es la mejor aproximación.
INSERT INTO "new_Designs" ("audience", "author", "availability", "benefits", "createdAt", "description", "dimensions", "faq", "features", "id", "imageDescription", "isCustomizable", "isTested", "keywords", "longDescription", "materialId", "mayoreo", "minimumPrice", "name", "notes", "numberMdfTables", "productionTime", "requests", "seoDescription", "shippingTime", "showInHome", "showInSite", "status", "suggestedPrice", "timeMachine", "useCases", "updatedAt") SELECT "audience", "author", "availability", "benefits", "createdAt", "description", "dimensions", "faq", "features", "id", "imageDescription", "isCustomizable", "isTested", "keywords", "longDescription", "materialId", "mayoreo", "minimumPrice", "name", "notes", "numberMdfTables", "productionTime", "requests", "seoDescription", "shippingTime", "showInHome", "showInSite", "status", "suggestedPrice", "timeMachine", "useCases", "createdAt" FROM "Designs";
DROP TABLE "Designs";
ALTER TABLE "new_Designs" RENAME TO "Designs";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
