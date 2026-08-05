import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

export const dynamic = "force-static";
export const revalidate = false;

function toMediaUrl(path: string | null): string | null {
  if (!path) {
    return null;
  }

  const protocol = process.env.NEXT_PUBLIC_S3_PROTOCOL || "https";
  const host = process.env.NEXT_PUBLIC_S3 || "dam.inspiraarte.com";

  return `${protocol}://${host}/${path.replace(/^\/+/, "")}`;
}

function parseLimit(raw: string | null): number {
  const parsed = Number(raw ?? "8");
  if (!Number.isInteger(parsed)) {
    return 8;
  }

  return Math.min(20, Math.max(1, parsed));
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get("q") || "").trim();
    const categoryName = (searchParams.get("category") || "").trim();
    const limit = parseLimit(searchParams.get("limit"));

    const normalizedQuery = query.length > 0 ? query : undefined;

    const designs = await prisma.designs.findMany({
      where: {
        status: 1,
        showInSite: 1,
        name: { not: null },
        ...(categoryName
          ? {
              relDesignsCategories: {
                some: {
                  status: 1,
                  category: {
                    status: 1,
                    name: {
                      contains: categoryName,
                    },
                  },
                },
              },
            }
          : {}),
        ...(normalizedQuery
          ? {
              OR: [
                {
                  name: {
                    contains: normalizedQuery,
                  },
                },
                {
                  description: {
                    contains: normalizedQuery,
                  },
                },
                {
                  relDesignsCategories: {
                    some: {
                      status: 1,
                      category: {
                        status: 1,
                        name: {
                          contains: normalizedQuery,
                        },
                      },
                    },
                  },
                },
              ],
            }
          : {}),
      },
      select: {
        id: true,
        name: true,
        description: true,
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
              filePath: { not: null },
              fileTypeId: { in: [1, 2] },
            },
          },
          select: {
            file: {
              select: {
                fileTypeId: true,
                filePath: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    const items = designs
      .filter((design): design is typeof design & { name: string } => Boolean(design.name?.trim()))
      .map((design) => {
        const previewPath = design.relDesignsFiles.find((relation) => relation.file?.fileTypeId === 1)?.file?.filePath;
        const firstImagePath = design.relDesignsFiles.find((relation) => relation.file?.filePath)?.file?.filePath;

        return {
          id: design.id,
          name: design.name,
          description: design.description?.trim() || "Producto personalizado disponible bajo cotización.",
          categories: Array.from(
            new Set(
              design.relDesignsCategories
                .map((relation) => relation.category?.name)
                .filter((name): name is string => Boolean(name?.trim())),
            ),
          ),
          image: toMediaUrl(previewPath || firstImagePath || null),
          url: `/productos/${design.id}-${slugify(design.name)}`,
        };
      });

    return NextResponse.json({
      success: true,
      data: items,
      meta: {
        total: items.length,
        query,
        category: categoryName,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        errorCode: "MCP_SEARCH_PRODUCTS_ERROR",
        message: "No fue posible buscar productos.",
      },
      { status: 500 },
    );
  }
}

