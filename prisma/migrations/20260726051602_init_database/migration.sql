-- CreateTable
CREATE TABLE "CatCategories" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "CatDesignsType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "CatFileExtension" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "extension" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "CatFileType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "CatMaterials" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "slug" TEXT,
    "description" TEXT,
    "icon" TEXT
);

-- CreateTable
CREATE TABLE "Designs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "description" TEXT,
    "author" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "isTested" INTEGER NOT NULL DEFAULT 0,
    "showInHome" INTEGER NOT NULL DEFAULT 0,
    "showInSite" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "materialId" INTEGER,
    "numberMdfTables" INTEGER NOT NULL DEFAULT 0,
    "timeMachine" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Designs_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "CatMaterials" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Files" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fileTypeId" INTEGER,
    "fileExtensionId" INTEGER,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fileData" BLOB NOT NULL,
    CONSTRAINT "Files_fileTypeId_fkey" FOREIGN KEY ("fileTypeId") REFERENCES "CatFileType" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Files_fileExtensionId_fkey" FOREIGN KEY ("fileExtensionId") REFERENCES "CatFileExtension" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RelDesignsCategories" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "designId" INTEGER,
    "categoryId" INTEGER,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RelDesignsCategories_designId_fkey" FOREIGN KEY ("designId") REFERENCES "Designs" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "RelDesignsCategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CatCategories" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RelDesignsFiles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "designId" INTEGER,
    "typeId" INTEGER,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RelDesignsFiles_designId_fkey" FOREIGN KEY ("designId") REFERENCES "Designs" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "RelDesignsFiles_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "Files" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RelDesignsTypes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "designId" INTEGER,
    "typeId" INTEGER,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RelDesignsTypes_designId_fkey" FOREIGN KEY ("designId") REFERENCES "Designs" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "RelDesignsTypes_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "CatDesignsType" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "CatMaterials_slug_key" ON "CatMaterials"("slug");
