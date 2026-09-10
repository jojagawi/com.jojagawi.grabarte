import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-static";
export const revalidate = false;

const VALID_MODES = ["complement", "rewrite-soft", "rewrite-hard"] as const;

function normalizeMode(value: unknown) {
  const mode = String(value ?? "").trim();
  return VALID_MODES.includes(mode as (typeof VALID_MODES)[number])
    ? mode
    : "rewrite-soft";
}

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const profiles = await prisma.seoWriterProfiles.findMany({
    where: { status: 1 },
    orderBy: [{ isDefault: "desc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      tone: true,
      audience: true,
      defaultMode: true,
      instructions: true,
      isDefault: true,
    },
  });

  return NextResponse.json(
    profiles.map((profile) => ({
      ...profile,
      isDefault: profile.isDefault === 1,
    })),
  );
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = (await request.json().catch(() => null)) as
    | {
        name?: string;
        tone?: string;
        audience?: string;
        defaultMode?: string;
        instructions?: string;
        isDefault?: boolean;
      }
    | null;

  const name = String(body?.name ?? "").trim();
  const tone = String(body?.tone ?? "").trim();
  const audience = String(body?.audience ?? "").trim() || null;
  const defaultMode = normalizeMode(body?.defaultMode);
  const instructions = String(body?.instructions ?? "").trim();
  const isDefault = body?.isDefault === true;

  if (!name || !tone || !instructions) {
    return NextResponse.json(
      { error: "Nombre, tono e instrucciones son obligatorios" },
      { status: 400 },
    );
  }

  const existing = await prisma.seoWriterProfiles.findFirst({
    where: { name },
    select: { id: true },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Ya existe un perfil con ese nombre" },
      { status: 409 },
    );
  }

  await prisma.$transaction(async (tx) => {
    if (isDefault) {
      await tx.seoWriterProfiles.updateMany({
        where: { isDefault: 1 },
        data: { isDefault: 0 },
      });
    }

    await tx.seoWriterProfiles.create({
      data: {
        name,
        tone,
        audience,
        defaultMode,
        instructions,
        isDefault: isDefault ? 1 : 0,
        status: 1,
      },
    });
  });

  const created = await prisma.seoWriterProfiles.findFirst({
    where: { name },
    select: {
      id: true,
      name: true,
      tone: true,
      audience: true,
      defaultMode: true,
      instructions: true,
      isDefault: true,
    },
  });

  return NextResponse.json(
    {
      id: created?.id ?? 0,
      name: created?.name ?? name,
      tone: created?.tone ?? tone,
      audience: created?.audience ?? audience,
      defaultMode: created?.defaultMode ?? defaultMode,
      instructions: created?.instructions ?? instructions,
      isDefault: created?.isDefault === 1,
    },
    { status: 201 },
  );
}

export async function PUT(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = (await request.json().catch(() => null)) as
    | {
        id?: number;
        name?: string;
        tone?: string;
        audience?: string;
        defaultMode?: string;
        instructions?: string;
        isDefault?: boolean;
      }
    | null;

  const id = Number(body?.id ?? 0);
  const name = String(body?.name ?? "").trim();
  const tone = String(body?.tone ?? "").trim();
  const audience = String(body?.audience ?? "").trim() || null;
  const defaultMode = normalizeMode(body?.defaultMode);
  const instructions = String(body?.instructions ?? "").trim();
  const isDefault = body?.isDefault === true;

  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "ID de perfil invalido" }, { status: 400 });
  }

  if (!name || !tone || !instructions) {
    return NextResponse.json(
      { error: "Nombre, tono e instrucciones son obligatorios" },
      { status: 400 },
    );
  }

  const existing = await prisma.seoWriterProfiles.findFirst({
    where: { id, status: 1 },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
  }

  const duplicateName = await prisma.seoWriterProfiles.findFirst({
    where: {
      id: { not: id },
      name,
      status: 1,
    },
    select: { id: true },
  });

  if (duplicateName) {
    return NextResponse.json(
      { error: "Ya existe un perfil con ese nombre" },
      { status: 409 },
    );
  }

  await prisma.$transaction(async (tx) => {
    if (isDefault) {
      await tx.seoWriterProfiles.updateMany({
        where: { isDefault: 1 },
        data: { isDefault: 0 },
      });
    }

    await tx.seoWriterProfiles.update({
      where: { id },
      data: {
        name,
        tone,
        audience,
        defaultMode,
        instructions,
        isDefault: isDefault ? 1 : 0,
      },
    });
  });

  const updated = await prisma.seoWriterProfiles.findFirst({
    where: { id },
    select: {
      id: true,
      name: true,
      tone: true,
      audience: true,
      defaultMode: true,
      instructions: true,
      isDefault: true,
    },
  });

  return NextResponse.json({
    id: updated?.id ?? id,
    name: updated?.name ?? name,
    tone: updated?.tone ?? tone,
    audience: updated?.audience ?? audience,
    defaultMode: updated?.defaultMode ?? defaultMode,
    instructions: updated?.instructions ?? instructions,
    isDefault: updated?.isDefault === 1,
  });
}

