---
target: /contacto
total_score: 31
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
target_identity: "file:J:\\com.jojagawi.grabarte\\src\\components\\custom\\contact.tsx"
target_fingerprint: "sha256:a2e79024893103f21d3c117d244b992a3cbebc249b67c5bed0b2c49b10362c97"
target_path: "J:\\com.jojagawi.grabarte\\src\\components\\custom\\contact.tsx"
timestamp: 2026-10-06T23-34-56Z
slug: src-components-custom-contact-tsx
---
# Crítica: /contacto (contact.tsx), cuarta pasada

## Salud del diseño: 31/40 (Bueno)
| # | Heurística | Puntos | Problema principal |
|---|---|---|---|
| 1 | Visibilidad | 3 | "Enviando…" solo en el botón; "2 de 5" críptico |
| 2 | Mundo real | 3 | Fecha de evento vs entrega; aviso abre con aritmética |
| 3 | Control | 4 | Deshacer producto, quitar archivos, datos conservados, otra solicitud |
| 4 | Consistencia | 3 | Olivo usado como advertencia; WhatsApp en 5 lugares |
| 5 | Prevención | 3 | Aviso "no alcanza" saca del formulario |
| 6 | Reconocer | 3 | En móvil la tranquilidad queda tras el botón |
| 7 | Flexibilidad | 3 | WhatsApp no lleva detalles ni lista |
| 8 | Estética | 2 | Modo evento con cuatro textos sobre la lista; aviso de fecha ~240px en móvil |
| 9 | Recuperación | 4 | Ejemplar |
| 10 | Ayuda | 3 | Sin guía de exactitud de cantidad ni si la respuesta trae precio |

## Especificidad
~75% propia (tarjeta con foto y enlace, tiempos reales, cálculo de días, modo evento, plantilla, WhatsApp con contexto); esqueleto visual y bloque de contacto intercambiables; sin producto, genérica. Detector CLI 0; navegador layout-transition y nested-cards, ambos falsos positivos (Google Identity; zona con onDrop real). Sin overflow, 0 errores, h1 por contexto, enlace interno a ficha, 3 aria-current (2 visibles a la vez en escritorio). Drop de .csv por CDP falló en A (en pasada previa sí funcionó): verificar a mano.

## Lo que funciona
El contexto viaja; las fechas importan hecho bien; oficio de estados.

## Problemas prioritarios
- [P1] Aviso de fecha corta saca del formulario y pierde contexto — "Envía y la revisamos primero", urgent:true a la Lambda, WhatsApp con detalles.
- [P1] Sin tranquilidad junto a Enviar en móvil — línea bajo el botón con sin costo / 24 h / propuesta antes de producir.
- [P2] Fecha ambigua y cálculo difícil — etiqueta clara, conclusión primero, desglose secundario.
- [P2] Modo evento redundante, plantilla al final — un solo bloque antes de la zona de archivos.
- [P3] Recordatorio salta sobre el campo enfocado; rechazo de archivo sin motivo ni anuncio; "2 de 5".

## Personas
Jordan: sin pieza real, no sabe si hay precio. Sam: recordatorio se anuncia y mueve contenido; error de archivo mudo. Casey: aviso empuja la página; salto con teclado. Lucía: sin fecha de evento, WhatsApp sin lista, sin folio.

## Menores
WhatsApp como primer CTA; "Los campos con *" al inicio; dos aria-current visibles; placeholder de correo parece valor.

## Preguntas
¿Urgente en vez de WhatsApp? ¿Piezas reales sin producto? ¿Cantidad y fecha primero y obligatorias con "Aún no sé"?
