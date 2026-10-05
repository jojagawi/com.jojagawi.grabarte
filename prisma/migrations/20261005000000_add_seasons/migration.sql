-- CreateTable
CREATE TABLE "CatSeasons" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startMonth" INTEGER NOT NULL,
    "endMonth" INTEGER NOT NULL,
    "leadDays" INTEGER NOT NULL DEFAULT 21,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RelSeasonsCategories" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "seasonId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RelSeasonsCategories_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "CatSeasons" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RelSeasonsCategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CatCategories" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "CatSeasons_slug_key" ON "CatSeasons"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "RelSeasonsCategories_seasonId_categoryId_key" ON "RelSeasonsCategories"("seasonId", "categoryId");

