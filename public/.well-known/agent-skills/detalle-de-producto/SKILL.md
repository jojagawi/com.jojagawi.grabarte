---
name: detalle-de-producto
description: Obtiene la ficha completa de un producto de InspiraArte (medidas, material, precio de referencia, tiempos de producción y envío, imágenes y opiniones) a partir de su id, referencia IA-0000 o URL.
---

# Detalle de un producto de InspiraArte

Usa esta skill cuando ya sabes qué producto interesa (por la skill `buscar-catalogo`, por un enlace
que compartió la persona o por una referencia como `IA-0273`).

## Datos

- `https://www.inspiraarte.com/mcp/products.json`: arreglo de productos.
- `https://www.inspiraarte.com/mcp/reviews.json`: opiniones aprobadas (`name`, `product`, `rating` 1–5,
  `comment`, `productId`, `createdAt`).
- `https://www.inspiraarte.com/mcp/materials.json`: qué es cada material y técnica, y para qué sirve.

Son JSON estáticos, públicos y sin autenticación. El esquema completo está en
`https://www.inspiraarte.com/mcp/openapi.json`.

## Cómo encontrar el producto

Acepta cualquiera de estas formas y búscalo en `products.json`:

| Entrada | Campo |
| --- | --- |
| `273` | `id` |
| `IA-0273` | `reference` |
| `273-trineo-de-santa-claus-...` | `idSlug` |
| `https://www.inspiraarte.com/productos/273-trineo-.../` | último segmento de la ruta = `idSlug`; el número inicial es el `id` |

Si no aparece, el producto ya no está publicado: dilo y ofrece buscar algo parecido.

## Qué contar

- Nombre, referencia y descripción.
- Material y medidas (`material`, `dimensions`). Si preguntan por el material, explica con
  `materials.json` (por ejemplo, que el MDF se envía sin pintar cuando así lo dice la descripción).
- Precio de referencia (`suggestedPrice`, MXN por pieza; `null` significa "se cotiza").
- `productionTime` y `shippingTime` son días hábiles y se suman. Para pedidos grandes el taller
  confirma la fecha al cotizar.
- `isCustomizable`: si se puede personalizar con nombre, fecha o logo.
- Imagen principal (`image`) y `gallery`.
- Opiniones: filtra `reviews.json` por `productId`; si no hay, no inventes ninguna.
- Enlace a la ficha: `https://www.inspiraarte.com` + `url` + `/`.

No hay carrito ni pago en línea. Para pedirlo, usa la skill `solicitar-cotizacion` con el `id`.

## En el navegador

Con WebMCP en el sitio, `get_product_detail` devuelve lo mismo y `get_current_product` dice qué
ficha está viendo la persona.
