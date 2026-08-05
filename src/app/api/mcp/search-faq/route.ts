import { NextResponse } from "next/server";
import { faqEntries } from "@/lib/faq-data";

export const dynamic = "force-static";
export const revalidate = false;

function parseLimit(raw: string | null): number {
  const parsed = Number(raw ?? "5");
  if (!Number.isInteger(parsed)) {
    return 5;
  }

  return Math.min(20, Math.max(1, parsed));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") || "").trim().toLowerCase();
  const limit = parseLimit(searchParams.get("limit"));

  const results = faqEntries
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
}

