// Eventos de GTM del sitio público. Los nombres siguen el estilo de GA4 (snake_case,
// objeto_acción) y están documentados en docs/gtm-eventos.md: si agregas uno, anótalo ahí
// para crear su activador y etiqueta en el contenedor.
import { sendGTMEvent } from "@next/third-parties/google";

export type AnalyticsParams = Record<string, string | number | boolean | undefined>;

// Sin GTM (desarrollo o NEXT_GTM vacío) no hay dataLayer: el evento se descarta en silencio.
export function trackEvent(event: string, params: AnalyticsParams = {}): void {
  if (typeof window === "undefined" || !Array.isArray(window.dataLayer)) {
    return;
  }
  sendGTMEvent({ event, ...params });
}

const whatsappHosts = new Set(["wa.me", "api.whatsapp.com", "web.whatsapp.com", "whatsapp.com", "www.whatsapp.com"]);

const socialHosts: Record<string, string> = {
  "instagram.com": "Instagram",
  "facebook.com": "Facebook",
  "fb.com": "Facebook",
  "tiktok.com": "TikTok",
};

function cleanText(value: string | null | undefined, max = 100): string {
  const text = (value ?? "").replace(/\s+/g, " ").trim();
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function socialNetworkFor(host: string): string | null {
  const bare = host.replace(/^www\./, "").replace(/^m\./, "");
  return socialHosts[bare] ?? null;
}

// Zona del enlace: data-track-location explícito, si no el header/footer/menú o la sección.
export function getLinkLocation(element: Element): string {
  const explicit = element.closest<HTMLElement>("[data-track-location]");
  if (explicit?.dataset.trackLocation) {
    return explicit.dataset.trackLocation;
  }
  if (element.closest("[data-slot='sheet-content']")) {
    return "mobile_menu";
  }
  if (element.closest("header")) {
    return "header";
  }
  if (element.closest("footer")) {
    return "footer";
  }
  const section = element.closest("section[id], section[aria-labelledby], article[aria-labelledby]");
  return section?.getAttribute("id") || section?.getAttribute("aria-labelledby") || "page";
}

// Clasifica el clic en un enlace; null cuando no aporta nada sobre el page_view.
export function classifyLinkClick(anchor: HTMLAnchorElement): { event: string; params: AnalyticsParams } | null {
  const rawHref = anchor.getAttribute("href");
  // Otros esquemas (javascript:, data:…) se descartan abajo: solo cuentan http(s), mailto y tel.
  if (!rawHref || rawHref.startsWith("#")) {
    return null;
  }

  let url: URL;
  try {
    url = new URL(rawHref, window.location.href);
  } catch {
    return null;
  }

  const link_location = getLinkLocation(anchor);
  const link_text = cleanText(anchor.getAttribute("aria-label") || anchor.textContent);
  // La ficha marca su bloque con data-track-item-name para saber de qué diseño viene el clic.
  const item_name =
    cleanText(anchor.closest<HTMLElement>("[data-track-item-name]")?.dataset.trackItemName) || undefined;
  const base = { link_location, link_text, item_name };

  if (anchor.hasAttribute("download")) {
    const extension = url.pathname.split(".").pop()?.toLowerCase() ?? "";
    return { event: "download_click", params: { ...base, file_extension: extension } };
  }
  if (url.protocol === "mailto:") {
    return { event: "email_click", params: base };
  }
  if (url.protocol === "tel:") {
    return { event: "phone_click", params: base };
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return null;
  }

  if (url.host !== window.location.host) {
    if (whatsappHosts.has(url.host)) {
      return { event: "whatsapp_click", params: base };
    }
    const network = socialNetworkFor(url.host);
    if (network) {
      return { event: "social_click", params: { ...base, social_network: network } };
    }
    return { event: "outbound_click", params: { ...base, link_domain: url.host, link_url: url.href } };
  }

  const path = url.pathname.replace(/\/+$/, "") || "/";

  if (path === "/contacto") {
    return {
      event: "quote_click",
      params: { ...base, item_name: cleanText(url.searchParams.get("producto")) || item_name },
    };
  }

  const categoryMatch = path.match(/^\/productos\/categoria\/([^/]+)$/);
  if (categoryMatch) {
    return {
      event: "category_select",
      params: { ...base, category_slug: categoryMatch[1], selection_method: "link" },
    };
  }

  const productMatch = path.match(/^\/productos\/(\d+)-/);
  if (productMatch) {
    // En tarjetas el nombre está en el título; el resto del texto (categorías, tiempos) sobra.
    const title = anchor.querySelector("h2, h3")?.textContent;
    return {
      event: "select_item",
      params: {
        link_location,
        item_list_name: link_location,
        item_id: productMatch[1],
        item_name: cleanText(title || anchor.textContent),
      },
    };
  }

  const seasonMatch = path.match(/^\/temporada\/([^/]+)$/);
  if (seasonMatch) {
    return { event: "season_select", params: { ...base, season_slug: seasonMatch[1] } };
  }

  if (link_location === "header" || link_location === "footer" || link_location === "mobile_menu") {
    return { event: "navigation_click", params: { ...base, link_url: path } };
  }

  return null;
}
