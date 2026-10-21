---
name: informacion-del-taller
description: Responde preguntas sobre InspiraArte (contacto, ubicación, tiempos, envíos, pagos, materiales y técnicas de corte y grabado láser) con sus preguntas frecuentes y datos públicos.
---

# Información del taller InspiraArte

Usa esta skill para preguntas generales que no son de un producto concreto: cómo contactar al taller,
cuánto tarda un pedido, cómo se paga o se envía, o qué diferencia hay entre los materiales.

## Datos

Todos son JSON estáticos, públicos y sin autenticación (esquema en
`https://www.inspiraarte.com/mcp/openapi.json`):

| Archivo | Para qué |
| --- | --- |
| `https://www.inspiraarte.com/mcp/business-info.json` | Nombre, correo, WhatsApp, dirección, horarios y redes sociales. |
| `https://www.inspiraarte.com/mcp/faqs.json` | Preguntas frecuentes (`question`, `answer`) sobre pedidos, envíos y pagos. |
| `https://www.inspiraarte.com/mcp/materials.json` | Definición de corte y grabado láser, materiales (MDF, acrílico, metal, termo) y medidas de referencia con precio. |
| `https://www.inspiraarte.com/mcp/seasons.json` | Temporadas del año y su guía en Markdown. |
| `https://www.inspiraarte.com/mcp/reviews.json` | Opiniones aprobadas de clientes. |

## Cómo responder

- Busca primero en `faqs.json` (sin acentos ni mayúsculas) y responde con su texto; cita la página
  `https://www.inspiraarte.com/faq/` para más detalle.
- Para materiales, usa `definition`, `technique` y `bestFor` de `materials.json`; para precios por
  tamaño, `sizeReferences` (precios de referencia en MXN, no finales).
- Para contacto, usa `business-info.json`. Los campos vacíos (`""`, `[]` o `null`) significan que el
  dato no está publicado: no lo inventes y remite a `https://www.inspiraarte.com/contacto/`.
- Si la persona quiere pedir algo, sigue con la skill `solicitar-cotizacion`.

Más contexto del sitio en `https://www.inspiraarte.com/llms.txt`.

## En el navegador

Con WebMCP en el sitio: `get_business_info`, `search_faq`, `get_materials_guide` y `get_reviews`.
