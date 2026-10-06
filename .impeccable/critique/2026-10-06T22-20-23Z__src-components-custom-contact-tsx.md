---
target: /contacto
total_score: 31
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
target_identity: "file:J:\\com.jojagawi.grabarte\\src\\components\\custom\\contact.tsx"
target_fingerprint: "sha256:25972b57c44d7959f62d5f3f52ee9a4e04af46c6f30349e2a946d2bbb405ae72"
target_path: "J:\\com.jojagawi.grabarte\\src\\components\\custom\\contact.tsx"
timestamp: 2026-10-06T22-20-23Z
slug: src-components-custom-contact-tsx
closed: true
---
# Crítica: /contacto (contact.tsx), tercera pasada

## Salud del diseño: 31/40 (Bueno)
| # | Heurística | Puntos | Problema principal |
|---|---|---|---|
| 1 | Visibilidad | 3 | En éxito el H1 y la intro siguen en modo "antes" |
| 2 | Mundo real | 3 | "Fecha justa" suaviza cuando la fecha no alcanza |
| 3 | Control | 3 | "Enviar otra" conserva el producto; tarjeta sin enlace a la ficha |
| 4 | Consistencia | 3 | Producto duplicado en éxito; "Cotizar" del header lleva a la página actual |
| 5 | Prevención | 3 | Aviso de fecha solo con producto y sin considerar cantidad |
| 6 | Reconocer | 3 | Recordatorio ~900px lejos de cantidad/fecha |
| 7 | Flexibilidad | 3 | Sin distinguir fecha de evento vs entrega |
| 8 | Estética | 3 | Cinco salidas a WhatsApp; intro con producto |
| 9 | Recuperación | 4 | Ejemplar: foco, "Faltan N", datos conservados, WhatsApp con datos |
| 10 | Ayuda | 3 | En móvil la tranquilidad queda bajo el botón |

## Especificidad
Formulario propio (miniatura, tiempos, aviso de fecha, ocasiones, plantilla CSV, resumen); marco genérico (H1, intro, píldora, "escríbenos directo") que contradice la tarjeta con producto. Detector CLI 0; navegador: layout-transition (falso positivo, Google Identity) y nested-cards en zona de adjuntos (discutible: punteado sugiere arrastrar y soltar inexistente). Sin overflow, 0 errores, 1 h1, 0 role=status al cargar, CSV 200 con BOM.

## Lo que funciona
Fecha contra tiempos reales; recuperación de errores y continuidad de canal; modo evento con divulgación progresiva.

## Problemas prioritarios
- [P1] Marco sin contexto de producto ni de éxito — contact.tsx H1/intro; título según contexto, intro oculta con producto, "Solicitud enviada" en éxito.
- [P1] Aviso de fecha minimiza y no escala — dos niveles (justa / no alcanza), días de aprobación, volumen >50.
- [P2] Recordatorio de cantidad/fecha tarde y lejos con doble envío — en línea junto a los campos o un solo botón.
- [P2] Flujo de lista de nombres frágil — ejemplo de evento en Detalles, revisión de nombres (confirmar), nombres de archivo en éxito.
- [P3] Redundancias — producto duplicado en éxito, "Cotizar otro producto", Cotizar del header como página actual, zona punteada sin arrastrar.

## Personas
Jordan: selects largos, tranquilidad bajo el botón en móvil. Sam: "*" leído, foco no va al recordatorio. Casey: formulario ~1500px, recordatorio obliga a subir. Lucía: aviso ignora cantidad, sin fecha de evento, plantilla tardía, éxito sin nombre de archivo.

## Menores
"enviarla" sin antecedente; botón no dice "Reintentar"; "Fecha justa" en olivo con poco peso; tarjeta sin enlace a ficha; verificar Administrar/Google en producción.

## Preguntas
¿Cantidad y fecha obligatorias con producto? ¿Fecha calculada hacia atrás desde el evento? ¿Lista de nombres como campo propio?
