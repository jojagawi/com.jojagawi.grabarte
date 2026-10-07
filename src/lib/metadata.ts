import type { Metadata } from "next";

const SITE_NAME = "InspiraArte";
const DEFAULT_SITE_URL = "https://www.inspiraarte.com";
const DEFAULT_IMAGE_PATH = "/dam/default-image-product.webp";
const DEFAULT_IMAGE_ALT = "Productos personalizados de InspiraArte";

interface BuildPageMetadataInput {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  imagePath?: string;
  imageAlt?: string;
  locale?: string;
  countryName?: string;
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
  imageWidth = 1200,
  imageHeight = 630,
  imageType = "image/webp",
  twitterSite,
  twitterCreator,
  type = "website",
  noIndex = false,
  followLinks = false,
}: BuildPageMetadataInput): Metadata {
  const selectedImagePath = imagePath || DEFAULT_IMAGE_PATH;
  const selectedImageAlt = imageAlt || DEFAULT_IMAGE_ALT;
  const canonicalPath = normalizeCanonicalPath(path);
  const absoluteCanonicalUrl = toAbsoluteUrl(canonicalPath);
  const absoluteImageUrl = toAbsoluteUrl(selectedImagePath);

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
      images: [
        {
          url: absoluteImageUrl,
          alt: selectedImageAlt,
          width: imageWidth,
          height: imageHeight,
          type: imageType,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(twitterSite ? { site: twitterSite } : {}),
      ...(twitterCreator ? { creator: twitterCreator } : {}),
      images: [
        {
          url: absoluteImageUrl,
          alt: selectedImageAlt,
        },
      ],
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

