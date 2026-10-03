---
target: ficha de producto
total_score: 15
max_score: 40
na_heuristics: 
p0_count: 2
p1_count: 2
target_identity: "file:J:\\com.jojagawi.grabarte\\src\\app\\productos\\[idSlug]\\page.tsx"
target_fingerprint: "sha256:c822851ec171a70b799723d52e1365359a58ede4dc41bb4ab4ba4113be5d23e9"
target_path: "J:\\com.jojagawi.grabarte\\src\\app\\productos\\[idSlug]\\page.tsx"
timestamp: 2026-10-02T20-07-20Z
slug: src-app-productos-idslug-page-tsx
closed: true
---
# Crítica: ficha de producto /productos/[idSlug]

## Salud del diseño: 15/40 (Pobre)
| # | Heurística | Puntos | Problema principal |
|---|---|---|---|
| 1 | Visibilidad del estado | 2 | Sin estado de disponibilidad ni tiempo de entrega; availability sin usar |
| 2 | Mundo real | 1 | "Codigo" muestra precio cifrado; faltan acentos |
| 3 | Control y libertad | 3 | Volver a productos; visor con Esc/flechas |
| 4 | Consistencia | 1 | 4 azules; degradados verde/olivo decorativos; secciones anidadas |
| 5 | Prevención de errores | 1 | No se ve tiempo de producción antes de comprometer fecha |
| 6 | Reconocer vs recordar | 1 | /contacto no recibe el producto |
| 7 | Flexibilidad | 1 | Sin WhatsApp prellenado ni atajo de volumen |
| 8 | Estética | 2 | Formulario etiqueta/valor; estados vacíos públicos |
| 9 | Recuperación | 2 | 404 y redirección de slug bien |
| 10 | Ayuda | 1 | Único contacto en cuerpo está en FAQ condicional |

## Especificidad
LLM: no; vista de registro admin hecha pública; sin personalización, propuesta previa, fechas ni camino de mayoreo. Detector: 0 hallazgos en 7 archivos; greps: 12 líneas con hex fijos (4 colores), 2 text-xs.

## Lo que funciona
1. Visor de imágenes accesible por teclado. 2. Redirección canónica + JSON-LD completo. 3. Tarjetas relacionadas cumplen Lift On Interest.

## Problemas prioritarios
- [P0] Sin acción de cotizar ni contexto del producto (page.tsx:808-917, header.tsx:183). Fix: botón "Cotizar este diseño" -> /contacto?producto={id} prellenado + WhatsApp prellenado; barra fija en móvil.
- [P0] Precio, mayoreo, tiempos y medidas consultados (page.tsx:405-422) pero solo en JSON-LD (634-642). Fix: "Desde $X", "Mayoreo desde $Y c/u", franja Producción/Envío/Medidas, fallback "Precio bajo cotización".
- [P1] Código de precio cifrado público como "Codigo" (page.tsx:820-831); JSON-LD expone precios igualmente. Fix: "Ref. IA-0123"; código cifrado solo admin.
- [P1] Personalización invisible: sin etiqueta morada, sin lista de qué se personaliza, sin mini proceso. Fix junto al h1 (page.tsx:796-808).
- [P2] Deuda de color (#3ACBFE fuera de DESIGN.md), degradados decorativos (page.tsx:55-60), py-24 anidados (925-926, faq.tsx:256), tarjeta en tarjeta (861), FAQ max-h-96 y sin aria-expanded.

## Personas
Jordan: no sabe precio ni cómo pedir; código parece error. Casey: CTA en hamburguesa; imágenes base64 en HTML; logo lazy. Riley: sin precio no hay mensaje; vacío duplicado; FAQ no parseado desaparece; relacionados aleatorios. Lucía (boda 120 pzas): sin precio unitario/mayoreo/tiempos; debe re-describir producto.

## Menores
Píldora de sección como etiqueta; relacionadas sin precio/material; doble "Cerrar visor"; subtítulos vacíos; footer con spans tipo enlace.

## Preguntas
¿A quién protege ocultar precio y tiempo? ¿Y si se diseñara primero para 120 piezas? ¿Por qué no aparece la personalización?
