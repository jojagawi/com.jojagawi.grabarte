---
target: página de inicio
total_score: 21
max_score: 36
na_heuristics: 7
p0_count: 1
p1_count: 3
target_identity: "file:J:\\com.jojagawi.grabarte\\src\\app\\page.tsx"
target_fingerprint: "sha256:9ef6406ad3ef1c2be9def77bd92e0367063a87c63c6b7ff6061f04f3e77fd8a4"
target_path: "J:\\com.jojagawi.grabarte\\src\\app\\page.tsx"
timestamp: 2026-10-03T03-57-03Z
slug: src-app-page-tsx
closed: true
---
# Crítica: página de inicio / (primera pasada)

## Salud del diseño: 21/36 (Aceptable, 58%) — H7 n/a (landing)
| # | Heurística | Puntos | Problema principal |
|---|---|---|---|
| 1 | Visibilidad | 2 | Sin tiempos de respuesta ni producción |
| 2 | Mundo real | 3 | "FAQ"; marquesina con taxonomía cruda y erratas |
| 3 | Control | 3 | Marquesina sin pausa |
| 4 | Consistencia | 2 | 3 etiquetas para /contacto; verde WhatsApp compite con petróleo |
| 5 | Prevención | 2 | CTA sin contexto de producto; tiles del hero no enlazan |
| 6 | Reconocer | 2 | Hay que recordar la pieza del hero; categorías no enlazan |
| 7 | Flexibilidad | n/a | Landing |
| 8 | Estética | 3 | Capas decorativas apiladas |
| 9 | Recuperación | 2 | 0 testimonios = rejilla vacía; Athena sin try/catch rompe build |
| 10 | Ayuda | 2 | Sin mínimos, precios ni tiempos en home |

## Especificidad
Intercambiable: hero + 3 pasos + testimonios. Faltan catálogo (3 de 43), materiales (copy solo MDF), "Personalizable", ocasiones y fechas. Detector: 2 avisos design-system-color en process.tsx:11 (#4290A3) y :27 (#3ACBFE); además #1FA4A7 y #00B003 sin reportar.

## Problemas prioritarios
- [P0] Tiles del hero no enlazan ni cotizan (hero.tsx:130-175) → Link a /productos/[idSlug], chip Personalizable, "Cotizar este diseño". layout/clarify
- [P1] Eventos y empresas invisibles → sección de 3 puertas Regalo/Evento/Empresa con /productos filtrado. shape
- [P1] Marquesina: sin reduced-motion, sin aria-hidden (~290 ítems), no clicable, erratas → chips de ocasión estáticos enlazados. distill
- [P1] Fechas/tiempos ausentes en el punto de decisión → línea factual junto a CTAs. clarify
- [P2] Contraste y deriva de color en process.tsx (badges, eyebrow teal, white/80 sobre degradado, WhatsApp #00B003) → tokens petróleo/carbón. colorize/audit

## Personas
Jordan: login Google sin propósito; 3 CTAs distintos; FAQ jerga. Casey: sin CTA visible en header móvil; marquesina absolute puede solapar; LCP lazy; HTML 438 KB por base64 duplicado. Riley: 0/1 diseños repiten imagen; 3 testimonios en grid de 4; Athena caída rompe build; iniciales largas. Organizadora de boda: nada de bodas, volumen ni fechas arriba del pliegue.

## Menores
Acentos (Diseno, cotizacion, Catalogo, calificacion, dafault-image); layout.tsx:81 className sin espacio pierde bg-background; h3 en sans vs regla serif; pasos y testimonios se elevan sin ser clicables; cierre de página = "Agregar mi calificación".

## Preguntas
1. ¿Por qué 3 piezas al azar y ninguna exploración por ocasión/material/público?
2. ¿Y un hero pensado primero para la organizadora de boda?
3. ¿El cierre debe ser "califícanos" o "cotiza lo que viste"?
