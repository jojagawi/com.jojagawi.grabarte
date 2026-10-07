import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { byShowcasePriority, getSiteDesigns, type SiteDesign } from "@/lib/site-designs.server";

// Con menos diseños la página es delgada: se publica para navegar, pero no se indexa
// hasta tener catálogo o un texto introductorio propio.
export const MIN_INDEXABLE_CATEGORY_DESIGNS = 3;

export interface CategoryPage {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  designs: SiteDesign[];
}

export function getCategoryPath(slug: string): string {
  return `/productos/categoria/${slug}`;
}

export function isCategoryIndexable(category: CategoryPage): boolean {
  return category.designs.length >= MIN_INDEXABLE_CATEGORY_DESIGNS || Boolean(category.description);
}

// Una página por categoría activa con al menos un diseño publicado. El slug sale del nombre:
// si se renombra la categoría en /catalogos/categorias, su URL cambia en el siguiente build.
// cache(): el footer y la página la piden en el mismo render.
export const getCategoryPages = cache(async (): Promise<CategoryPage[]> => {
  const [categories, designs] = await Promise.all([
    prisma.catCategories.findMany({
      where: { status: 1, name: { not: null } },
      select: { id: true, name: true, description: true },
      orderBy: [{ name: "asc" }, { id: "asc" }],
    }),
    getSiteDesigns(),
  ]);

  const pages = categories.map((category) => ({
    id: category.id,
    slug: slugify(category.name ?? ""),
    name: category.name?.trim() ?? "",
    description: category.description?.replace(/\s+/gu, " ").trim() || null,
    designs: designs
      .filter((design) => design.relDesignsCategories.some((relation) => relation.category?.id === category.id))
      .sort(byShowcasePriority),
  }));

  // Dos nombres con el mismo slug ("Niños" y "Ninos") chocarían en la ruta: gana el primero.
  const seenSlugs = new Set<string>();
  return pages.filter((page) => {
    if (!page.slug || !page.name || page.designs.length === 0 || seenSlugs.has(page.slug)) {
      return false;
    }
    seenSlugs.add(page.slug);
    return true;
  });
});

export async function getCategoryPage(slug: string): Promise<CategoryPage | null> {
  return (await getCategoryPages()).find((category) => category.slug === slug) ?? null;
}

// Para enlazar desde otras páginas solo a categorías que tienen página.
export async function getCategoryPathsByName(): Promise<Map<string, string>> {
  return new Map((await getCategoryPages()).map((category) => [category.name, getCategoryPath(category.slug)]));
}
