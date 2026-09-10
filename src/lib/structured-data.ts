type FaqItem = {
  question: string;
  answer: string;
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
  sameAs?: string[];
  contactPoints?: OrganizationContactPoint[];
};

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
  prices?: {
    minimumPrice?: number | null;
    suggestedPrice?: number | null;
    mayoreoPrice?: number | null;
    currency?: string;
  };
};

const DEFAULT_SITE_URL = "https://www.inspiraarte.com";
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
  const normalized = normalizeText(value).toLowerCase();

  if (!normalized) {
    return "https://schema.org/MadeToOrder";
  }

  if (normalized.includes("agot")) {
    return "https://schema.org/OutOfStock";
  }

  if (normalized.includes("pedido") || normalized.includes("produccion")) {
    return "https://schema.org/MadeToOrder";
  }

  if (normalized.includes("pre")) {
    return "https://schema.org/PreOrder";
  }

  return "https://schema.org/InStock";
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
    sameAs: sameAs.length > 0 ? sameAs : undefined,
    contactPoint: contactPoint.length > 0 ? contactPoint : undefined,
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
      description: `Tienda y taller de productos personalizados de ${siteName}.`,
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

  const breadcrumbNode = {
    "@type": "BreadcrumbList",
    "@id": `${productUrl}#breadcrumbs`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: toAbsoluteLikeUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Productos",
        item: toAbsoluteLikeUrl("/productos"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: input.name,
        item: productUrl,
      },
    ],
  };

  const faqItems = parseFaqItems(input.faq);
  const faqNode =
    faqItems.length > 0
      ? {
          "@type": "FAQPage",
          "@id": `${productUrl}#faq`,
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  return {
    "@context": "https://schema.org",
    "@graph": [organization, productNode, breadcrumbNode, ...(faqNode ? [faqNode] : [])],
  };
}

