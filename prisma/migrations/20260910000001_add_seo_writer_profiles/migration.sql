CREATE TABLE "SeoWriterProfiles" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "name" TEXT NOT NULL,
  "tone" TEXT NOT NULL,
  "audience" TEXT,
  "instructions" TEXT NOT NULL,
  "status" INTEGER NOT NULL DEFAULT 1,
  "isDefault" INTEGER NOT NULL DEFAULT 0,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

CREATE UNIQUE INDEX "SeoWriterProfiles_name_key" ON "SeoWriterProfiles"("name");

INSERT INTO "SeoWriterProfiles" (
  "name",
  "tone",
  "audience",
  "instructions",
  "status",
  "isDefault",
  "updatedAt"
)
VALUES (
  'Catalogo InspiraArte',
  'Cercano, creativo y comercial sin exageraciones',
  'Personas que buscan regalos personalizados y decoracion para eventos',
  'Redacta en espanol neutro con enfoque Mexico. Evita promesas absolutas y relleno. Prioriza claridad, beneficios reales, ocasiones de uso y materiales. Usa un estilo consistente de catalogo: titular concreto, descripcion corta orientada a conversion, meta descripcion natural, descripcion larga con detalles utiles y cierre con invitacion sutil.',
  1,
  1,
  CURRENT_TIMESTAMP
);

