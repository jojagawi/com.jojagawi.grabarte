import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { countWords, extractFaq, findProductReferences, parseFrontmatter } from "@/lib/blog";
import { BLOG_DIR } from "@/lib/blog.server";
import { prisma } from "@/lib/prisma";
import { SEASON_PAGE_STATUSES } from "@/lib/seasons";

// Revisa los artículos de content/blog antes de publicarlos: los escriba una persona o la rutina
// de borradores (docs/blog-rutina.md). Un error hace fallar el CI; un aviso solo se imprime.
//
//   pnpm run blog:check

const MIN_WORDS = 700;
const MAX_WORDS = 1400;
const MAX_TITLE_LENGTH = 60;
const MAX_DESCRIPTION_LENGTH = 160;
const MIN_FAQ = 3;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;

// Términos del análisis de palabras clave: en México se busca "nacimiento".
const DISCOURAGED_TERMS: Array<[RegExp, string]> = [[/\bpesebres?\b/iu, 'usa "nacimiento" en lugar de "pesebre"']];

interface Finding {
  file: string;
  level: "error" | "aviso";
  message: string;
}

async function main() {
  const files = (await readdir(BLOG_DIR).catch(() => [] as string[])).filter((file) => file.endsWith(".md"));
  const [designs, seasons] = await Promise.all([
    prisma.designs.findMany({ where: { status: 1, showInSite: 1, name: { not: null } }, select: { id: true } }),
    prisma.catSeasons.findMany({ where: { status: { in: SEASON_PAGE_STATUSES } }, select: { slug: true } }),
  ]);
  const visibleIds = new Set(designs.map((design) => design.id));
  const seasonSlugs = new Set(seasons.map((season) => season.slug));
  const findings: Finding[] = [];

  for (const file of files) {
    const add = (level: Finding["level"], message: string) => findings.push({ file, level, message });
    let parsed: ReturnType<typeof parseFrontmatter>;
    try {
      parsed = parseFrontmatter(await readFile(join(BLOG_DIR, file), "utf8"), file);
    } catch (error) {
      add("error", error instanceof Error ? error.message : String(error));
      continue;
    }

    const { data, body } = parsed;
    // Un borrador puede estar a medias: lo que falte se marca como aviso hasta que se publique.
    const strict = data.status === "published" ? "error" : "aviso";

    if (!SLUG_PATTERN.test(file.replace(/\.md$/u, ""))) {
      add("error", "el nombre del archivo debe ser un slug: minúsculas, números y guiones");
    }
    if (data.title.length > MAX_TITLE_LENGTH) {
      add(strict, `título de ${data.title.length} caracteres (máximo ${MAX_TITLE_LENGTH})`);
    }
    if (data.description.length > MAX_DESCRIPTION_LENGTH) {
      add(strict, `descripción de ${data.description.length} caracteres (máximo ${MAX_DESCRIPTION_LENGTH})`);
    }
    if (data.season && !seasonSlugs.has(data.season)) {
      add("error", `la temporada "${data.season}" no existe o está inactiva en /catalogos/temporadas`);
    }
    if (data.updatedAt < data.publishAt) {
      add("error", "updatedAt es anterior a publishAt");
    }

    if (data.products.length === 0) {
      add(strict, "sin productos en el encabezado");
    }
    for (const id of new Set([...data.products, ...findProductReferences(body)])) {
      if (!visibleIds.has(id)) {
        add("error", `el producto ${id} no existe o no se muestra en el sitio`);
      }
    }

    // Precios y fichas solo con {{precio:ID}} y producto:ID, para que salgan de la base. Un monto
    // suelto ("menos de $100") es un presupuesto; junto a un producto sería su precio escrito a mano.
    if (body.split("\n").some((line) => line.includes("(producto:") && /\$\s?\d/u.test(line))) {
      add(strict, "precio escrito a mano junto a un producto: usa {{precio:ID}}");
    }
    if (/\]\(\/productos\/\d+/u.test(body)) {
      add("error", "enlace escrito a mano a una ficha: usa [texto](producto:ID)");
    }

    const words = countWords(body);
    if (words < MIN_WORDS || words > MAX_WORDS) {
      add(strict, `${words} palabras (entre ${MIN_WORDS} y ${MAX_WORDS})`);
    }

    const faq = extractFaq(body);
    if (faq.length < MIN_FAQ) {
      add(strict, `${faq.length} preguntas en "## Preguntas frecuentes" (mínimo ${MIN_FAQ}, cada una como ###)`);
    }
    if (data.season && !body.includes(`/temporada/${data.season}/`)) {
      add("aviso", `no enlaza a la guía de su temporada (/temporada/${data.season}/)`);
    }
    for (const [pattern, message] of DISCOURAGED_TERMS) {
      if (pattern.test(`${data.title}\n${body}`)) {
        add("aviso", message);
      }
    }
  }

  for (const finding of findings) {
    console.log(`${finding.level === "error" ? "✖" : "⚠"} ${finding.file}: ${finding.message}`);
  }
  const errors = findings.filter((finding) => finding.level === "error").length;
  console.log(`[blog:check] ${files.length} artículos, ${errors} errores, ${findings.length - errors} avisos`);
  if (errors > 0) {
    process.exitCode = 1;
  }
}

main()
  .catch((error: unknown) => {
    console.error("[blog:check]", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
