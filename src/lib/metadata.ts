import type { Metadata } from "next";

const SITE_NAME = "InspiraArte";
const DEFAULT_SITE_URL = "https://www.inspiraarte.com";
const DEFAULT_IMAGE_PATH = "/dam/dafault-image-product.webp";
const DEFAULT_IMAGE_ALT = "Productos personalizados de InspiraArte";

interface BuildPageMetadataInput {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  imagePath?: string;
  imageAlt?: string;
  type?: "website" | "article";
  noIndex?: boolean;
}

function getSiteUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configuredUrl && /^https?:\/\//u.test(configuredUrl)) {
    return configuredUrl;
  }

  return DEFAULT_SITE_URL;
}

function toAbsoluteUrl(value: string): string {
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
  type = "website",
  noIndex = false,
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
      locale: "es_MX",
      siteName: SITE_NAME,
      images: [
        {
          url: absoluteImageUrl,
          alt: selectedImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteImageUrl],
    },
    ...(noIndex
      ? {
          robots: {
            index: false,
            follow: false,
            nocache: true,
            googleBot: {
              index: false,
              follow: false,
              noimageindex: true,
            },
          },
        }
      : {}),
  };
}

