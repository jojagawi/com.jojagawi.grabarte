---
name: solicitar-cotizacion
description: Prepara una solicitud de cotización en InspiraArte con producto, cantidad, fecha y detalles de personalización, como enlace a /contacto/ prellenado que la persona revisa y envía.
---

# Solicitar una cotización a InspiraArte

InspiraArte no vende con carrito: todo pedido empieza con una cotización. El taller necesita sobre
todo la **cantidad** y la **fecha** en que se necesitan las piezas para responder en un solo mensaje.

**Nunca envíes la solicitud en nombre de la persona.** No hay API para enviarla: arma el enlace,
compártelo y deja que ella revise, escriba su nombre y correo y pulse Enviar.

## Qué preguntar

1. ¿Qué producto? Un `id` de `https://www.inspiraarte.com/mcp/products.json` (skill
   `buscar-catalogo`) o "diseño a la medida" si no existe en el catálogo.
2. ¿Cuántas piezas? Entero mayor que cero.
3. ¿Para qué fecha? En formato `AAAA-MM-DD`, a partir de hoy.
4. ¿Qué se personaliza? Nombres, textos, colores, logo, tipo de evento.

Si la fecha queda antes de `productionTime` + `shippingTime` del producto (días hábiles), avisa que
es justa: el taller la revisa con prioridad, pero no prometas que llega.

## Cómo armar el enlace

Base: `https://www.inspiraarte.com/contacto/`. Parámetros de consulta, todos opcionales y
codificados con `encodeURIComponent` / `URLSearchParams`:

| Parámetro | Valor | Límite |
| --- | --- | --- |
| `producto` | `"{reference} · {name}"`, por ejemplo `IA-0273 · Trineo de Santa Claus…` | 200 caracteres |
| `ficha` | Ruta de la ficha con `/` final, por ejemplo `/productos/273-trineo-…/` | 300 caracteres |
| `produccion` | `productionTime` del producto | 80 caracteres |
| `envio` | `shippingTime` del producto | 80 caracteres |
| `cantidad` | Número de piezas | |
| `fecha` | `AAAA-MM-DD` | 10 caracteres |
| `detalles` | Texto libre de personalización | |

Ejemplo:

```
https://www.inspiraarte.com/contacto/?producto=IA-0273+%C2%B7+Trineo+de+Santa+Claus&ficha=%2Fproductos%2F273-trineo-de-santa-claus-en-mdf-para-decoracion-navidena%2F&cantidad=30&fecha=2026-12-05&detalles=Con+el+nombre+de+cada+invitado
```

Para un diseño a la medida, omite `producto`, `ficha`, `produccion` y `envio`, y describe la idea en
`detalles` (medidas, material, cantidad de piezas distintas).

## Después

Dile a la persona que abra el enlace, revise los datos, agregue nombre y correo y envíe. El taller
responde por correo. Otros canales y horarios están en
`https://www.inspiraarte.com/mcp/business-info.json` (skill `informacion-del-taller`).

## En el navegador

Con WebMCP en el sitio, la herramienta `prepare_quote` arma y abre este mismo enlace; tampoco envía
nada.
