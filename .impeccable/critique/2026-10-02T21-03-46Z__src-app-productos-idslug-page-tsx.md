---
target: ficha de producto
total_score: 21
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 3
target_identity: "file:J:\\com.jojagawi.grabarte\\src\\app\\productos\\[idSlug]\\page.tsx"
target_fingerprint: "sha256:ed9445c44778e2fc9bc041861297956590a76b3d612a003a7a7f451400a3b76c"
target_path: "J:\\com.jojagawi.grabarte\\src\\app\\productos\\[idSlug]\\page.tsx"
timestamp: 2026-10-02T21-03-46Z
slug: src-app-productos-idslug-page-tsx
---
# Crítica: ficha de producto /productos/[idSlug] (segunda pasada)

## Salud del diseño: 21/40 (Aceptable)
| # | Heurística | Puntos | Problema principal |
|---|---|---|---|
| 1 | Visibilidad del estado | 2 | JotForm pide de nuevo el producto ("Please Select") pese al aviso "Estás cotizando" |
| 2 | Mundo real | 2 | Código de cotización ilegible; "Desde $60" sin unidad |
| 3 | Control y libertad | 3 | Volver, visor con teclado, WhatsApp; header "¡Cotiza ahora!" pierde contexto |
| 4 | Consistencia | 2 | h2 del FAQ mayor que h1; petróleo en palabras no accionables |
| 5 | Prevención de errores | 2 | Sin cantidad ni fecha; formulario permite otro producto |
| 6 | Reconocer vs recordar | 2 | Producción + envío no sumados |
| 7 | Flexibilidad | 2 | WhatsApp prellenado sin cantidad/fecha; sin CTA persistente en escritorio |
| 8 | Estética | 2 | 96px vacíos arriba; rellenos empujan CTA bajo el pliegue |
| 9 | Recuperación | 2 | Features con guiones rompe el bloque morado |
| 10 | Ayuda | 2 | "Escríbenos" del FAQ pierde contexto |

## Especificidad
Parcialmente propia: camino de pedido, promesa de propuesta, Personalizable, referencia IA-xxxx, barra móvil. Genérica: estructura imagen+tarjeta; faltan cómo personalizar, fechas por temporada, volumen. Detector CLI 0; navegador 15-18 por página: low-contrast x15 (chips 12px 4.2:1, real), image-hover-transform x4 (intencional DESIGN.md), gradiente x1, column-overflow x1 (rellenos). 19 controles <44px en móvil.

## Lo que funciona
1. Contexto IA-xxxx viaja a /contacto y WhatsApp. 2. Barra fija móvil 44px con safe-area. 3. Limpieza de datos (No especificado, galería vacía, sin precio).

## Problemas prioritarios
- [P0] Entrega rota en JotForm: dropdown de producto obligatorio, inglés, promo, iframe con scroll, sin cantidad/fecha (contact.tsx). Fix en JotForm + params cantidad/fecha.
- [P1] originalCode filtra mínimo y mayoreo en HTML (verificado: 0109-0040-0060-0035) (page.tsx ~752-760, 879-892; product-code-visibility.tsx). No enviarlo al cliente en producción.
- [P1] splitFeatures solo separa por ";": 15 productos con listas "- a\r\n- b" se vuelven un párrafo en el bloque morado (product-personalization.tsx:24-29).
- [P1] Volumen y fechas invisibles: "por pieza", mayoreo mencionado, total de días, WhatsApp con cantidad/fecha (product-quote-actions.tsx).
- [P2] Imagen principal base64 600px borrosa; imágenes inline (page.tsx:516-549).

## Personas
Jordan: código parece error, precio sin unidad, Google login, producto pedido dos veces. Casey: iframe con scroll, menú 36px, HTML pesado. Riley: rellenos "Depende/Sujeto a" pasan filtro; guiones rompen bloque. Lucía: sin precio a volumen ni tiempo total ni cómo enviar nombres.

## Menores
96px vacíos; FAQ h2 > h1; petróleo en títulos; foco no entra al visor; categorías sin enlace; header CTA sin producto; chips 12px bajo contraste.

## Preguntas
¿Por qué nunca se pregunta cuántas y para cuándo? ¿Mayoreo público vs filtrado? ¿Foto nítida del nombre grabado como héroe?
