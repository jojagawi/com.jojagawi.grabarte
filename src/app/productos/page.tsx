import { Metadata } from "next";
import Link from "next/link";
import { getCategoryPages, getCategoryPath } from "@/lib/categories.server";
import { buildPageMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import { selectDesignCardImagePath } from "@/lib/preview-thumbnails";
import { slugify } from "@/lib/slug";
import { buildCollectionPageJsonLd, serializeJsonLd } from "@/lib/structured-data";
import { Products } from "@/components/custom/products";

const CATALOG_DESCRIPTION =
  "Explora nuestro catálogo por categorías y encuentra diseños personalizados para regalos, eventos y proyectos corporativos.";

export const metadata: Metadata = buildPageMetadata({
  title: "Catálogo de productos personalizados | InspiraArte",
  description: CATALOG_DESCRIPTION,
  path: "/productos",
  keywords: [
    "catálogo de productos",
    "productos personalizados",
    "diseños personalizados",
    "regalos",
    "InspiraArte",
  ],
});

const defaultImage = "/dam/default-image-product.webp";

const cardGradients = [
  "from-primary/10 to-inspirarte-teal/10",
  "from-inspirarte-teal/10 to-[#3ACBFE]/10",
  "from-[#585106]/10 to-primary/10",
  "from-[#00B003]/10 to-inspirarte-teal/10",
];

export default async function Productos() {
  const isDevelopment = process.env.NODE_ENV === "development";

  const categories = await prisma.catCategories.findMany({
    where: {
      relDesignsCategories: {
        some: {
          design: {
            status: 1,
            showInSite: 1,
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
      icon: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  const designs = await prisma.designs.findMany({
    where: {
      ...(isDevelopment ? {} : { status: 1, showInSite: 1 }),
      name: { not: null },
    },
    select: {
      id: true,
      name: true,
      description: true,
      isCustomizable: true,
      status: true,
      isTested: true,
      showInHome: true,
      showInSite: true,
      material: {
        select: {
          name: true,
        },
      },
      relDesignsCategories: {
        where: {
          status: 1,
          category: {
            status: 1,
            name: { not: null },
          },
        },
        select: {
          category: {
            select: {
              name: true,
            },
          },
        },
      },
      relDesignsFiles: {
        where: {
          status: 1,
          file: {
            status: 1,
            fileTypeId: 1,
            filePath: { not: null },
          },
        },
        select: {
          file: {
            select: {
              filePath: true,
              thumbGenerated: true,
              fileType: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const mediaBaseUrl = (process.env.NEXT_PUBLIC_S3_PROTOCOL || "http").concat("://").concat(
    process.env.NEXT_PUBLIC_S3 || "/dam/files/",
  );

  const products = designs.map((design, index) => {
    // Miniatura de IA si existe; si no, la vista previa original.
    const selectedPath = selectDesignCardImagePath(design.relDesignsFiles);

    const image =
      selectedPath && mediaBaseUrl
        ? `${mediaBaseUrl}/${selectedPath.replace(/^\/+/, "")}`
        : defaultImage;

    const designCategories = Array.from(
      new Set(
        design.relDesignsCategories
          .map((relation) => relation.category?.name)
          .filter((name): name is string => Boolean(name?.trim())),
      ),
    );

    return {
      id: design.id,
      name: design.name ?? "Diseño sin nombre",
      description: design.description?.trim() || "Diseño personalizado disponible bajo cotización.",
      image,
      color: cardGradients[index % cardGradients.length],
      categories: designCategories,
      materialName: design.material?.name?.trim() || null,
      isCustomizable: Number(design.isCustomizable) === 1,
      isActive: Number(design.status) === 1,
      isTested: Number(design.isTested) === 1,
      showInHome: Number(design.showInHome) === 1,
      showInSite: Number(design.showInSite) === 1,
    };
  });

  const materialOptions = Array.from(
    new Set(
      designs
        .map((design) => design.material?.name?.trim())
        .filter((materialName): materialName is string => Boolean(materialName)),
    ),
  ).sort((a, b) => a.localeCompare(b));

  // Los chips del catálogo filtran en el cliente; estos enlaces llevan a la página indexable de cada categoría.
  const categoryPages = await getCategoryPages();
  const collectionJsonLd = buildCollectionPageJsonLd({
    path: "/productos/",
    name: "Catálogo de productos personalizados",
    description: CATALOG_DESCRIPTION,
    breadcrumbs: [
      { name: "Inicio", path: "/" },
      { name: "Productos", path: "/productos/" },
    ],
    items: products.map((product) => ({
      name: product.name,
      path: `/productos/${product.id}-${slugify(product.name)}/`,
      image: product.image,
    })),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(collectionJsonLd) }}
      />
      <Products
        enableDevFilters={isDevelopment}
        categories={categories.map((category) => ({
          id: category.id,
          name: category.name ?? "Sin nombre",
          icon: category.icon?.trim() || null,
        }))}
        materialOptions={materialOptions}
        products={products}
      />
      {categoryPages.length > 0 && (
        <nav aria-labelledby="categorias-titulo" className="pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 id="categorias-titulo" className="mb-6 font-serif text-2xl font-bold text-foreground sm:text-3xl">
              Explora por categoría
            </h2>
            <ul className="flex flex-wrap gap-3">
              {categoryPages.map((category) => (
                <li key={category.id}>
                  <Link
                    href={getCategoryPath(category.slug)}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    {category.name}
                    <span className="text-muted-foreground">({category.designs.length})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}
    </>
  );
}
