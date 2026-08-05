import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

export const dynamic = "force-static";
export const revalidate = false;

function parseIdSlug(value: string): { id: number } | null {
  const match = /^(\d+)-(.+)$/u.exec(value);
  if (!match) {
    return null;
  }

  const id = Number(match[1]);
  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return { id };
}

function toMediaUrl(path: string | null): string | null {
  if (!path) {
    return null;
  }

  const protocol = process.env.NEXT_PUBLIC_S3_PROTOCOL || "https";
  const host = process.env.NEXT_PUBLIC_S3 || "dam.inspiraarte.com";

  return `${protocol}://${host}/${path.replace(/^\/+/, "")}`;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawId = (searchParams.get("id") || "").trim();
    const idSlug = (searchParams.get("idSlug") || "").trim();

    let id: number | null = null;

    if (rawId) {
      const parsedId = Number(rawId);
      if (Number.isInteger(parsedId) && parsedId > 0) {
        id = parsedId;
      }
    }

    if (!id && idSlug) {
      id = parseIdSlug(idSlug)?.id ?? null;
    }

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          errorCode: "MCP_GET_PRODUCT_DETAIL_BAD_INPUT",
          message: "Debes enviar id o idSlug válido.",
        },
        { status: 400 },
      );
    }

    const design = await prisma.designs.findFirst({
      where: {
        id,
        status: 1,
        showInSite: 1,
        name: { not: null },
      },
      select: {
        id: true,
        name: true,
        description: true,
        suggestedPrice: true,
        minimumPrice: true,
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
    });

    if (!design?.name) {
      return NextResponse.json(
        {
          success: false,
          errorCode: "MCP_GET_PRODUCT_DETAIL_NOT_FOUND",
          message: "No se encontró el producto solicitado.",
        },
        { status: 404 },
      );
    }

    const categories = Array.from(
      new Set(
        design.relDesignsCategories
          .map((relation) => relation.category?.name)
          .filter((name): name is string => Boolean(name?.trim())),
      ),
    );

    const previewPath = design.relDesignsFiles.find((relation) => relation.file?.fileTypeId === 1)?.file?.filePath;

    const gallery = design.relDesignsFiles
      .filter((relation) => relation.file?.fileTypeId === 2)
      .map((relation) => toMediaUrl(relation.file?.filePath || null))
      .filter((value): value is string => Boolean(value));

    const canonicalSlug = `${design.id}-${slugify(design.name)}`;

    return NextResponse.json({
      success: true,
      data: {
        id: design.id,
        name: design.name,
        description: design.description?.trim() || "Producto personalizado disponible bajo cotización.",
        categories,
        material: design.material?.name?.trim() || null,
        suggestedPrice: design.suggestedPrice,
        minimumPrice: design.minimumPrice,
        image: toMediaUrl(previewPath || null),
        gallery,
        url: `/productos/${canonicalSlug}`,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        errorCode: "MCP_GET_PRODUCT_DETAIL_ERROR",
        message: "No fue posible obtener el detalle del producto.",
      },
      { status: 500 },
    );
  }
}

