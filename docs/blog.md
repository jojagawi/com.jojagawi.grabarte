# Blog

Los artículos viven en `content/blog/<slug>.md`, uno por archivo. El nombre del archivo es la URL: `content/blog/regalos-para-intercambio-navideno-por-presupuesto.md` se publica en `/blog/regalos-para-intercambio-navideno-por-presupuesto/`.

## Encabezado

```markdown
---
title: Regalos para intercambio navideño por presupuesto
description: Una o dos frases para el listado y la meta description (máximo ~160 caracteres).
season: navidad
products: 109, 4, 184
publishAt: 2026-10-26
updatedAt: 2026-10-26
status: published
author: Nombre Apellido
---
```

| Campo | Para qué sirve |
| --- | --- |
| `title` | H1 y `<title>`. Una pregunta o una búsqueda de cola larga; no la palabra principal de una guía de temporada. |
| `description` | Resumen del listado y meta description. |
| `season` | Slug de `/catalogos/temporadas` (`navidad`, `graduaciones`…). La guía de esa temporada enlaza al artículo en "Lee también en el blog". Opcional. |
| `products` | IDs de productos que se muestran como tarjetas al final, en ese orden. El primero da la imagen del artículo. |
| `publishAt` | Fecha de publicación (AAAA-MM-DD, hora de CDMX). Si es futura, el artículo sale en el primer build a partir de esa fecha (el de los lunes a las 5:00). |
| `updatedAt` | Fecha visible "Actualizado el…", `dateModified` y `<lastmod>` del sitemap. Cámbiala al editar el contenido. |
| `status` | `draft` no se publica nunca; `published` se publica desde `publishAt`. |
| `author` | Opcional. Sin autor firma InspiraArte. |

## Cuerpo

El mismo Markdown acotado de las guías de temporada (`src/components/custom/guide-content.tsx`): `##` y `###`, párrafos, listas, tablas, `**negritas**` y enlaces. Además:

- `[texto](producto:109)` enlaza a la ficha del producto 109 con su URL real.
- `{{precio:109}}` imprime el precio de referencia (`suggestedPrice`) del producto 109, por ejemplo `$60`.

Así los precios y las URLs salen de la base al compilar y nunca se escriben a mano. Si un producto deja de mostrarse en el sitio, su enlace queda como texto y el precio como "precio a cotizar" (el build avisa con `[blog]`).

La sección `## Preguntas frecuentes`, con cada pregunta como `###`, se publica también como schema FAQPage.

## Revisar un borrador en local

```bash
BLOG_PREVIEW=true pnpm run dev
```

Con `BLOG_PREVIEW=true` se ven también los artículos en `draft` o con `publishAt` futuro.

## Revisiones y borradores automáticos

- `pnpm run blog:check` revisa todos los artículos (encabezado, productos visibles, precios y enlaces por ID, longitud, preguntas frecuentes). Corre en el CI de cada PR dentro de `test:all`.
- `pnpm run blog:products -- <temporada>` lista los productos publicados que un artículo puede citar.
- Los temas y fechas están en [blog-calendario.md](blog-calendario.md). Una rutina de Claude escribe un borrador los días 1 y 15 siguiendo [blog-rutina.md](blog-rutina.md) y lo entrega como PR.
