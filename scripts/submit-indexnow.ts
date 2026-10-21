import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

// Avisa a IndexNow (Bing, Yandex, Seznam…) de las URLs nuevas o con <lastmod> distinto tras un
// deploy. Bing alimenta la búsqueda de ChatGPT y Copilot, así que es la vía más rápida para que
// vean una ficha nueva. Corre en build.yml en dos pasos:
//
//   pnpm run indexnow -- --snapshot   antes de subir a S3: guarda los lastmod del sitemap publicado
//   pnpm run indexnow                 después de subir: envía las URLs de out/ que cambiaron
//
// Sin snapshot (primer deploy o el sitemap publicado no respondió) envía todo el sitemap.
// La clave es pública por diseño (la generó Bing Webmaster): IndexNow la valida leyendo
// public/<clave>.txt en el dominio.

const INDEXNOW_KEY = "1bfac68ff84942e588f0f5b9174d53f0";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
// Límite del protocolo por solicitud.
const MAX_URLS_PER_REQUEST = 10000;

const ROOT = process.cwd();
const OUT_DIR = resolve(ROOT, "out");
const SNAPSHOT_FILE = resolve(ROOT, ".next", "indexnow-previous.json");

type LastmodByUrl = Record<string, string>;

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.inspiraarte.com").replace(/\/+$/u, "");

function parseUrls(xml: string): LastmodByUrl {
  const entries: LastmodByUrl = {};
  for (const [, block] of xml.matchAll(/<url>([\s\S]*?)<\/url>/gu)) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/u)?.[1].trim();
    if (loc) {
      entries[loc] = block.match(/<lastmod>([^<]+)<\/lastmod>/u)?.[1].trim() ?? "";
    }
  }
  return entries;
}

function sitemapParts(indexXml: string): string[] {
  return [...indexXml.matchAll(/<sitemap>[\s\S]*?<loc>([^<]+)<\/loc>/gu)].map((match) => match[1].trim());
}

async function readPublishedSitemap(): Promise<LastmodByUrl> {
  const fetchText = async (url: string) => {
    const response = await fetch(url, { headers: { "cache-control": "no-cache" } });
    if (!response.ok) {
      throw new Error(`${url} respondió ${response.status}`);
    }
    return response.text();
  };

  const index = await fetchText(`${siteUrl}/sitemap.xml`);
  const parts = sitemapParts(index);
  const documents = parts.length > 0 ? await Promise.all(parts.map(fetchText)) : [index];
  return Object.assign({}, ...documents.map(parseUrls));
}

async function readBuiltSitemap(): Promise<LastmodByUrl> {
  const files = (await readdir(OUT_DIR)).filter((name) => /^sitemap(-\d+)?\.xml$/u.test(name) && name !== "sitemap.xml");
  const names = files.length > 0 ? files : ["sitemap.xml"];
  const documents = await Promise.all(names.map((name) => readFile(resolve(OUT_DIR, name), "utf8")));
  return Object.assign({}, ...documents.map(parseUrls));
}

async function saveSnapshot() {
  try {
    const published = await readPublishedSitemap();
    await mkdir(dirname(SNAPSHOT_FILE), { recursive: true });
    await writeFile(SNAPSHOT_FILE, JSON.stringify(published, null, 2), "utf8");
    console.log(`indexnow: ${Object.keys(published).length} URLs del sitemap publicado guardadas.`);
  } catch (error) {
    // Sin snapshot el envío manda todo el sitemap: no vale la pena detener el deploy.
    console.warn(`indexnow: no se pudo leer el sitemap publicado (${error instanceof Error ? error.message : error}).`);
  }
}

async function submitChanges() {
  const built = await readBuiltSitemap();
  const previous: LastmodByUrl | null = existsSync(SNAPSHOT_FILE) ? JSON.parse(await readFile(SNAPSHOT_FILE, "utf8")) : null;

  const changed = Object.entries(built)
    .filter(([loc, lastmod]) => !previous || previous[loc] !== lastmod)
    .map(([loc]) => loc);

  if (changed.length === 0) {
    console.log("indexnow: sin URLs nuevas ni modificadas.");
    return;
  }

  const host = new URL(siteUrl).host;
  for (let start = 0; start < changed.length; start += MAX_URLS_PER_REQUEST) {
    const urlList = changed.slice(start, start + MAX_URLS_PER_REQUEST);
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host, key: INDEXNOW_KEY, keyLocation: `${siteUrl}/${INDEXNOW_KEY}.txt`, urlList }),
    });
    // 200 y 202 son éxito; 202 significa que la clave aún se está validando.
    if (response.status !== 200 && response.status !== 202) {
      throw new Error(`IndexNow respondió ${response.status}: ${await response.text()}`);
    }
  }

  console.log(`indexnow: ${changed.length} URLs enviadas${previous ? "" : " (sin snapshot: sitemap completo)"}.`);
  changed.slice(0, 20).forEach((loc) => console.log(`  ${loc}`));
}

(process.argv.includes("--snapshot") ? saveSnapshot() : submitChanges()).catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
