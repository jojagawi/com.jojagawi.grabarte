import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { prisma } from "@/lib/prisma";
import { SEASON_PAGE_STATUSES } from "@/lib/seasons";
import { slugify } from "@/lib/slug";

// Fecha real de última modificación por URL para el <lastmod> del sitemap. next-sitemap.config.cjs
// lee el JSON; una ruta que no aparece aquí sale sin lastmod (mejor que una fecha falsa, que hace
// que Google deje de confiar en el campo para todo el sitio).
//
//   fichas      Designs.updatedAt
//   categorías  la ficha más reciente de la categoría
//   temporadas  la ficha más reciente o la edición de la temporada (CatSeasons.updatedAt)
//   resto       último commit del page.tsx de la ruta; los listados y la portada también
//               toman la ficha más reciente, porque la muestran
//
// Corre en postbuild, antes de build:sitemap.

const ROOT = process.cwd();
const SITEMAP_LASTMOD_FILE = resolve(ROOT, ".next", "sitemap-lastmod.json");

// Rutas sin segmentos dinámicos que van al sitemap. El panel y los formularios no entran.
const STATIC_ROUTES: Record<string, string[]> = {
  "/": ["src/app/page.tsx"],
  "/aviso-de-privacidad": ["src/app/aviso-de-privacidad/page.tsx"],
  "/contacto": ["src/app/contacto/page.tsx"],
  "/faq": ["src/app/faq/page.tsx", "src/lib/faq-data.ts"],
  "/nosotros": ["src/app/nosotros/page.tsx"],
  "/proceso": ["src/app/proceso/page.tsx"],
  "/productos": ["src/app/productos/page.tsx"],
  "/temporada": ["src/app/temporada/page.tsx"],
  "/terminos-y-condiciones": ["src/app/terminos-y-condiciones/page.tsx"],
};

// Listados que cambian cuando cambia cualquier ficha publicada.
const CATALOG_ROUTES = new Set(["/", "/productos", "/temporada"]);

function latest(dates: Array<Date | null | undefined>): Date | null {
  return dates.reduce<Date | null>((max, date) => (date && (!max || date > max) ? date : max), null);
}

function gitLastCommitDate(files: string[]): Date | null {
  const existing = files.filter((file) => existsSync(resolve(ROOT, file)));
  if (existing.length === 0) {
    return null;
  }

  try {
    const output = execFileSync("git", ["log", "-1", "--format=%cI", "--", ...existing], {
      cwd: ROOT,
      encoding: "utf8",
    }).trim();
    return output ? new Date(output) : null;
  } catch {
    // Sin git (por ejemplo, un build desde un zip): esas rutas salen sin lastmod.
    return null;
  }
}

async function main() {
  try {
    const [designs, categories, seasons] = await Promise.all([
      prisma.designs.findMany({
        where: { status: 1, showInSite: 1, name: { not: null } },
        select: {
          id: true,
          name: true,
          updatedAt: true,
          relDesignsCategories: {
            where: { status: 1, category: { status: 1, name: { not: null } } },
            select: { categoryId: true },
          },
        },
      }),
      prisma.catCategories.findMany({
        where: { status: 1, name: { not: null } },
        select: { id: true, name: true },
        orderBy: [{ name: "asc" }, { id: "asc" }],
      }),
      prisma.catSeasons.findMany({
        where: { status: { in: SEASON_PAGE_STATUSES } },
        select: {
          slug: true,
          updatedAt: true,
          relSeasonsCategories: { where: { category: { status: 1 } }, select: { categoryId: true } },
        },
      }),
    ]);

    const lastmodByPath: Record<string, string> = {};
    const setLastmod = (path: string, date: Date | null) => {
      if (date && !Number.isNaN(date.getTime())) {
        lastmodByPath[path] = date.toISOString();
      }
    };

    for (const design of designs) {
      setLastmod(`/productos/${design.id}-${slugify(design.name ?? "Diseño sin nombre")}`, design.updatedAt);
    }

    const latestByCategory = (categoryIds: number[]) =>
      latest(
        designs
          .filter((design) =>
            design.relDesignsCategories.some(
              (relation) => relation.categoryId !== null && categoryIds.includes(relation.categoryId),
            ),
          )
          .map((design) => design.updatedAt),
      );

    // Mismo slug que categories.server.ts: si dos nombres chocan, gana el primero.
    const seenSlugs = new Set<string>();
    for (const category of categories) {
      const slug = slugify(category.name ?? "");
      if (!slug || seenSlugs.has(slug)) {
        continue;
      }
      seenSlugs.add(slug);
      setLastmod(`/productos/categoria/${slug}`, latestByCategory([category.id]));
    }

    for (const season of seasons) {
      const categoryIds = season.relSeasonsCategories.map((relation) => relation.categoryId);
      setLastmod(`/temporada/${season.slug}`, latest([season.updatedAt, latestByCategory(categoryIds)]));
    }

    const latestDesign = latest(designs.map((design) => design.updatedAt));
    const latestSeason = latest(seasons.map((season) => season.updatedAt));
    for (const [path, files] of Object.entries(STATIC_ROUTES)) {
      const fileDate = gitLastCommitDate(files);
      setLastmod(
        path,
        CATALOG_ROUTES.has(path)
          ? latest([fileDate, latestDesign, path === "/temporada" ? latestSeason : null])
          : fileDate,
      );
    }

    await mkdir(dirname(SITEMAP_LASTMOD_FILE), { recursive: true });
    await writeFile(SITEMAP_LASTMOD_FILE, `${JSON.stringify(lastmodByPath, null, 2)}\n`, "utf8");
    console.log(`[build:sitemap-lastmod] ${Object.keys(lastmodByPath).length} rutas con lastmod en ${SITEMAP_LASTMOD_FILE}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error("[build:sitemap-lastmod]", error);
  process.exitCode = 1;
});
