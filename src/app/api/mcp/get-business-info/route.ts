import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = false;

function parseSchedules(rawSchedules: string): Array<{ dayRange: string; hours: string }> {
  return rawSchedules
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const [dayRange, ...hoursParts] = item.split(":");
      const hours = hoursParts.join(":").trim();

      return {
        dayRange: dayRange?.trim() || "Horario",
        hours: hours || "No disponible",
      };
    });
}

export async function GET() {
  const email = process.env.NEXT_PUBLIC_EMAIL || "contacto@inspiraarte.com";
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP || "";
  const address = process.env.NEXT_PUBLIC_DIR || "Ciudad de México, México";
  const schedules = parseSchedules(process.env.NEXT_PUBLIC_SCHEDULES || "");

  return NextResponse.json({
    success: true,
    data: {
      businessName: process.env.NEXT_PUBLIC_SITENAME || "InspiraArte",
      email,
      whatsapp,
      address,
      schedules,
      contactUrl: "/contacto",
      social: {
        instagram: process.env.NEXT_PUBLIC_INSTAGRAM || null,
        facebook: process.env.NEXT_PUBLIC_FACEBOOK || null,
        tiktok: process.env.NEXT_PUBLIC_TIKTOK || null,
      },
    },
  });
}

