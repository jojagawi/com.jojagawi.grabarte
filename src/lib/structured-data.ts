import { normalizeAvailability } from "@/lib/product-facts";

type FaqItem = {
  question: string;
  answer: string;
};

type BreadcrumbItem = {
  name: string;
  path: string;
};

type HowToStep = {
  name: string;
  text: string;
};

type OrganizationContactPoint = {
  contactType: string;
  email?: string;
  telephone?: string;
  url?: string;
  areaServed?: string;
  availableLanguage?: string[];
};

type OrganizationStructuredDataInput = {
  name: string;
  url?: string;
  logo?: string;
  description?: string;
  foundingDate?: string;
  sameAs?: string[];
  contactPoints?: OrganizationContactPoint[];
};

type ProductReviewInput = {
  name: string;
  description: string;
  rating: number;
  createdAt: string;
  image?: string | null;
};

// Google muestra hasta unas cuantas reseñas; el promedio sí usa todas.
const MAX_PRODUCT_REVIEWS_IN_JSON_LD = 10;

type ProductStructuredDataInput = {
  name: string;
  description: string;
  url: string;
  sku: string;
  brandName: string;
  material?: string | null;
  categories?: string[];
  images?: string[];
  author?: string | null;
  features?: string | null;
  benefits?: string | null;
  useCases?: string | null;
  audience?: string | null;
  faq?: string | null;
  imageDescription?: string | null;
  productionTime?: string | null;
  shippingTime?: string | null;
  availability?: string | null;
  dimensions?: string | null;
  keywords?: string[];
  reviews?: ProductReviewInput[];
  prices?: {
    minimumPrice?: number | null;
    suggestedPrice?: number | null;
    mayoreoPrice?: number | null;
    currency?: string;
  };
};

const DEFAULT_SITE_URL = "https://www.inspiraarte.com";
const FOUNDING_YEAR = "2026";
const DEFAULT_LOGO_PATH = "/dam/logos/logo.webp";
const DEFAULT_LOGO_WIDTH = 192;
const DEFAULT_LOGO_HEIGHT = 64;
const DEFAULT_PRODUCT_IMAGE_WIDTH = 1200;
const DEFAULT_PRODUCT_IMAGE_HEIGHT = 1200;

function toAbsoluteLikeUrl(url: string) {
  if (/^https?:\/\//iu.test(url)) {
    return url;
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL;
  return new URL(url, baseUrl).toString();
}

function normalizeText(value: unknown) {
  return String(value ?? "").trim();
}

function normalizeExternalUrl(value: string | null | undefined) {
  const normalized = normalizeText(value);
  if (!normalized) {
    return null;
  }

  return /^https?:\/\//iu.test(normalized) ? normalized : null;
}

function normalizeTelephone(value: string | null | undefined) {
  const normalized = normalizeText(value);
  if (!normalized) {
    return null;
  }

  const digits = normalized.replace(/\D/gu, "");
  if (!digits) {
    return null;
  }

  return normalized.startsWith("+") ? normalized : `+${digits}`;
}

function buildImageObject(url: string, caption: string, width: number, height: number) {
  return {
    "@type": "ImageObject",
    url,
    caption,
    width,
    height,
  };
}

function stringifyAdditionalProperty(name: string, value: string | number | null | undefined) {
  const normalized = normalizeText(value);
  if (!normalized) {
    return null;
  }

  return {
    "@type": "PropertyValue",
    name,
    value: normalized,
  };
}

function normalizeFaqRawText(value: string | null | undefined) {
  return normalizeText(value)
    .replace(/----\s*inicio\s*----/giu, "")
    .replace(/----\s*fin\s*---*/giu, "")
    .trim();
}

function parseFaqItems(rawFaq: string | null | undefined): FaqItem[] {
  const raw = normalizeFaqRawText(rawFaq);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => {
          if (!item || typeof item !== "object") return null;
          const question = normalizeText((item as { question?: unknown }).question);
          const answer = normalizeText((item as { answer?: unknown }).answer);
          if (!question || !answer) return null;
          return { question, answer };
        })
        .filter((item): item is FaqItem => Boolean(item));
    }
  } catch {
    // Intentamos el formato de texto libre a continuación.
  }

  const questionAnswerMatches = Array.from(
    raw.matchAll(/(¿[^?]+\?)\s*([\s\S]*?)(?=¿[^?]+\?|$)/gu),
  )
    .map((match) => {
      const question = normalizeText(match[1]);
      const answer = normalizeText(match[2]);
      if (!question || !answer) {
        return null;
      }

      return { question, answer };
    })
    .filter((item): item is FaqItem => Boolean(item));

  if (questionAnswerMatches.length > 0) {
    return questionAnswerMatches;
  }

  return raw
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^(.+?)(?:\s*\|\|\s*|\s*\|\s*|\s*=>\s*|\s*:\s+)(.+)$/u);
      if (!match) {
        return null;
      }

      const question = normalizeText(match[1]);
      const answer = normalizeText(match[2]);
      if (!question || !answer) {
        return null;
      }

      return { question, answer };
    })
    .filter((item): item is FaqItem => Boolean(item));
}

function mapAvailability(value: string | null | undefined) {
  return normalizeAvailability(value).schema;
}

function buildOrganizationNode(input: OrganizationStructuredDataInput) {
  const logoUrl = normalizeExternalUrl(input.logo);
  const sameAs = Array.from(
    new Set((input.sameAs ?? []).map((url) => normalizeExternalUrl(url)).filter(Boolean)),
  );

  const contactPoint = (input.contactPoints ?? [])
    .map((contact) => {
      const contactType = normalizeText(contact.contactType);
      if (!contactType) {
        return null;
      }

      const email = normalizeText(contact.email);
      const telephone = normalizeTelephone(contact.telephone);
      const url = normalizeExternalUrl(contact.url);
      const areaServed = normalizeText(contact.areaServed);
      const availableLanguage = (contact.availableLanguage ?? [])
        .map((language) => normalizeText(language))
        .filter(Boolean);

      return {
        "@type": "ContactPoint",
        contactType,
        ...(email ? { email } : {}),
        ...(telephone ? { telephone } : {}),
        ...(url ? { url } : {}),
        ...(areaServed ? { areaServed } : {}),
        ...(availableLanguage.length > 0 ? { availableLanguage } : {}),
      };
    })
    .filter(Boolean);

  return {
    "@type": "Organization",
    "@id": `${toAbsoluteLikeUrl("/")}#organization`,
    name: input.name,
    url: normalizeExternalUrl(input.url) || toAbsoluteLikeUrl("/"),
    logo: logoUrl
      ? buildImageObject(
          logoUrl,
          `Logo de ${input.name}`,
          DEFAULT_LOGO_WIDTH,
          DEFAULT_LOGO_HEIGHT,
        )
      : undefined,
    description: normalizeText(input.description) || undefined,
    foundingDate: normalizeText(input.foundingDate) || undefined,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
    contactPoint: contactPoint.length > 0 ? contactPoint : undefined,
  };
}

function buildFaqMainEntity(items: FaqItem[]) {
  return items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  }));
}

function buildBreadcrumbNode(pageUrl: string, crumbs: BreadcrumbItem[]) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumbs`,
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: toAbsoluteLikeUrl(crumb.path),
    })),
  };
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</gu, "\\u003c");
}

export function buildOrganizationJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL;
  const siteName = process.env.NEXT_PUBLIC_SITENAME?.trim() || "InspiraArte";
  const email = process.env.NEXT_PUBLIC_EMAIL || "contacto@inspiraarte.com";
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP || "";
  const websiteUrl = normalizeExternalUrl(siteUrl) || toAbsoluteLikeUrl("/");
  const whatsappTelephone = normalizeTelephone(whatsapp);
  const socialProfiles = [
    process.env.NEXT_PUBLIC_INSTAGRAM,
    process.env.NEXT_PUBLIC_FACEBOOK,
    process.env.NEXT_PUBLIC_TIKTOK,
  ];

  return {
    "@context": "https://schema.org",
    ...buildOrganizationNode({
      name: siteName,
      url: websiteUrl,
      logo: toAbsoluteLikeUrl(DEFAULT_LOGO_PATH),
      description: `${siteName} es un taller de corte y grabado láser en Ciudad de México que diseña y produce regalos y productos personalizados.`,
      foundingDate: FOUNDING_YEAR,
      sameAs: socialProfiles.filter((profile): profile is string => Boolean(profile)),
      contactPoints: [
        {
          contactType: "customer service",
          email,
          ...(whatsappTelephone ? { telephone: whatsappTelephone } : {}),
          url: toAbsoluteLikeUrl("/contacto"),
          areaServed: "MX",
          availableLanguage: ["es-MX"],
        },
        {
          contactType: "sales",
          email,
          url: toAbsoluteLikeUrl("/contacto"),
          areaServed: "MX",
          availableLanguage: ["es-MX"],
        },
      ],
    }),
  };
}

export function buildProductJsonLd(input: ProductStructuredDataInput) {
  const productUrl = toAbsoluteLikeUrl(input.url);
  const images = Array.from(
    new Set((input.images ?? []).map((image) => normalizeText(image)).filter(Boolean)),
  );
  const prices = [
    input.prices?.minimumPrice,
    input.prices?.suggestedPrice,
    input.prices?.mayoreoPrice,
  ].filter((price): price is number => Number.isFinite(price));

  const organization = buildOrganizationNode({
    name: input.brandName,
    url: toAbsoluteLikeUrl("/"),
    logo: toAbsoluteLikeUrl(DEFAULT_LOGO_PATH),
    sameAs: [
      process.env.NEXT_PUBLIC_INSTAGRAM,
      process.env.NEXT_PUBLIC_FACEBOOK,
      process.env.NEXT_PUBLIC_TIKTOK,
    ].filter((profile): profile is string => Boolean(profile)),
    contactPoints: [
      {
        contactType: "customer service",
        email: process.env.NEXT_PUBLIC_EMAIL || "contacto@inspiraarte.com",
        telephone: normalizeTelephone(process.env.NEXT_PUBLIC_WHATSAPP || "") || undefined,
        url: toAbsoluteLikeUrl("/contacto"),
        areaServed: "MX",
        availableLanguage: ["es-MX"],
      },
    ],
  });

  const additionalProperty = [
    stringifyAdditionalProperty("Keywords", (input.keywords ?? []).join(", ")),
    stringifyAdditionalProperty("Material", input.material),
    stringifyAdditionalProperty("Categorías", (input.categories ?? []).join(", ")),
    stringifyAdditionalProperty("Autor", input.author),
    stringifyAdditionalProperty("Características", input.features),
    stringifyAdditionalProperty("Beneficios", input.benefits),
    stringifyAdditionalProperty("Casos de uso", input.useCases),
    stringifyAdditionalProperty("Audiencia", input.audience),
    stringifyAdditionalProperty("Descripción de imagen", input.imageDescription),
    stringifyAdditionalProperty("Tiempo de producción", input.productionTime),
    stringifyAdditionalProperty("Tiempo de envío", input.shippingTime),
    stringifyAdditionalProperty("Disponibilidad textual", input.availability),
    stringifyAdditionalProperty("Dimensiones", input.dimensions),
  ].filter(Boolean);

  const imageCaption = normalizeText(input.imageDescription) || `Imagen del producto ${input.name}`;
  const imageObjects = images.map((imageUrl) =>
    buildImageObject(
      toAbsoluteLikeUrl(imageUrl),
      imageCaption,
      DEFAULT_PRODUCT_IMAGE_WIDTH,
      DEFAULT_PRODUCT_IMAGE_HEIGHT,
    ),
  );

  const productNode: Record<string, unknown> = {
    "@type": "Product",
    "@id": `${productUrl}#product`,
    name: input.name,
    description: input.description,
    url: productUrl,
    sku: input.sku,
    mpn: input.sku,
    brand: {
      "@type": "Brand",
      name: input.brandName,
    },
    manufacturer: organization,
    category: (input.categories ?? []).join(" > ") || undefined,
    material: input.material || undefined,
    image: imageObjects.length > 0 ? imageObjects : undefined,
    additionalProperty: additionalProperty.length > 0 ? additionalProperty : undefined,
    creator: input.author
      ? {
          "@type": "Person",
          name: input.author,
        }
      : undefined,
  };

  const reviews = (input.reviews ?? []).filter((review) => normalizeText(review.name) && normalizeText(review.description));
  if (reviews.length > 0) {
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    productNode.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Math.round(averageRating * 10) / 10,
      reviewCount: reviews.length,
      bestRating: 5,
      worstRating: 1,
    };
    productNode.review = reviews.slice(0, MAX_PRODUCT_REVIEWS_IN_JSON_LD).map((review) => ({
      "@type": "Review",
      author: { "@type": "Person", name: normalizeText(review.name) },
      reviewBody: normalizeText(review.description),
      ...(review.image ? { image: review.image } : {}),
      ...(normalizeText(review.createdAt) ? { datePublished: normalizeText(review.createdAt).slice(0, 10) } : {}),
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
    }));
  }

  if (prices.length > 0) {
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const currency = input.prices?.currency || "MXN";
    const availability = mapAvailability(input.availability);

    productNode.offers =
      prices.length > 1
        ? {
            "@type": "AggregateOffer",
            priceCurrency: currency,
            lowPrice: minPrice,
            highPrice: maxPrice,
            offerCount: prices.length,
            availability,
            url: productUrl,
            seller: organization,
          }
        : {
            "@type": "Offer",
            priceCurrency: currency,
            price: minPrice,
            availability,
            url: productUrl,
            itemCondition: "https://schema.org/NewCondition",
            seller: organization,
          };
  }

  const breadcrumbNode = buildBreadcrumbNode(productUrl, [
    { name: "Inicio", path: "/" },
    { name: "Productos", path: "/productos" },
    { name: input.name, path: productUrl },
  ]);

  const faqItems = parseFaqItems(input.faq);
  const faqNode =
    faqItems.length > 0
      ? {
          "@type": "FAQPage",
          "@id": `${productUrl}#faq`,
          mainEntity: buildFaqMainEntity(faqItems),
        }
      : null;

  return {
    "@context": "https://schema.org",
    "@graph": [organization, productNode, breadcrumbNode, ...(faqNode ? [faqNode] : [])],
  };
}


export function buildWebSiteJsonLd() {
  const siteName = process.env.NEXT_PUBLIC_SITENAME?.trim() || "InspiraArte";
  const siteUrl = toAbsoluteLikeUrl("/");

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}#website`,
    name: siteName,
    url: siteUrl,
    inLanguage: "es-MX",
    publisher: { "@id": `${siteUrl}#organization` },
  };
}

export function buildFaqPageJsonLd(path: string, items: FaqItem[]) {
  const pageUrl = toAbsoluteLikeUrl(path);
  const validItems = items
    .map((item) => ({ question: normalizeText(item.question), answer: normalizeText(item.answer) }))
    .filter((item) => item.question && item.answer);

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    url: pageUrl,
    inLanguage: "es-MX",
    mainEntity: buildFaqMainEntity(validItems),
  };
}

export function buildHowToJsonLd(input: { path: string; name: string; description: string; steps: HowToStep[] }) {
  const pageUrl = toAbsoluteLikeUrl(input.path);

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${pageUrl}#howto`,
    name: input.name,
    description: input.description,
    inLanguage: "es-MX",
    step: input.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      url: `${pageUrl}#paso-${index + 1}`,
    })),
  };
}

export function buildBreadcrumbJsonLd(path: string, crumbs: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    ...buildBreadcrumbNode(toAbsoluteLikeUrl(path), crumbs),
  };
}

export function buildCollectionPageJsonLd(input: {
  path: string;
  name: string;
  description: string;
  breadcrumbs: BreadcrumbItem[];
  items: Array<{ name: string; path: string; image?: string }>;
}) {
  const pageUrl = toAbsoluteLikeUrl(input.path);
  const siteUrl = toAbsoluteLikeUrl("/");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#collection`,
        name: input.name,
        description: input.description,
        url: pageUrl,
        inLanguage: "es-MX",
        isPartOf: { "@id": `${siteUrl}#website` },
        breadcrumb: { "@id": `${pageUrl}#breadcrumbs` },
        mainEntity: { "@id": `${pageUrl}#items` },
      },
      buildBreadcrumbNode(pageUrl, input.breadcrumbs),
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#items`,
        numberOfItems: input.items.length,
        itemListElement: input.items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          url: toAbsoluteLikeUrl(item.path),
          ...(item.image ? { image: toAbsoluteLikeUrl(item.image) } : {}),
        })),
      },
    ],
  };
}

export function buildAboutPageJsonLd(input: { path: string; name: string; description: string }) {
  const pageUrl = toAbsoluteLikeUrl(input.path);
  const siteUrl = toAbsoluteLikeUrl("/");

  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${pageUrl}#about`,
    name: input.name,
    description: input.description,
    url: pageUrl,
    inLanguage: "es-MX",
    isPartOf: { "@id": `${siteUrl}#website` },
    about: { "@id": `${siteUrl}#organization` },
    mainEntity: { "@id": `${siteUrl}#organization` },
  };
}
