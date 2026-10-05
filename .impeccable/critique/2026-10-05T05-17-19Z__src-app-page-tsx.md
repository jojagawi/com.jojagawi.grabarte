---
target: página de inicio
total_score: 23
max_score: 36
na_heuristics: 7
p0_count: 0
p1_count: 3
target_identity: "file:J:\\com.jojagawi.grabarte\\src\\app\\page.tsx"
target_fingerprint: "sha256:8014729da864c9dc8bca5b3a5cf19b4171dc64d5f0ef6727c12cf1028347c23e"
target_path: "J:\\com.jojagawi.grabarte\\src\\app\\page.tsx"
timestamp: 2026-10-05T05-17-19Z
slug: src-app-page-tsx
closed: true
---
# Crítica: página de inicio / (segunda pasada)

## Salud del diseño: 23/36 (Aceptable, 64%) — H7 n/a (landing). Antes: 21/36
| # | Heurística | Puntos | Problema principal |
|---|---|---|---|
| 1 | Visibilidad | 2 | Carrusel de 21 sin posición; sin controles en móvil |
| 2 | Mundo real | 3 | "impresión láser", sin 3D; Día de muertos termina el 31 oct |
| 3 | Control | 3 | Teclado atraviesa 21 enlaces sin saltar carrusel |
| 4 | Consistencia | 2 | h3 Playfair vs sans; #3ACBFE en footer; teal como texto |
| 5 | Prevención | 2 | Sin anticipación para volumen; temporada congelada sin rebuild |
| 6 | Reconocer | 3 | Checklist de puertas no llega a /contacto |
| 7 | Flexibilidad | n/a | Landing |
| 8 | Estética | 2 | ~7 clicables arriba del pliegue; "24 horas" ×3 |
| 9 | Recuperación | 3 | Respaldos sólidos y silenciosos |
| 10 | Ayuda | 3 | Pasos sin duración |

## Especificidad
Centro autoral (temporada, puertas, Personalizable); hero y testimonios siguen siendo plantilla. Detector: 0 hallazgos (general y layout). Extra: #3ACBFE ×8 en footer.tsx; hex en hero.tsx:213 y testimonials.tsx:140,144 son comentarios (falsos positivos).

## Problemas prioritarios
- [P1] Sin plazo para pedidos en volumen en puertas ni proceso; checklist no se repite en /contacto. Requiere dato real del dueño. clarify
- [P1] Temporada: Día de muertos termina 31 oct (seasons.ts:74); título de 3 ocasiones desde 11 oct; congelada sin rebuild. harden
- [P1] Hero base64 duplicado (~200 KB de 406–468 KB) y protocolo http por defecto. optimize
- [P2] Hero genérico/inexacto: "100% personalizados", termos/llaveros/impresión láser, destacado aleatorio fuera de temporada; íconos sin aria-hidden. clarify/bolder (requiere aprobación)
- [P2] main envuelve Header/Footer; smooth scroll sin reduced-motion; sin skip links; aria-label duplicado en carrusel; footer con spans tipo enlace. audit/harden

## Personas
Jordan: no sabe materiales ni precios; "Personalizable" sin explicar. Casey: pieza fuera del primer pantallazo; Cotizar fuera del pulgar; carrusel sin controles móviles. Riley: Día de muertos se va el 1 nov; h2 duplicado en respaldo; WhatsApp del proceso sin mensaje. Boda: sin piezas de boda; sin plazo; "500 piezas" sin respaldo fuera de la banda original.

## Menores
"24 horas" ×3; contraste de píldoras al límite; lang es → es-MX; login Google en header público; alineación de títulos mixta; estrellas en verde; OG alt "Catalogo"; cierre en "Agregar mi calificación".

## Preguntas
1. ¿Por qué el destacado del hero es aleatorio y no de temporada?
2. ¿Puertas arriba del carrusel o como segundo CTA del hero?
3. ¿Hero con promesa de fecha?
