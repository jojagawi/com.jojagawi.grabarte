import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-static";
export const revalidate = false;

export async function GET() {
  try {
    const categories = await prisma.catCategories.findMany({
      where: {
        status: 1,
        name: { not: null },
        relDesignsCategories: {
          some: {
            status: 1,
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
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      data: categories.map((category) => ({
        id: category.id,
        name: category.name,
      })),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        errorCode: "MCP_LIST_CATEGORIES_ERROR",
        message: "No fue posible obtener categorías.",
      },
      { status: 500 },
    );
  }
}

