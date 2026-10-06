-- CreateTable
CREATE TABLE "AiModels" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "provider" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,
    "inputText" BOOLEAN NOT NULL DEFAULT true,
    "inputImage" BOOLEAN NOT NULL DEFAULT false,
    "outputText" BOOLEAN NOT NULL DEFAULT true,
    "outputImage" BOOLEAN NOT NULL DEFAULT false,
    "pricing" TEXT NOT NULL DEFAULT 'unknown',
    "pricingManual" BOOLEAN NOT NULL DEFAULT false,
    "contextLength" INTEGER,
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "source" TEXT NOT NULL DEFAULT 'official',
    "lastSyncedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AiModels_provider_modelId_key" ON "AiModels"("provider", "modelId");

