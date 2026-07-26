import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function parseOptionalInt(value: FormDataEntryValue | null) {
  const numeric = Number(String(value ?? "").trim());
  return Number.isFinite(numeric) ? numeric : null;
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const formData = await request.formData();
  console.log(formData);

  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    return NextResponse.json(
      { error: "El nombre es obligatorio" },
      { status: 400 },
    );
  }

  const categoryIds = formData
    .getAll("categories")
    .map((value) => Number(String(value)))
    .filter((value) => Number.isInteger(value) && value > 0);

  if (categoryIds.length === 0) {
    return NextResponse.json(
      { error: "Debes seleccionar al menos una categoría" },
      { status: 400 },
    );
  }

  const description = String(formData.get("description") ?? "").trim() || null;
  const materialId = parseOptionalInt(formData.get("materialType"));
  const materialConnect =
    materialId && materialId > 0 ? { connect: { id: materialId } } : undefined;
  const numberMdfTablesRaw = parseOptionalInt(formData.get("mdfBoards"));
  const timeMachineRaw = parseOptionalInt(formData.get("workTimeMinutes"));

  const numberMdfTables = Math.max(0, Math.min(99, numberMdfTablesRaw ?? 0));
  const timeMachine = Math.max(0, timeMachineRaw ?? 0);

  // Files are received in the payload; persistence in Files table is pending.
  const previewFile = formData.get("previewFile");
  const designImages = formData.getAll("designImages");
  const instructionFile = formData.get("instructionFile");
  const sourceFiles = formData.getAll("sourceFiles");

  const fileCounts = {
    previewFile:
      previewFile instanceof File && previewFile.size > 0 ? 1 : 0,
    designImages: designImages.filter((value) => value instanceof File && value.size > 0)
      .length,
    instructionFile:
      instructionFile instanceof File && instructionFile.size > 0 ? 1 : 0,
    sourceFiles: sourceFiles.filter((value) => value instanceof File && value.size > 0)
      .length,
  };


  const design = await prisma.$transaction(async (tx) => {
    const created = await tx.designs.create({
      data: {
        name,
        description,
        material: materialConnect,
        status: formData.has("status") ? 1 : 0,
        isTested: formData.has("isTested") ? 1 : 0,
        isCustomizable: formData.has("isCustomizable") ? 1 : 0,
        showInHome: formData.has("showInHome") ? 1 : 0,
        showInSite: formData.has("showInSite") ? 1 : 0,
        numberMdfTables,
        timeMachine,
      },
      select: { id: true, name: true },
    });

    await tx.relDesignsCategories.createMany({
      data: Array.from(new Set(categoryIds)).map((categoryId) => ({
        designId: created.id,
        categoryId,
        status: 1,
      })),
    });

    return created;
  });

  return NextResponse.json({
    id: design.id,
    name: design.name,
    categoriesLinked: Array.from(new Set(categoryIds)).length,
    files: fileCounts,
  });
}

