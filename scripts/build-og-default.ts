import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { renderOgCard } from "@/lib/og-image";

// Tarjeta genérica 1200×630 de Open Graph / X (public/dam/og/inspiraarte.png). La usan las páginas
// sin imagen propia (contacto, FAQ, proceso, legales…) vía buildPageMetadata y el layout raíz.
// El archivo se versiona: vuelve a correr `pnpm run images:og-default` solo si cambia la marca.

const OUTPUT = resolve(process.cwd(), "public", "dam", "og", "inspiraarte.png");

async function main() {
  const response = await renderOgCard({
    eyebrow: "Corte y grabado láser · CDMX",
    title: "Personalización sin límites: del diseño a la realidad",
    detail: "Termos, MDF, acrílico, cuero y más · envíos a todo México",
    // Sin foto: el hero lleva el logo al centro y el recorte cuadrado lo parte.
    imageSource: null,
  });

  await mkdir(dirname(OUTPUT), { recursive: true });
  await writeFile(OUTPUT, Buffer.from(await response.arrayBuffer()));
  console.log(`[images:og-default] ${OUTPUT}`);
}

main().catch((error: unknown) => {
  console.error("[images:og-default]", error);
  process.exitCode = 1;
});
