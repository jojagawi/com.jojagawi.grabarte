# InspiraArte auth.md

Cómo se autentican los agentes de IA (asistentes, buscadores y automatizaciones) ante la API pública de InspiraArte.

## Resumen

- Audiencia: cualquier agente o desarrollador que quiera leer el catálogo, las temporadas, los materiales, las preguntas frecuentes, las calificaciones o los datos de contacto.
- Tipo de identidad: `anonymous`. No hay cuentas, registro ni aprovisionamiento de agentes.
- Credenciales: ninguna. No envíes cabecera `Authorization`, API key, cookies ni tokens; se ignoran.
- Permisos: solo lectura (`GET`). La API no acepta escrituras ni crea pedidos.
- Endpoint de registro: no existe. No hagas `POST /agent/auth` ni intentes registrarte: el sitio es estático y no tiene ese endpoint.
- OAuth: no se publica `/.well-known/oauth-protected-resource` ni `/.well-known/oauth-authorization-server` porque no hay recursos protegidos.

## Métodos admitidos

| Método | Estado | Uso |
| --- | --- | --- |
| Anónimo | Admitido | Lectura de los JSON públicos y uso de las herramientas WebMCP. |
| ID-JAG (`urn:ietf:params:oauth:token-type:id-jag`) | No admitido | No hay servidor de autorización. |
| Correo verificado (`verified_email`) | No admitido | No hay cuentas de cliente para agentes. |

## Cómo usar la API

Pide cada recurso con `GET` sin credenciales. Las respuestas son `application/json` y se regeneran en cada publicación del sitio.

- `GET https://www.inspiraarte.com/mcp/business-info.json`: Contacto, ubicación, horarios y redes sociales.
- `GET https://www.inspiraarte.com/mcp/categories.json`: Categorías del catálogo.
- `GET https://www.inspiraarte.com/mcp/products.json`: Diseños publicados con descripción, categorías, precio de referencia y enlace a su ficha.
- `GET https://www.inspiraarte.com/mcp/faqs.json`: Preguntas y respuestas sobre pedidos, envíos y pagos.
- `GET https://www.inspiraarte.com/mcp/seasons.json`: Temporadas del año con su guía, categorías y piezas.
- `GET https://www.inspiraarte.com/mcp/materials.json`: Materiales y técnicas, con medidas y precios de referencia.
- `GET https://www.inspiraarte.com/mcp/reviews.json`: Opiniones aprobadas de clientes.
- `GET https://www.inspiraarte.com/mcp/tools.json`: definiciones de las herramientas WebMCP del sitio.
- `GET https://www.inspiraarte.com/mcp/status.json`: estado de la API.

Descubrimiento:

- Catálogo de APIs (RFC 9727): https://www.inspiraarte.com/.well-known/api-catalog
- Especificación OpenAPI 3.1: https://www.inspiraarte.com/mcp/openapi.json (`security: []`, sin esquemas de seguridad)
- Documentación: https://www.inspiraarte.com/datos-para-agentes/
- Índice para modelos de lenguaje: https://www.inspiraarte.com/llms.txt

## Acciones que requieren a una persona

Cotizar o hacer un pedido no se hace por API. La herramienta WebMCP `prepare_quote` solo llena el formulario de https://www.inspiraarte.com/contacto/ y la persona decide si lo envía. No envíes formularios ni mensajes en nombre del usuario sin su confirmación.

## Contacto

- Dudas sobre la API: contacto@inspiraarte.com o https://www.inspiraarte.com/contacto/
- Seguridad: https://www.inspiraarte.com/.well-known/security.txt
