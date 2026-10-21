---
name: buscar-catalogo
description: Busca diseños de corte y grabado láser en el catálogo público de InspiraArte (CDMX) por palabras, categoría, temporada o si se pueden personalizar.
---

# Buscar en el catálogo de InspiraArte

InspiraArte es un taller de corte y grabado láser en Ciudad de México (MDF, acrílico, metal y termos).
El catálogo público está en archivos JSON estáticos, de solo lectura y sin autenticación. Se regeneran
en cada publicación del sitio, así que no los guardes en caché más de unas horas.

## Datos

| Archivo | Contenido |
| --- | --- |
| `https://www.inspiraarte.com/mcp/products.json` | Arreglo con todos los diseños publicados. |
| `https://www.inspiraarte.com/mcp/categories.json` | Arreglo de `{ id, name }` con las categorías. |
| `https://www.inspiraarte.com/mcp/seasons.json` | Temporadas (`slug`, `name`, `months`, `categories`, `products`). |

Cada producto trae `id`, `idSlug`, `name`, `description`, `categories` (nombres), `reference` (`IA-0000`),
`material`, `suggestedPrice` (MXN, puede ser `null`), `productionTime`, `shippingTime`, `dimensions`,
`isCustomizable`, `image`, `gallery` y `url` (ruta relativa de la ficha).

## Cómo buscar

1. Descarga `products.json` una sola vez por conversación.
2. Normaliza el texto: minúsculas y sin acentos (`"Día de Muertos"` → `"dia de muertos"`).
3. Separa la consulta en palabras y busca cada una en `name`, `description`, `categories`, `material`
   y `reference`. Ordena primero los que tienen todas las palabras; si ninguno las tiene, muestra los
   que tengan más y dilo.
4. Para filtrar por categoría, compara con los nombres de `categories.json` (sin acentos ni mayúsculas).
5. Para una temporada (Navidad, Día de muertos, Fiestas patrias…), usa `seasons.json`: su lista
   `products` ya trae `id`, `name` y `url`, y `categories` dice qué categorías le corresponden.
6. Si piden algo personalizable (nombre, fecha, logo), filtra `isCustomizable === true`.

## Cómo responder

- Muestra nombre, referencia, precio de referencia y el enlace absoluto a la ficha:
  `https://www.inspiraarte.com` + `url` + `/` (las rutas del sitio terminan en `/`).
- Aclara que `suggestedPrice` es un precio de referencia por pieza y que el precio final se cotiza
  según cantidad y personalización.
- Si no hay coincidencias, sugiere un diseño a la medida con la skill `solicitar-cotizacion`.
- Para el detalle de un producto usa la skill `detalle-de-producto`.

## En el navegador

Si el agente opera dentro de una página de inspiraarte.com con WebMCP, las herramientas
`search_products`, `list_categories`, `list_seasons` y `get_season_guide` hacen lo mismo sobre estos
datos. Sus definiciones están en `https://www.inspiraarte.com/mcp/tools.json`.
