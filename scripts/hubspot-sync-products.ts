import { config } from "dotenv";
import sharp from "sharp";

// Sincroniza los diseños del catálogo (SQLite) con el objeto Productos de HubSpot.
// - Solo envía propiedades que YA existen en HubSpot y son editables: lee las
//   definiciones del portal y descarta lo que no tenga equivalente.
// - Empareja por SKU (hs_sku = IA-0000): crea los que faltan y actualiza los que
//   cambiaron. Nunca borra productos ni vacía campos en HubSpot.
// - Imágenes: sube la vista previa al administrador de archivos de HubSpot (JPG)
//   y guarda esa URL en hs_images; solo se sube si el producto aún no tiene una
//   imagen alojada en HubSpot (o con --refresh-images).
// - Pedidos: cuenta los negocios (deals) GANADOS distintos que tienen una línea
//   de producto con cada producto y lo guarda en Designs.requests (SQLite).
//
// Uso:
//   pnpm run hubspot:sync-products              sincroniza los diseños activos
//   pnpm run hubspot:sync-products --dry-run    muestra qué haría, sin escribir
//   pnpm run hubspot:sync-products --site-only  solo los publicados en el sitio
//   pnpm run hubspot:sync-products --refresh-images  vuelve a subir todas las imágenes
//   pnpm run hubspot:sync-products --sku=IA-0003     solo ese producto

config({ path: [".env.local", ".env.development", ".env"], quiet: true });

const HUBSPOT_BASE_URL = "https://api.hubapi.com";
const BATCH_SIZE = 100;
const MAX_TEXT_LENGTH = 65_000;
const MAX_RETRIES = 4;
// Las URLs de producto en HubSpot usan el dominio sin "www".
const PRODUCT_URL_BASE = "https://inspiraarte.com";
const HUBSPOT_FILES_FOLDER = "/inspiraarte/productos";
const IMAGE_MAX_SIZE = 1200;
const IMAGE_UPLOAD_CONCURRENCY = 4;

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const siteOnly = args.has("--site-only");
const refreshImages = args.has("--refresh-images");
// --sku=IA-0003: procesa un solo producto (útil para probar antes de correr todo).
const onlyDesignId = Number(
  process.argv.find((arg) => arg.startsWith("--sku="))?.replace(/^--sku=(IA-)?/i, "") ?? Number.NaN,
);

type HubspotProperty = {
  name: string;
  label: string;
  type: string;
  fieldType: string;
  calculated?: boolean;
  modificationMetadata?: { readOnlyValue?: boolean };
  options?: Array<{ label: string; value: string; hidden?: boolean }>;
};

type HubspotProduct = {
  id: string;
  properties: Record<string, string | null>;
};

type RawValue = string | number | boolean | null | undefined;

type HubspotLineItem = {
  id: string;
  properties: Record<string, string | null>;
  associations?: { deals?: { results: Array<{ id: string }> } };
};

// Tolera valores "sucios" en el .env: comillas, espacios o un "Bearer " incluido.
function normalizeToken(value: string | undefined): string {
  return (value ?? "")
    .trim()
    .replace(/^["']|["']$/g, "")
    .replace(/^Bearer\s+/i, "")
    .trim();
}

// Explica qué parece ser el valor sin mostrarlo (solo prefijo y longitud).
function describeInvalidToken(value: string): string | null {
  if (/^pat-[a-z0-9]+-/i.test(value)) {
    return null;
  }
  const hint = `empieza por "${value.slice(0, 4)}…" y mide ${value.length} caracteres`;
  // Las Personal Access Keys del HubSpot CLI son base64 y al decodificarlas empiezan por la región (na1-, eu1-…).
  const decodedPrefix = Buffer.from(value.slice(0, 12), "base64").toString("latin1");
  if (/^\n.(na|eu|ap)\d-/.test(decodedPrefix)) {
    return `HUBSPOT_API_KEY es una Personal Access Key del HubSpot CLI (${hint}). Esa clave no se puede usar directo en la API: crea una app privada en HubSpot (Configuración › Integraciones › Apps privadas, scope "e-commerce") y usa su token "pat-…".`;
  }
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
    return `HUBSPOT_API_KEY parece una API key antigua (hapikey; ${hint}). HubSpot las desactivó: crea una app privada y usa su token "pat-…".`;
  }
  return `HUBSPOT_API_KEY no parece un token de app privada (${hint}). Debe empezar por "pat-" (por ejemplo "pat-na1-…").`;
}

const token = normalizeToken(process.env.HUBSPOT_API_KEY);
// Siempre https al descargar: el CDN lo sirve aunque NEXT_PUBLIC_S3_PROTOCOL diga http.
const mediaBaseUrl = `https://${process.env.NEXT_PUBLIC_S3 || "dam.inspiraarte.com"}`;

// Imagen ya alojada en el administrador de archivos de HubSpot.
function isHubspotHosted(url: string | null | undefined): boolean {
  return /hubspotusercontent|hubfs|hs-fs|hubspot\.net/i.test(url ?? "");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Llamada a HubSpot con reintentos en límites de tasa (429) y errores 5xx.
async function hubspot<T>(path: string, init: RequestInit = {}): Promise<T> {
  for (let attempt = 1; ; attempt += 1) {
    const response = await fetch(`${HUBSPOT_BASE_URL}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        // Con FormData (subida de archivos) fetch pone su propio Content-Type.
        ...(typeof init.body === "string" ? { "Content-Type": "application/json" } : {}),
        ...init.headers,
      },
    });

    if (response.ok) {
      return (await response.json()) as T;
    }

    const retryable = response.status === 429 || response.status >= 500;
    if (retryable && attempt < MAX_RETRIES) {
      const retryAfter = Number(response.headers.get("retry-after"));
      await sleep(Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : attempt * 2000);
      continue;
    }

    const body = await response.text();
    if (response.status === 401) {
      throw new Error(
        `HubSpot rechazó el token (401). Revisa que HUBSPOT_API_KEY sea el token vigente de una app privada (pat-…). Respuesta: ${body.slice(0, 300)}`,
      );
    }
    if (response.status === 403) {
      throw new Error(
        `El token no tiene permisos para ${path} (403). En la app privada activa los scopes "e-commerce" (Productos), "files" (imágenes) y "crm.objects.deals.read" (pedidos). Respuesta: ${body.slice(0, 300)}`,
      );
    }
    throw new Error(`HubSpot ${init.method ?? "GET"} ${path} → ${response.status}: ${body.slice(0, 500)}`);
  }
}

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

function productReference(id: number): string {
  return `IA-${String(id).padStart(4, "0")}`;
}

// Pedidos por producto: las líneas de producto (line_items) apuntan al producto con
// hs_product_id y están asociadas a su negocio. Se cuentan negocios distintos, así
// que dos líneas del mismo producto en un negocio cuentan como un pedido.
async function getDealIdsByProductId(): Promise<Map<string, Set<string>>> {
  const dealsByProduct = new Map<string, Set<string>>();
  let after: string | undefined;
  do {
    const query = new URLSearchParams({ limit: "100", properties: "hs_product_id", associations: "deals" });
    if (after) {
      query.set("after", after);
    }
    const page = await hubspot<{ results: HubspotLineItem[]; paging?: { next?: { after: string } } }>(
      `/crm/v3/objects/line_items?${query.toString()}`,
    );
    for (const lineItem of page.results) {
      const productId = lineItem.properties.hs_product_id?.trim();
      const dealIds = lineItem.associations?.deals?.results.map((deal) => deal.id) ?? [];
      if (!productId || dealIds.length === 0) {
        continue;
      }
      const deals = dealsByProduct.get(productId) ?? new Set<string>();
      dealIds.forEach((dealId) => deals.add(dealId));
      dealsByProduct.set(productId, deals);
    }
    after = page.paging?.next?.after;
  } while (after);
  return dealsByProduct;
}

// Negocios ganados entre los dados. hs_is_closed_won lo calcula HubSpot a partir de la
// etapa, así que cubre la etapa "ganado" de cualquier pipeline. Requiere crm.objects.deals.read.
// Un negocio archivado o borrado no regresa en el batch y no cuenta.
async function getWonDealIds(dealIds: string[]): Promise<Set<string>> {
  const won = new Set<string>();
  for (const batch of chunk(dealIds, BATCH_SIZE)) {
    const result = await hubspot<{ results: Array<{ id: string; properties: Record<string, string | null> }> }>(
      "/crm/v3/objects/deals/batch/read",
      {
        method: "POST",
        body: JSON.stringify({ properties: ["hs_is_closed_won"], inputs: batch.map((id) => ({ id })) }),
      },
    );
    for (const deal of result.results) {
      if (deal.properties.hs_is_closed_won === "true") {
        won.add(deal.id);
      }
    }
  }
  return won;
}

// Descarga la vista previa, la convierte a JPG (el preview de HubSpot no muestra
// bien webp ni URLs http) y la sube al administrador de archivos. Devuelve su URL.
async function uploadProductImage(sku: string, sourceUrl: string): Promise<string> {
  const response = await fetch(sourceUrl);
  if (!response.ok) {
    throw new Error(`no se pudo descargar ${sourceUrl} (${response.status})`);
  }

  const jpeg = await sharp(Buffer.from(await response.arrayBuffer()))
    .rotate()
    .resize({ width: IMAGE_MAX_SIZE, height: IMAGE_MAX_SIZE, fit: "inside", withoutEnlargement: true })
    .flatten({ background: "#ffffff" })
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer();

  const form = new FormData();
  form.append("file", new Blob([new Uint8Array(jpeg)], { type: "image/jpeg" }), `${sku}.jpg`);
  form.append("fileName", sku);
  form.append("folderPath", HUBSPOT_FILES_FOLDER);
  // Mismo nombre en la misma carpeta: se reemplaza y la URL no cambia entre corridas.
  form.append(
    "options",
    JSON.stringify({ access: "PUBLIC_NOT_INDEXABLE", overwrite: true, duplicateValidationStrategy: "NONE" }),
  );

  const file = await hubspot<{ id: string; url?: string }>("/files/v3/files", { method: "POST", body: form });
  if (!file.url) {
    throw new Error("HubSpot no devolvió la URL del archivo subido.");
  }
  return file.url;
}

async function main() {
  if (!token) {
    throw new Error("Falta HUBSPOT_API_KEY en el entorno (.env.development, .env.local o .env).");
  }
  const invalidToken = describeInvalidToken(token);
  if (invalidToken) {
    throw new Error(invalidToken);
  }

  // Se importan después de cargar el entorno: prisma lee DATABASE_URL al iniciar.
  const { prisma } = await import("@/lib/prisma");
  const { slugify } = await import("@/lib/slug");
  const { selectDesignImagePath } = await import("@/lib/preview-thumbnails");

  try {
    const designs = await prisma.designs.findMany({
      where: {
        status: 1,
        name: { not: null },
        ...(siteOnly ? { showInSite: 1 } : {}),
        ...(Number.isInteger(onlyDesignId) ? { id: onlyDesignId } : {}),
      },
      orderBy: { id: "asc" },
      include: {
        material: { select: { name: true } },
        relDesignsCategories: {
          where: { status: 1, category: { status: 1 } },
          select: { category: { select: { name: true } } },
        },
        relDesignsFiles: {
          where: { status: 1, file: { status: 1, filePath: { not: null } } },
          select: { file: { select: { filePath: true, fileType: { select: { name: true } } } } },
        },
      },
    });

    type Design = (typeof designs)[number];

    // Campo del catálogo → posibles nombres internos de la propiedad en HubSpot.
    // Se usa el primero que exista en el portal; si ninguno existe, el campo no se envía.
    const fieldMappings: Array<{ field: string; candidates: string[]; value: (design: Design) => RawValue }> = [
      { field: "nombre", candidates: ["name"], value: (design) => design.name?.trim() },
      {
        field: "descripción",
        candidates: ["description"],
        value: (design) =>
          design.description?.trim() || design.seoDescription?.trim() || design.longDescription?.trim(),
      },
      { field: "precio unitario (precio sugerido)", candidates: ["price"], value: (design) => design.suggestedPrice },
      { field: "costo unitario (precio mínimo)", candidates: ["hs_cost_of_goods_sold"], value: (design) => design.minimumPrice },
      {
        field: "URL del producto",
        candidates: ["hs_url"],
        // Solo los publicados tienen página; los demás darían 404.
        value: (design) =>
          design.showInSite === 1 ? `${PRODUCT_URL_BASE}/productos/${design.id}-${slugify(design.name ?? "")}/` : null,
      },
      { field: "material", candidates: ["material", "materiales", "product_material"], value: (design) => design.material?.name?.trim() },
      {
        field: "categorías",
        candidates: ["categorias", "categoria", "categories", "product_categories"],
        value: (design) =>
          [...new Set(design.relDesignsCategories.map((relation) => relation.category?.name?.trim()).filter(Boolean))].join("; "),
      },
      { field: "precio de mayoreo", candidates: ["precio_mayoreo", "mayoreo", "wholesale_price"], value: (design) => design.mayoreo },
      { field: "tiempo de producción", candidates: ["tiempo_de_produccion", "tiempo_produccion", "production_time"], value: (design) => design.productionTime?.trim() },
      { field: "tiempo de envío", candidates: ["tiempo_de_envio", "tiempo_envio", "shipping_time"], value: (design) => design.shippingTime?.trim() },
      { field: "dimensiones", candidates: ["dimensiones", "dimensions"], value: (design) => design.dimensions?.trim() },
      { field: "disponibilidad", candidates: ["disponibilidad", "availability"], value: (design) => design.availability?.trim() },
      { field: "palabras clave", candidates: ["palabras_clave", "keywords"], value: (design) => design.keywords?.trim() },
      { field: "personalizable", candidates: ["personalizable", "es_personalizable", "is_customizable"], value: (design) => design.isCustomizable === 1 },
      { field: "probado", candidates: ["probado", "diseno_probado", "is_tested"], value: (design) => design.isTested === 1 },
      { field: "visible en sitio", candidates: ["visible_en_sitio", "publicado_en_sitio", "show_in_site"], value: (design) => design.showInSite === 1 },
      { field: "id del diseño", candidates: ["id_diseno", "design_id", "inspiraarte_id"], value: (design) => design.id },
    ];

    const { results: propertyList } = await hubspot<{ results: HubspotProperty[] }>("/crm/v3/properties/products");
    const properties = new Map(propertyList.map((property) => [property.name, property]));

    if (!properties.has("hs_sku")) {
      throw new Error("El portal no tiene la propiedad hs_sku en Productos; es la llave para emparejar.");
    }

    const isWritable = (property: HubspotProperty) =>
      !property.calculated && property.modificationMetadata?.readOnlyValue !== true;

    const activeMappings = fieldMappings.flatMap((mapping) => {
      const property = mapping.candidates.map((name) => properties.get(name)).find((item) => item && isWritable(item));
      return property ? [{ ...mapping, property }] : [];
    });
    const skippedFields = fieldMappings.filter((mapping) => !activeMappings.some((active) => active.field === mapping.field));
    const imageProperty = properties.get("hs_images");
    const syncImages = Boolean(imageProperty && isWritable(imageProperty));

    console.log(`[hubspot:sync-products] Propiedades de Productos en HubSpot: ${properties.size}`);
    console.log(
      `[hubspot:sync-products] Campos que se sincronizan: ${activeMappings.map((mapping) => `${mapping.field} → ${mapping.property.name}`).join(", ")}${syncImages ? ", imagen (archivo subido) → hs_images" : ""}`,
    );
    if (skippedFields.length > 0) {
      console.log(
        `[hubspot:sync-products] Sin propiedad en HubSpot (se omiten): ${skippedFields.map((mapping) => mapping.field).join(", ")}`,
      );
    }

    let unmatchedOptions = 0;

    // Convierte el valor al formato que espera el tipo de la propiedad; null = no enviar.
    function toHubspotValue(property: HubspotProperty, raw: RawValue): string | null {
      if (raw === null || raw === undefined || raw === "") {
        return null;
      }

      switch (property.type) {
        case "number": {
          const value = Number(raw);
          return Number.isFinite(value) && value > 0 ? String(value) : null;
        }
        case "bool":
          return typeof raw === "boolean" ? String(raw) : null;
        case "enumeration": {
          const options = (property.options ?? []).filter((option) => !option.hidden);
          const wanted = property.fieldType === "checkbox" ? String(raw).split(";").map((item) => item.trim()) : [String(raw)];
          const matched = wanted.map((item) =>
            options.find(
              (option) =>
                option.value.toLowerCase() === item.toLowerCase() || option.label.toLowerCase() === item.toLowerCase(),
            )?.value,
          );
          if (matched.some((value) => !value)) {
            unmatchedOptions += 1;
            return null;
          }
          return matched.join(";");
        }
        case "date":
        case "datetime":
          return null;
        default:
          return String(raw).slice(0, MAX_TEXT_LENGTH);
      }
    }

    // Productos existentes, con las propiedades que vamos a comparar.
    const compared = ["hs_sku", ...(syncImages ? ["hs_images"] : []), ...activeMappings.map((mapping) => mapping.property.name)];
    const existingBySku = new Map<string, HubspotProduct>();
    let duplicatedSkus = 0;
    let after: string | undefined;
    do {
      const query = new URLSearchParams({ limit: "100", properties: [...new Set(compared)].join(",") });
      if (after) {
        query.set("after", after);
      }
      const page = await hubspot<{ results: HubspotProduct[]; paging?: { next?: { after: string } } }>(
        `/crm/v3/objects/products?${query.toString()}`,
      );
      for (const product of page.results) {
        const sku = product.properties.hs_sku?.trim();
        if (!sku) {
          continue;
        }
        if (existingBySku.has(sku)) {
          duplicatedSkus += 1;
          continue;
        }
        existingBySku.set(sku, product);
      }
      after = page.paging?.next?.after;
    } while (after);

    // Pedidos ganados de cada producto, para guardarlos en Designs.requests.
    const dealIdsByProductId = await getDealIdsByProductId();
    const allDealIds = [...new Set([...dealIdsByProductId.values()].flatMap((deals) => [...deals]))];
    const wonDealIds = await getWonDealIds(allDealIds);
    console.log(
      `[hubspot:sync-products] Negocios con productos: ${allDealIds.length} | Ganados: ${wonDealIds.size}`,
    );
    const requestUpdates = designs.flatMap((design) => {
      const productId = existingBySku.get(productReference(design.id))?.id;
      const deals = productId ? dealIdsByProductId.get(productId) : undefined;
      const requests = deals ? [...deals].filter((dealId) => wonDealIds.has(dealId)).length : 0;
      return requests === design.requests ? [] : [{ id: design.id, sku: productReference(design.id), from: design.requests, to: requests }];
    });

    // HubSpot devuelve todo como texto: "250" y "250.0" son el mismo número.
    const sameValue = (current: string | null | undefined, next: string) => {
      const left = (current ?? "").trim();
      if (left === next) {
        return true;
      }
      const leftNumber = Number(left);
      const nextNumber = Number(next);
      return left !== "" && Number.isFinite(leftNumber) && Number.isFinite(nextNumber) && leftNumber === nextNumber;
    };

    const creates: Array<{ properties: Record<string, string> }> = [];
    const updates: Array<{ id: string; properties: Record<string, string> }> = [];
    // Cada trabajo escribe hs_images en el payload de su producto al terminar la subida.
    const imageJobs: Array<{ sku: string; sourceUrl: string; target: Record<string, string> }> = [];
    let unchanged = 0;

    for (const design of designs) {
      const sku = productReference(design.id);
      const values: Record<string, string> = {};
      for (const mapping of activeMappings) {
        const value = toHubspotValue(mapping.property, mapping.value(design));
        if (value !== null) {
          values[mapping.property.name] = value;
        }
      }

      const existing = existingBySku.get(sku);
      const imagePath = syncImages ? selectDesignImagePath(design.relDesignsFiles) : null;
      const needsImage = imagePath !== null && (refreshImages || !isHubspotHosted(existing?.properties.hs_images));
      const sourceUrl = imagePath ? `${mediaBaseUrl}/${imagePath.replace(/^\/+/, "")}` : "";

      if (!existing) {
        const properties = { ...values, hs_sku: sku };
        creates.push({ properties });
        if (needsImage) {
          imageJobs.push({ sku, sourceUrl, target: properties });
        }
        continue;
      }

      const changed: Record<string, string> = Object.fromEntries(
        Object.entries(values).filter(([name, value]) => !sameValue(existing.properties[name], value)),
      );
      if (Object.keys(changed).length === 0 && !needsImage) {
        unchanged += 1;
      } else {
        updates.push({ id: existing.id, properties: changed });
        if (needsImage) {
          imageJobs.push({ sku, sourceUrl, target: changed });
        }
      }
    }

    console.log(
      `[hubspot:sync-products] Diseños: ${designs.length}${siteOnly ? " (solo publicados)" : ""} | En HubSpot: ${existingBySku.size} | Nuevos: ${creates.length} | Con cambios: ${updates.length} | Sin cambios: ${unchanged} | Imágenes por subir: ${imageJobs.length} | Pedidos por actualizar: ${requestUpdates.length}`,
    );
    if (duplicatedSkus > 0) {
      console.warn(`[hubspot:sync-products] Aviso: ${duplicatedSkus} productos de HubSpot repiten SKU; se usa el primero.`);
    }
    if (unmatchedOptions > 0) {
      console.warn(
        `[hubspot:sync-products] Aviso: ${unmatchedOptions} valores no coinciden con las opciones de una propiedad de lista y se omitieron.`,
      );
    }

    if (dryRun) {
      const withImage = new Set(imageJobs.map((job) => job.target));
      const imageNote = (properties: Record<string, string>) => (withImage.has(properties) ? " + imagen" : "");
      for (const item of creates.slice(0, 5)) {
        console.log("  + crear", item.properties.hs_sku, JSON.stringify(item.properties).slice(0, 200) + imageNote(item.properties));
      }
      for (const item of updates.slice(0, 5)) {
        console.log("  ~ actualizar", item.id, JSON.stringify(item.properties).slice(0, 200) + imageNote(item.properties));
      }
      for (const update of requestUpdates.slice(0, 5)) {
        console.log("  # pedidos", update.sku, `${update.from} → ${update.to}`);
      }
      console.log("[hubspot:sync-products] --dry-run: no se escribió nada en HubSpot ni en SQLite.");
      return;
    }

    let uploadedImages = 0;
    let failedImages = 0;
    for (const batch of chunk(imageJobs, IMAGE_UPLOAD_CONCURRENCY)) {
      await Promise.all(
        batch.map(async (job) => {
          try {
            job.target.hs_images = await uploadProductImage(job.sku, job.sourceUrl);
            uploadedImages += 1;
          } catch (error) {
            failedImages += 1;
            console.warn(
              `[hubspot:sync-products] Imagen de ${job.sku} no subida: ${error instanceof Error ? error.message : error}`,
            );
          }
        }),
      );
    }
    if (imageJobs.length > 0) {
      console.log(`[hubspot:sync-products] Imágenes subidas: ${uploadedImages}${failedImages ? ` | Fallidas: ${failedImages}` : ""}`);
    }

    // Una actualización que solo traía imagen y falló se queda sin nada que enviar.
    const pendingUpdates = updates.filter((update) => Object.keys(update.properties).length > 0);

    let created = 0;
    let updated = 0;
    for (const batch of chunk(creates, BATCH_SIZE)) {
      const result = await hubspot<{ results: unknown[] }>("/crm/v3/objects/products/batch/create", {
        method: "POST",
        body: JSON.stringify({ inputs: batch }),
      });
      created += result.results.length;
    }
    for (const batch of chunk(pendingUpdates, BATCH_SIZE)) {
      const result = await hubspot<{ results: unknown[] }>("/crm/v3/objects/products/batch/update", {
        method: "POST",
        body: JSON.stringify({ inputs: batch }),
      });
      updated += result.results.length;
    }

    for (const update of requestUpdates) {
      await prisma.designs.update({ where: { id: update.id }, data: { requests: update.to } });
    }

    console.log(
      `[hubspot:sync-products] Listo. Creados: ${created} | Actualizados: ${updated} | Sin cambios: ${unchanged} | Pedidos actualizados en SQLite: ${requestUpdates.length}`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error("[hubspot:sync-products]", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
