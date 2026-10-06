---
target: /contacto
total_score: 26
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
target_identity: "file:J:\\com.jojagawi.grabarte\\src\\components\\custom\\contact.tsx"
target_fingerprint: "sha256:255899492c3f4e2ad47b2039273eebd38181ada1a31d19ec18fbf933eb31879b"
target_path: "J:\\com.jojagawi.grabarte\\src\\components\\custom\\contact.tsx"
timestamp: 2026-10-06T17-06-47Z
slug: src-components-custom-contact-tsx
closed: true
---
# Crítica: /contacto (contact.tsx)

## Salud del diseño: 26/40 (Aceptable)
| # | Heurística | Puntos | Problema principal |
|---|---|---|---|
| 1 | Visibilidad | 3 | Estados subir/enviar bien; foco se pierde en éxito |
| 2 | Mundo real | 2 | Ocasión sin XV años/Comunión/Bautizo/Navidad; "Corporación" |
| 3 | Control | 3 | Producto no se recupera tras la X; X visible tras éxito |
| 4 | Consistencia | 3 | bg-white vs Papel Cálido; #00B003 en contact-methods; Email/correo |
| 5 | Prevención | 2 | Fecha acepta pasado; detalles corta a 2000 sin contador |
| 6 | Reconocer | 3 | Banner conserva producto, sin imagen |
| 7 | Flexibilidad | 2 | WhatsApp sin texto prellenado |
| 8 | Estética | 3 | Tarjeta en tarjeta; ~60px muertos antes de Enviar |
| 9 | Recuperación | 3 | Errores claros; respaldo WhatsApp sin contexto |
| 10 | Ayuda | 2 | Sin guía de buena solicitud, tiempos ni privacidad junto a Enviar |

## Especificidad
Casi intercambiable: columna izquierda plantilla (píldora, H2, 3 mosaicos, 3 chips). Propio: banner "Estás cotizando", placeholders, éxito con propuesta. Falta foto del producto y proceso/tiempos reales. Detector CLI 0; navegador 1 layout-transition (falso positivo, CSS de Google Identity). Sin overflow ni errores de consola.

## Lo que funciona
Arquitectura de estados y foco a primer inválido; contexto de producto (banner, select oculto, formulario primero en móvil); microcopy es-MX concreto.

## Problemas prioritarios
- [P1] WhatsApp sin contexto de producto — contact-methods.tsx:34 y enlace de error en contact-form.tsx; usar ?text= con referencia, cantidad y fecha; WhatsApp secundario junto al banner.
- [P1] Fecha sin min ni guía de tiempos de producción — contact-form.tsx campo neededBy; min=hoy, hint de producción, aviso si es justa, subir fecha/cantidad.
- [P1] Eventos con lista de nombres sin canal — ocasiones del catálogo, aceptar xlsx/csv/txt/docx, contador de caracteres, hint de lista.
- [P2] Éxito sin seguridad — foco al título, resumen producto/cantidad/fecha, ocultar X, WhatsApp urgente, seguir catálogo.
- [P2] Sin H1 y página genérica — contact.tsx:41 h2→h1; miniatura y título con producto; pasos reales en lugar de chips; agrupar formulario.

## Personas
Jordan: select de 5 tipos ajeno al catálogo, sin /proceso. Sam: 11 tabs antes de Nombre, sin skip link ni H1, "*" solo, foco perdido en éxito. Casey: X 32px, texto de archivo truncado, WhatsApp bajo el formulario. Lucía: sin XV años, sin Excel, texto cortado, fecha sin viabilidad, éxito sin confirmar fecha.

## Menores
Overflow del banner con cadena larga sin espacios (668/390; min-w-0 u overflow-wrap:anywhere); Cantidad huérfana en escritorio al ocultar select de producto; teléfono opcional pero se promete WhatsApp; "Enviando…" duplicado; chips redundantes; Administrar/Iniciar con Google en formulario público.

## Preguntas
¿WhatsApp prellenado como acción principal en móvil? ¿Preguntar fecha y cantidad primero con viabilidad inmediata? ¿Qué distingue esta página sin una pieza real en pantalla?
