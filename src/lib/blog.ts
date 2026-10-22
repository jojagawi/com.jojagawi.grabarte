import { parseGuide } from "@/components/custom/guide-content";

// Artículos del blog: un Markdown por artículo en content/blog/<slug>.md con un encabezado
// sencillo (clave: valor) y el cuerpo en el mismo Markdown acotado de las guías de temporada.
//
//   ---
//   title: Regalos para intercambio navideño por presupuesto
//   description: Ideas desde $60 para intercambios de oficina, familia y amigos.
//   season: navidad
//   products: 109, 4, 184
//   publishAt: 2026-10-26
//   updatedAt: 2026-10-26
//   status: published
//   ---
//
// En el cuerpo, [texto](producto:109) enlaza a la ficha y {{precio:109}} imprime su precio de
// referencia, los dos desde la base al compilar: el texto nunca trae URLs ni precios escritos a mano.

export const BLOG_STATUSES = ["draft", "published"] as const;
export type BlogStatus = (typeof BLOG_STATUSES)[number];

export interface BlogFrontmatter {
  title: string;
  description: string;
  season: string | null;
  products: number[];
  publishAt: string;
  updatedAt: string;
  status: BlogStatus;
  author: string | null;
}

export interface BlogFaqItem {
  question: string;
  answer: string;
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/u;
export const FAQ_HEADING = "Preguntas frecuentes";

export function parseFrontmatter(source: string, file: string): { data: BlogFrontmatter; body: string } {
  const match = source.replace(/\r\n/gu, "\n").match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/u);
  if (!match) {
    throw new Error(`${file}: falta el encabezado entre líneas ---`);
  }

  const fields = new Map<string, string>();
  for (const line of match[1].split("\n")) {
    const field = line.match(/^([A-Za-z]+):\s*(.*)$/u);
    if (field) {
      fields.set(field[1], field[2].trim().replace(/^"(.*)"$/u, "$1"));
    }
  }

  const required = (key: string): string => {
    const value = fields.get(key);
    if (!value) {
      throw new Error(`${file}: falta "${key}" en el encabezado`);
    }
    return value;
  };

  const publishAt = required("publishAt");
  const updatedAt = fields.get("updatedAt") || publishAt;
  for (const [key, value] of [["publishAt", publishAt], ["updatedAt", updatedAt]]) {
    if (!DATE_PATTERN.test(value)) {
      throw new Error(`${file}: "${key}" debe ser AAAA-MM-DD`);
    }
  }

  const status = fields.get("status") || "draft";
  if (!(BLOG_STATUSES as readonly string[]).includes(status)) {
    throw new Error(`${file}: "status" debe ser ${BLOG_STATUSES.join(" o ")}`);
  }

  return {
    data: {
      title: required("title"),
      description: required("description"),
      season: fields.get("season") || null,
      products: (fields.get("products") ?? "")
        .split(",")
        .map((id) => Number(id.trim()))
        .filter((id) => Number.isInteger(id) && id > 0),
      publishAt,
      updatedAt,
      status: status as BlogStatus,
      author: fields.get("author") || null,
    },
    body: match[2].trim(),
  };
}

// Fecha del encabezado como mediodía en Ciudad de México, para que no cambie de día al formatearla.
export function toBlogDate(value: string): Date {
  return new Date(`${value}T12:00:00-06:00`);
}

// Publicado y con fecha ya cumplida. El build de los lunes publica los que se programaron a futuro.
export function isBlogPostLive(data: BlogFrontmatter, now: Date): boolean {
  return data.status === "published" && toBlogDate(data.publishAt) <= now;
}

const PRODUCT_LINK = /\]\(producto:(\d+)\)/gu;
const PRODUCT_PRICE = /\{\{precio:(\d+)\}\}/gu;

export function findProductReferences(body: string): number[] {
  const ids = [...body.matchAll(PRODUCT_LINK), ...body.matchAll(PRODUCT_PRICE)].map((match) => Number(match[1]));
  return Array.from(new Set(ids));
}

export interface BlogProductRef {
  href: string;
  price: number | null;
}

const priceFormatter = new Intl.NumberFormat("es-MX", { maximumFractionDigits: 0 });

// Cambia producto:ID por la URL de la ficha y {{precio:ID}} por "$60". Un producto que ya no se
// muestra en el sitio deja su texto sin enlace y el precio como "precio a cotizar".
export function resolveProductReferences(body: string, products: Map<number, BlogProductRef>): string {
  return body
    .replace(/\[([^\]]+)\]\(producto:(\d+)\)/gu, (_match, label: string, id: string) => {
      const product = products.get(Number(id));
      return product ? `[${label}](${product.href}/)` : label;
    })
    .replace(PRODUCT_PRICE, (_match, id: string) => {
      const price = products.get(Number(id))?.price;
      return price ? `$${priceFormatter.format(price)}` : "precio a cotizar";
    });
}

// Las preguntas de la sección "## Preguntas frecuentes" (cada ### es una pregunta) para el schema FAQPage.
export function extractFaq(markdown: string): BlogFaqItem[] {
  const items: BlogFaqItem[] = [];
  let inFaq = false;
  let current: BlogFaqItem | null = null;

  for (const block of parseGuide(markdown)) {
    if (block.type === "heading" && block.level === 2) {
      inFaq = block.text === FAQ_HEADING;
      continue;
    }
    if (!inFaq) {
      continue;
    }
    if (block.type === "heading") {
      current = { question: block.text, answer: "" };
      items.push(current);
    } else if (current && block.type === "paragraph") {
      current.answer = `${current.answer} ${stripInlineMarkdown(block.text)}`.trim();
    }
  }

  return items.filter((item) => item.answer);
}

function stripInlineMarkdown(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/gu, "$1").replace(/\[([^\]]+)\]\([^)\s]+\)/gu, "$1");
}

// Palabras del cuerpo, sin la sintaxis de Markdown (para el tiempo de lectura y las revisiones).
export function countWords(markdown: string): number {
  return stripInlineMarkdown(markdown)
    .replace(/[#|*-]/gu, " ")
    .split(/\s+/u)
    .filter(Boolean).length;
}
