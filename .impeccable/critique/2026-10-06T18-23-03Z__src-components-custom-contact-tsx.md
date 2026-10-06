---
target: /contacto
total_score: 27
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
target_identity: "file:J:\\com.jojagawi.grabarte\\src\\components\\custom\\contact.tsx"
target_fingerprint: "sha256:c884e3b6aeba0e564396725401508b796ff0518e2cf75065f35690947a22e0df"
target_path: "J:\\com.jojagawi.grabarte\\src\\components\\custom\\contact.tsx"
timestamp: 2026-10-06T18-23-03Z
slug: src-components-custom-contact-tsx
closed: true
---
# Crítica: /contacto (contact.tsx), segunda pasada

## Salud del diseño: 27/40 (Aceptable)
| # | Heurística | Puntos | Problema principal |
|---|---|---|---|
| 1 | Visibilidad | 3 | Tras enviar, tarjeta y "Qué sigue" no cambian de estado |
| 2 | Mundo real | 3 | Cantidad con teclado numérico vs "120 piezas" |
| 3 | Control | 3 | Quitar/volver bien; tras "Enviar otra" no se cambia de producto |
| 4 | Consistencia | 3 | Selector de archivos nativo truncado en móvil |
| 5 | Prevención | 2 | Cantidad y fecha opcionales; aviso de fecha justa sin peso |
| 6 | Reconocer | 3 | Éxito omite ocasión, adjuntos y correo de respuesta |
| 7 | Flexibilidad | 3 | WhatsApp con borrador; sin modo evento |
| 8 | Estética | 3 | WhatsApp en cuatro sitios; contador siempre visible |
| 9 | Recuperación | 2 | Error de red: foco a body, línea roja suelta |
| 10 | Ayuda | 3 | Aviso de fecha justa menciona WhatsApp sin enlace |

## Especificidad
Contenido propio (miniatura, tiempos reales, ocasiones del catálogo, listas, WhatsApp con contexto); visual intercambiable; H1 no cambia con producto. Detector CLI 0; navegador 1 layout-transition en body (falso positivo: CSS de Google Identity). Sin overflow, 0 errores, 1 h1, miniatura carga. Campos de 40px marcados como objetivos chicos: conformes a DESIGN.md.

## Lo que funciona
Contexto de la ficha completo con quitar/volver y foco; formulario pedido→datos con fieldset/legend y foco al primer inválido; continuidad de canal WhatsApp.

## Problemas prioritarios
- [P1] Aviso de fecha justa sin acción — contact-form.tsx bloque isTightDate; caja con ícono, cifras de días, enlace WhatsApp.
- [P1] Error de envío sin recuperación — role=alert con foco, "Tus datos siguen aquí", WhatsApp secundario no rojo, aria-disabled en lugar de disabled.
- [P1] Cantidad y fecha opcionales sin peso — marcar recomendadas, aviso suave al enviar vacías, permitir texto en cantidad.
- [P2] Página no cambia tras enviar — tarjeta "Cotizaste", primer paso hecho, correo y adjuntos en resumen.
- [P2] Lista de nombres en bloque genérico — zona de carga propia, destacar en eventos o cantidad >10, plantilla CSV.

## Personas
Jordan: dos CTA compiten; material pide conocimiento técnico. Sam: foco perdido en error; tarjeta role=status se anuncia completa; sin resumen de errores. Casey: Enviar a ~1540px; X en esquina superior. Lucía: aviso sin cifras ni enlace; teclado numérico; éxito no confirma lista; XV años no adapta el formulario.

## Menores
Nombre >200 se corta sin elipsis; hueco bajo cantidad en escritorio; contador siempre visible; correo/teléfono sin estilo de enlace; teléfono solo en media fila.

## Preguntas
¿Fecha primero con viabilidad en vivo? ¿Modo evento al elegir ocasión o cantidad >10? ¿Qué gana el negocio con dos canales de igual peso?
