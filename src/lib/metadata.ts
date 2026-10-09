import type { Metadata } from "next";

const SITE_NAME = "InspiraArte";
const DEFAULT_SITE_URL = "https://www.inspiraarte.com";
// Tarjeta genérica de la marca en el tamaño de vista grande de Open Graph / X.
// La genera scripts/build-og-default.ts; si cambia, actualiza también sus medidas aquí.
const DEFAULT_IMAGE = {
  path: "/dam/og/inspiraarte.png",
  alt: "InspiraArte: productos personalizados con corte y grabado láser",
  width: 1200,
  height: 630,
  type: "image/png",
};

const IMAGE_TYPES_BY_EXTENSION: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
};

function inferImageType(path: string): string | undefined {
  const extension = path.split(/[?#]/u)[0].split(".").pop()?.toLowerCase();
  return extension ? IMAGE_TYPES_BY_EXTENSION[extension] : undefined;
}

interface BuildPageMetadataInput {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  /** Sin imagen se usa la tarjeta genérica de la marca. */
  imagePath?: string;
  imageAlt?: string;
  locale?: string;
  countryName?: string;
  /** Medidas reales de imagePath; si no se conocen, no se declaran. */
  imageWidth?: number;
  imageHeight?: number;
  imageType?: string;
  twitterSite?: string;
  twitterCreator?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  /** Con noIndex: deja que los buscadores sigan los enlaces de la página (p. ej. a productos). */
  followLinks?: boolean;
}

function getSiteUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configuredUrl && /^https?:\/\//u.test(configuredUrl)) {
    return configuredUrl;
  }

  return DEFAULT_SITE_URL;
}

export function toAbsoluteUrl(value: string): string {
  if (/^https?:\/\//u.test(value)) {
    return value;
  }

  return new URL(value, getSiteUrl()).toString();
}

function normalizeCanonicalPath(path: string): string {
  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;
  if (withLeadingSlash === "/") {
    return "/";
  }

  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
}

const MAX_META_DESCRIPTION_LENGTH = 160;

// Textos editados en el panel pueden traer espacios dobles o rebasar lo que Google muestra.
export function toMetaDescription(value: string, maxLength = MAX_META_DESCRIPTION_LENGTH): string {
  const normalized = value.replace(/\s+/gu, " ").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }

  const cut = normalized.slice(0, maxLength - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.]+$/u, "")}…`;
}

const MAX_TITLE_LENGTH = 60;
const BRAND_SUFFIX = ` | ${SITE_NAME}`;
// Cortes naturales en los nombres del catálogo ("Lámpara … con brazo esquelético y araña").
// " de " no cuenta: parte frases como "Día de Muertos".
const TITLE_BREAKS = [" | ", " - ", ": ", ", ", " para ", " con ", " y ", " en "];
const MIN_SHORT_TITLE_LENGTH = 20;
const TRAILING_STOPWORDS = /\s+(?:de|del|la|las|el|los|en|y|con|para|a|o)$/iu;

// El <title> sale del nombre del producto, que también arma el slug: no se puede acortar el
// nombre sin cambiar la URL. Google corta en ~60 caracteres, así que aquí se acorta solo el título:
// con marca si cabe, si no el nombre, y si aún no cabe hasta el último corte natural.
export function fitTitle(name: string): string {
  const normalized = name.replace(/\s+/gu, " ").trim();
  if (normalized.length + BRAND_SUFFIX.length <= MAX_TITLE_LENGTH) {
    return `${normalized}${BRAND_SUFFIX}`;
  }
  if (normalized.length <= MAX_TITLE_LENGTH) {
    return normalized;
  }

  const head = normalized.slice(0, MAX_TITLE_LENGTH);
  const breakAt = Math.max(...TITLE_BREAKS.map((separator) => head.lastIndexOf(separator)));
  const lastSpace = head.lastIndexOf(" ");
  const short = (
    breakAt >= MIN_SHORT_TITLE_LENGTH
      ? head.slice(0, breakAt)
      : (lastSpace > 0 ? head.slice(0, lastSpace) : head).replace(TRAILING_STOPWORDS, "")
  ).replace(/[\s,;:.-]+$/u, "");

  return short.length + BRAND_SUFFIX.length <= MAX_TITLE_LENGTH ? `${short}${BRAND_SUFFIX}` : short;
}

export function buildMetadataBase(): URL {
  return new URL(getSiteUrl());
}

export function buildPageMetadata({
  title,
  description,
  path,
  keywords,
  imagePath,
  imageAlt,
  locale = "es_MX",
  countryName = "MX",
  imageWidth,
  imageHeight,
  imageType,
  twitterSite,
  twitterCreator,
  type = "website",
  noIndex = false,
  followLinks = false,
}: BuildPageMetadataInput): Metadata {
  const canonicalPath = normalizeCanonicalPath(path);
  const absoluteCanonicalUrl = toAbsoluteUrl(canonicalPath);
  const image = imagePath
    ? {
        url: toAbsoluteUrl(imagePath),
        alt: imageAlt || DEFAULT_IMAGE.alt,
        ...(imageWidth && imageHeight ? { width: imageWidth, height: imageHeight } : {}),
        ...((imageType ?? inferImageType(imagePath)) ? { type: imageType ?? inferImageType(imagePath) } : {}),
      }
    : {
        url: toAbsoluteUrl(DEFAULT_IMAGE.path),
        alt: imageAlt || DEFAULT_IMAGE.alt,
        width: DEFAULT_IMAGE.width,
        height: DEFAULT_IMAGE.height,
        type: DEFAULT_IMAGE.type,
      };

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: {
      canonical: absoluteCanonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: absoluteCanonicalUrl,
      type,
      locale,
      countryName,
      siteName: SITE_NAME,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(twitterSite ? { site: twitterSite } : {}),
      ...(twitterCreator ? { creator: twitterCreator } : {}),
      images: [{ url: image.url, alt: image.alt }],
    },
    ...(noIndex
      ? {
          robots: {
            index: false,
            follow: followLinks,
            nocache: true,
            googleBot: {
              index: false,
              follow: followLinks,
              noimageindex: true,
            },
          },
        }
      : {}),
  };
}

