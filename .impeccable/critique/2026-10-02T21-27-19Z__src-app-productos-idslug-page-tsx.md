---
target: ficha de producto
total_score: 27
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 2
target_identity: "file:J:\\com.jojagawi.grabarte\\src\\app\\productos\\[idSlug]\\page.tsx"
target_fingerprint: "sha256:2a5686555eb46afdc33fc41443520fd3dd8771644d4626ec76e3859aa206ca93"
target_path: "J:\\com.jojagawi.grabarte\\src\\app\\productos\\[idSlug]\\page.tsx"
timestamp: 2026-10-02T21-27-19Z
slug: src-app-productos-idslug-page-tsx
closed: true
---
# Crítica: ficha de producto /productos/[idSlug] (tercera pasada)

## Salud del diseño: 27/40 (Aceptable)
| # | Heurística | Puntos | Problema principal |
|---|---|---|---|
| 1 | Visibilidad | 3 | Banner "Estás cotizando" confirma; falta tiempo/canal de respuesta |
| 2 | Mundo real | 3 | "Desde $60" sin unidad; código cifrado es jerga |
| 3 | Control | 3 | Volver, visor con Esc/flechas/foco |
| 4 | Consistencia | 2 | JotForm rompe el sistema; header y "Escríbenos" pierden contexto |
| 5 | Prevención | 2 | JotForm re-pide producto; sin cantidad ni fecha |
| 6 | Reconocer | 3 | Qué se personaliza ~1500px bajo la acción |
| 7 | Flexibilidad | 3 | WhatsApp con cantidad/fecha; barra fija |
| 8 | Estética | 3 | Código público; encabezados de landing en FAQ/relacionados |
| 9 | Recuperación | 2 | Datos faltantes omitidos sin explicación |
| 10 | Ayuda | 3 | FAQ por producto; nada de volumen/mínimos |

## Especificidad
~70% propia arriba del pliegue; abajo encabezados genéricos; JotForm rompe el sistema. Detector CLI 0; navegador 2-3 por página (antes 15-18): low-contrast eliminado; quedan image-hover-transform (intencional), gradiente de fondo de foto, column-overflow en productos con muchos datos, layout-transition probable FP. 0 códigos de precio en HTML. Sin overflow ni errores de consola.

## Lo que funciona
Barra fija móvil; contexto IA-XXXX a /contacto y WhatsApp (con cantidad/fecha); disciplina del sistema y visor accesible.

## Problemas prioritarios
- [P0] Formulario pierde producto/cantidad/fecha (JotForm: campo producto texto con nombre único, cantidad, fecha, español; repo: pasar cantidad/fecha) — contact.tsx.
- [P1] /contacto esconde el formulario en móvil (~760px) e iframe minHeight 780 con scroll interno; reordenar si hay ?producto=, auto-resize JotForm, repetir garantías — contact.tsx:491-551.
- [P1] Volumen sin señal: unidad del precio, línea de mayoreo sin cifra — product-quote-actions.tsx:59-70.
- [P2] Qué se personaliza lejos de la decisión: línea "Puedes personalizar" bajo la etiqueta — page.tsx:~791.
- [P2] Barra fija tapa enlaces legales del footer; header y "Escríbenos" sin producto; código cifrado público (decisión del usuario mantenerlo).

## Personas
Jordan: código, Google login, producto re-preguntado. Casey: /contacto 2 pantallas + iframe con scroll; barra tapa legales. Riley: maneja bien extremos; datos largos forman muro. Lucía: falla volumen, tiempo para 120, cómo enviar nombres; WhatsApp sí funciona.

## Menores
mb vs space-y frágil; relacionadas sin etiqueta Personalizable; token --inspirarte-purple-deep sin uso; hex en contact y footer; footer con spans tipo enlace; object-cover recorta.

## Preguntas
¿WhatsApp como acción principal? ¿Mayoreo público? ¿Formulario propio en lugar de iframe?
