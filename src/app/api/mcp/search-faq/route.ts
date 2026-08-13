import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-static";
export const revalidate = false;

const isStaticExport = process.env.STATIC_EXPORT === "true";


function parseLimit(raw: string | null): number {
  const parsed = Number(raw ?? "5");
  if (!Number.isInteger(parsed)) {
    return 5;
  }

  return Math.min(20, Math.max(1, parsed));
}

export async function GET(request: Request) {
  try {
    if (isStaticExport) {
      return NextResponse.json(
        {
          success: false,
          errorCode: "MCP_STATIC_EXPORT_UNAVAILABLE",
          message: "Ruta API no disponible en export estático.",
        },
        { status: 501 },
      );
    }

    const { searchParams } = new URL(request.url);
    const query = (searchParams.get("q") || "").trim().toLowerCase();
    const limit = parseLimit(searchParams.get("limit"));

    const faqs = await prisma.faqs.findMany({
      where: {
        showInMcp: 1,
      },
      select: {
        question: true,
        answer: true,
      },
      orderBy: [
        {
          priority: "asc",
        },
        {
          id: "asc",
        },
      ],
    });

    const results = faqs
      .filter((faq) => {
        if (!query) {
          return true;
        }

        return faq.question.toLowerCase().includes(query) || faq.answer.toLowerCase().includes(query);
      })
      .slice(0, limit)
      .map((faq) => ({
        question: faq.question,
        answer: faq.answer,
      }));

    return NextResponse.json({
      success: true,
      data: results,
      meta: {
        total: results.length,
        query,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        errorCode: "MCP_SEARCH_FAQ_ERROR",
        message: "No se pudieron consultar las preguntas frecuentes.",
      },
      { status: 500 },
    );
  }
}

