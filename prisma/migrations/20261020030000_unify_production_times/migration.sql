-- Un solo plazo de producción para pedidos pequeños en todo el sitio: 3 a 4 días hábiles
-- (FAQ de /faq y guías de temporada; el código usa el mismo plazo en /proceso y en las FAQ de colecciones).
UPDATE "Faqs" SET "answer" = REPLACE("answer", 'están listos en 3-5 días hábiles', 'están listos en 3 a 4 días hábiles');

UPDATE "CatSeasons" SET "guide" = REPLACE("guide", 'se producen en 1 a 5 días hábiles', 'se producen en 3 a 4 días hábiles')
WHERE "slug" IN ('dia-de-muertos', 'navidad');
