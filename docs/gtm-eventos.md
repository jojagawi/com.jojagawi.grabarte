# Eventos de GTM del sitio público

Todos los eventos se envían al `dataLayer` con `sendGTMEvent` (vía `trackEvent` en
`src/lib/analytics.ts`). Los nombres siguen el estilo de GA4: `snake_case`, objeto_acción.
El contenedor (activadores, variables y etiquetas) se configura a mano en GTM.

## Inventario: interacción → evento

| Interacción | Dónde | Evento | Estado |
|---|---|---|---|
| Carga del formulario de cotización | `/contacto` | `form_contact_load` | ya existía |
| Primer campo tocado del formulario de cotización | `/contacto` | `form_contact_start` | **nuevo** |
| Aviso de cantidad/fecha faltantes | `/contacto` | `form_contact_nudge` | ya existía |
| Envío con campos inválidos | `/contacto` | `form_contact_error` (`error_type: validation`) | **nuevo** |
| Error de subida/envío/configuración | `/contacto` | `form_contact_error` | ya existía |
| Envío del formulario | `/contacto` | `form_contact_send` | ya existía |
| Cotización guardada (conversión) | `/contacto` | `form_contact_saved` | ya existía |
| Quitar / volver a agregar el producto cotizado | `/contacto` | `quote_product_remove` / `quote_product_restore` | **nuevo** |
| Carga del formulario de calificación | `/agregar-calificacion`, `/calificaciones/nueva` | `form_rate_load` | ya existía |
| Primer campo tocado del formulario de calificación | mismas | `form_rate_start` | **nuevo** |
| Envío / guardado / error de calificación | mismas | `form_rate_send` / `form_rate_saved` / `form_rate_error` | ya existía |
| Abrir / cerrar pregunta de FAQ | `/faq`, fichas, categorías, temporadas | `faq_open` / `faq_close` | **nuevo** |
| Filtro de categoría (botones) | `/productos` | `category_select` (`selection_method: filter`) | **nuevo** |
| Enlace a página de categoría | `/productos`, fichas | `category_select` (`selection_method: link`) | **nuevo** |
| Clic en tarjeta de producto | hero, vitrina, catálogo, relacionados | `select_item` | **nuevo** |
| Vista de ficha de producto | `/productos/[id]` | `view_item` | **nuevo** |
| Abrir visor de imágenes | ficha | `gallery_open` | **nuevo** |
| Siguiente / anterior en el visor | ficha | `gallery_navigate` | **nuevo** |
| Reproducir video del diseño | ficha | `video_play` | **nuevo** |
| Botones "Cotizar" (header, hero, ficha, barra móvil, eventos/empresas, temporada, 404…) | todo el sitio | `quote_click` | **nuevo** |
| Botones / enlaces de WhatsApp | todo el sitio | `whatsapp_click` | **nuevo** |
| Enlace de correo (`mailto:`) | footer, contacto, gracias | `email_click` | **nuevo** |
| Enlace de teléfono (`tel:`) | `/gracias` | `phone_click` | **nuevo** |
| Redes sociales | footer, `/gracias` | `social_click` | **nuevo** |
| Otros enlaces externos | guías, contenido | `outbound_click` | **nuevo** |
| Descarga de archivos | ficha | `download_click` | **nuevo** |
| Enlace a una temporada | header, vitrina, `/temporada` | `season_select` | **nuevo** |
| Navegación de header, footer y menú móvil | todo el sitio | `navigation_click` | **nuevo** |
| Abrir menú móvil | todo el sitio | `menu_open` | **nuevo** |
| Flechas de la vitrina de temporada | portada | `carousel_scroll` | **nuevo** |
| Aceptar / rechazar cookies en el banner | todo el sitio | `consent_update` | **nuevo** |
| Instalación de la PWA | todo el sitio | `install_prompt_*`, `pwa_installed`, `pwa_standalone_session` | ya existía |

Fuera de alcance (panel de administración): `formContactSend` (alta de diseño, el nombre no
corresponde), `formDesignEdit`, `formDesignDelete`.

## Parámetros por evento

Parámetros comunes de los clics en enlaces: `link_location` (zona: `header`, `footer`,
`mobile_menu`, `ficha_acciones`, `ficha_barra_movil`, el `id` de la sección o `page`),
`link_text` y, cuando se conoce, `item_name` (diseño).

| Evento | Parámetros |
|---|---|
| `form_contact_start` | `form_name`, `first_field` |
| `form_contact_error` (validación) | `form_name`, `error_type: validation`, `invalid_fields` (separados por coma) |
| `form_rate_start` | `form_name`, `design_id` (si viene de un producto) |
| `quote_product_remove` / `quote_product_restore` | `item_name` |
| `faq_open` / `faq_close` | `faq_id`, `faq_question`, `faq_position`, `faq_location` (`faq_page`, `embedded`, `section`) |
| `category_select` | `category_name` + `results_count` (filtro) o `category_slug` (enlace), `selection_method`, `link_location` |
| `select_item` | `item_id`, `item_name`, `item_list_name`, `link_location` |
| `view_item` | `item_id`, `item_name`, `item_category`, `price`, `currency` |
| `gallery_open` | `item_name`, `image_position`, `image_count` |
| `gallery_navigate` | `item_name`, `direction` (`next`/`previous`), `method` (`button`/`keyboard`) |
| `video_play` | `item_name`, `video_position` (0 = principal) |
| `quote_click` | comunes + `item_name` (del parámetro `producto` de la URL) |
| `whatsapp_click`, `email_click`, `phone_click` | comunes |
| `social_click` | comunes + `social_network` |
| `outbound_click` | comunes + `link_domain`, `link_url` |
| `download_click` | comunes + `file_extension` |
| `season_select` | comunes + `season_slug` |
| `navigation_click` | comunes + `link_url` |
| `menu_open` | `menu_name` |
| `carousel_scroll` | `carousel_name`, `direction` |
| `consent_update` | `consent_analytics`, `consent_ads` (`granted`/`denied`) |

## Configuración sugerida en GTM

1. **Variables** → Variable de capa de datos (versión 2) para cada parámetro que quieras
   reportar (`link_location`, `item_name`, `faq_question`, `category_name`, …).
2. **Activadores** → Evento personalizado. Uno por evento, o uno con expresión regular, por
   ejemplo `^(whatsapp_click|email_click|phone_click|quote_click)$` para los contactos.
3. **Etiquetas** → Evento de GA4 con *Nombre del evento* `{{Event}}` y los parámetros
   mapeados a las variables del paso 1.
4. En GA4 marca como **eventos clave** al menos `form_contact_saved`, `whatsapp_click` y
   `quote_click`; registra como dimensiones personalizadas los parámetros que uses en informes.

Notas:

- Los nombres no chocan con la medición mejorada de GA4 (`click`, `file_download`), así que
  pueden convivir; si la medición mejorada ya mide salidas o descargas, decide cuál reportar.
- **Consentimiento (Consent Mode v2):** todo arranca negado (`analytics_storage`, `ad_*`). El
  banner de cookies (`src/components/structure/cookie-consent.tsx`) ofrece *Aceptar* o *Solo
  necesarias*; la elección se guarda en `localStorage` (`inspiraarte-consent`) y se envía con
  `gtag('consent', 'update', …)` más el evento `consent_update` (`consent_analytics`,
  `consent_ads`). En las visitas siguientes `layout.tsx` aplica la elección guardada antes de
  cargar GTM. El footer tiene *Preferencias de cookies* para cambiarla. Para volver a pedirla a
  todos, sube `CONSENT_VERSION` en `src/lib/consent.ts`. En GTM, las etiquetas de Google ya
  respetan el consentimiento; si usas etiquetas de terceros, exige `analytics_storage` en su
  configuración de consentimiento adicional.
- Un enlace con `data-track="none"` (o dentro de un elemento con ese atributo) se omite del
  rastreo automático; `data-track-location` y `data-track-item-name` en un ancestro fijan la
  zona y el diseño de los enlaces que contiene.
