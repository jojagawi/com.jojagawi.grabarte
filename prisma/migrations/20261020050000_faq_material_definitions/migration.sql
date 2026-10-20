-- Definiciones para la FAQ de /faq (AEO): qué es el MDF y qué es el grabado láser.
-- El mismo texto está en src/lib/faq-data.ts y prisma/seed.ts.
INSERT INTO "Faqs" ("question", "answer", "showInSite", "showInMcp", "priority")
SELECT '¿Qué es el MDF?', 'El MDF (tablero de fibra de densidad media) es un tablero hecho con fibras de madera prensadas con resina. Tiene una superficie lisa, sin vetas ni nudos, por eso se corta limpio con láser y se pinta fácil con pintura acrílica. Es para interiores, porque la humedad lo hincha. Lo usamos en grosores de 2 a 9 mm.', 1, 1, 9
WHERE NOT EXISTS (SELECT 1 FROM "Faqs" WHERE "question" = '¿Qué es el MDF?');
INSERT INTO "Faqs" ("question", "answer", "showInSite", "showInMcp", "priority")
SELECT '¿Qué es el grabado láser?', 'El grabado láser es una técnica en la que un rayo láser quema o retira la capa superficial del material para marcar textos, fechas, logos o imágenes. No usa tintas, así que el grabado es permanente y no se despinta. El corte láser usa el mismo equipo, pero atraviesa el material para darle forma a la pieza.', 1, 1, 10
WHERE NOT EXISTS (SELECT 1 FROM "Faqs" WHERE "question" = '¿Qué es el grabado láser?');
