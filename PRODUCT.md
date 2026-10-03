# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Personas buscando un regalo**: compran una o pocas piezas personalizadas para una fecha (cumpleaños, Día de las madres, Navidad, aniversarios). Llegan buscando una idea y necesitan ver opciones reales y saber cómo pedirla.
- **Eventos**: organizadores de bodas, XV años, primeras comuniones, graduaciones y similares que necesitan recuerdos en cantidad para invitados, con fecha límite fija.
- **Empresas y marcas**: buscan artículos con su logo o identidad (corporativos, promocionales, regalos de fin de año), normalmente en volumen y con precio de mayoreo.

El trabajo de todos es el mismo: encontrar una pieza que se parezca a lo que imaginan, entender qué se puede personalizar y pedir una cotización.

Audiencia interna: el equipo de InspiraArte usa las páginas de administración (`/agregar`, `/productos/editar/[id]`, `/agregar/redaccion-seo`, `/catalogos/*`) para dar de alta y editar diseños. No son públicas para el cliente final.

## Product Purpose

Catálogo público de productos personalizados hechos con corte y grabado láser, impresión 3D y otros procesos. Su objetivo es que el visitante encuentre un diseño o una idea y solicite una cotización. No hay carrito ni pago en línea: el éxito es una solicitud de cotización o un contacto (formulario o WhatsApp) con suficiente contexto para producir.

## Positioning

- **Catálogo propio de diseños**: más de 200 diseños propios, muchos ya probados en producción. El cliente parte de una pieza real y la adapta, no de una hoja en blanco.
- **Variedad de materiales en un solo lugar**: MDF, termos, acrílico, metal, impresión 3D, papel, piedra, caucho y más.
- **Diseño a la medida**: antes de producir, el cliente recibe una propuesta de diseño personalizada para validar.

## Operating Context

- Flujo de pedido: idea → propuesta de diseño → validación → producción láser/3D → entrega en México (página `/proceso`).
- Contacto por formulario (`/contacto`), correo y WhatsApp. Precios mostrados como sugeridos o "bajo cotización".
- Mercado: México, contenido en español (es-MX). Base: Ciudad de México.
- Las fechas pesan: muchas compras están ligadas a una temporada o a un evento con fecha fija (categorías como Navidad, Día de muertos, Día de las madres, Boda, XV años, Graduación).
- El equipo administra el catálogo en SQLite. Los archivos (vistas previas, imágenes, instrucciones y archivos fuente como SVG, LightBurn, PDF o DXF) viven en S3 y se sirven desde un CDN.

## Capabilities and Constraints

- **Sitio estático**: Next.js 16 (App Router) con `output: "export"`, desplegado en AWS S3 + CloudFlare CDN. No hay servidor en producción: todo lo dinámico se resuelve en el build o en el cliente.
- **Catálogo**: 219 diseños en la base, de los cuales 43 se muestran en el sitio (`showInSite`) y 47 están marcados como probados. 11 materiales y 71 categorías. Un diseño tiene un material y varias categorías.
- **Ficha de producto** (`/productos/[idSlug]`): descripción, características, beneficios, casos de uso, público, FAQ, tiempos de producción y envío, dimensiones, precio sugerido, mayoreo y precio mínimo.
- **Otras páginas**: FAQ, testimonios y calificaciones (Athena), aviso de privacidad, términos y condiciones.
- Se publican datos para agentes de IA (`llms.txt` y JSON de respaldo en `public/mcp/`).
- Integración en curso con HubSpot (objeto Productos) para el CRM.
- **Pendiente de decidir**: el catálogo de tipos de diseño (`CatDesignsType`) existe pero está vacío.

## Brand Commitments

- Nombre: **InspiraArte**. Lema en uso: "Personalización sin límites: del diseño a la realidad".
- Logo: `public/logo.png` y variantes en `public/dam/logos/`.
- Voz: español de México, cercana y clara, orientada a regalos y ocasiones especiales.

## Evidence on Hand

- Catálogo real de diseños con imágenes en S3/CDN (`preview/<id>.webp`).
- 1 testimonio activo en la tabla `testimonials`, y calificaciones de clientes en Athena.
- 8 preguntas frecuentes en la tabla `Faqs`.
- **No existen** y no deben inventarse: clientes corporativos con nombre, logos de marcas, cifras de pedidos, premios, prensa ni testimonios adicionales.

## Product Principles

1. **Lo real primero**: mostrar diseños y fotos de piezas reales. El catálogo propio es la prueba más fuerte, por encima de cualquier promesa.
2. **Cada página lleva a cotizar**: el visitante siempre debe saber cuál es el siguiente paso y cómo contactar, con el contexto del producto que estaba viendo.
3. **Personalizable a la vista**: dejar claro qué se puede cambiar (nombre, logo, material, tamaño) para que el cliente imagine su versión.
4. **Tres públicos, un catálogo**: regalo individual, evento y empresa deben encontrar su camino (ocasión, cantidad, mayoreo) sin catálogos separados.
5. **Las fechas importan**: los tiempos de producción y envío deben verse antes de que el cliente se comprometa.
