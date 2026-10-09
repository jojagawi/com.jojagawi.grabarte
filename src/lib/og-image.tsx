import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";

// Tarjeta 1200×630 para Open Graph / X de las páginas de categoría y temporada: el tamaño que
// piden Facebook, WhatsApp, LinkedIn y X para la vista grande. Se genera en el build.

export const OG_IMAGE_SIZE = { width: 1200, height: 630 };
export const OG_IMAGE_CONTENT_TYPE = "image/png";

const PUBLIC_DIR = join(process.cwd(), "public");
const LOGO_PATH = "/dam/logos/logo.png";

// Colores de DESIGN.md.
const COLORS = {
  background: "#fcfbf8",
  petroleum: "#367a8a",
  charcoal: "#323236",
  muted: "#676767",
  hairline: "#e4e4e7",
};

// next/og solo lee TTF/OTF; Google Fonts entrega TTF cuando la petición no es de un navegador.
async function loadGoogleFont(family: string, weight: number): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${family.replace(/\s+/gu, "+")}:wght@${weight}`,
    ).then((response) => response.text());
    const fontUrl = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/u)?.[1];
    if (!fontUrl) {
      throw new Error("la hoja de Google Fonts no trae una URL TTF");
    }
    return await fetch(fontUrl).then((response) => response.arrayBuffer());
  } catch (error) {
    console.warn(`[og-image] Sin ${family}:`, error instanceof Error ? error.message : error);
    // Sin red en el build: la tarjeta sale con la fuente por defecto de next/og.
    return null;
  }
}

async function readImage(source: string): Promise<Buffer> {
  if (/^https?:\/\//iu.test(source)) {
    const response = await fetch(source);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} al leer ${source}`);
    }
    return Buffer.from(await response.arrayBuffer());
  }
  return readFile(join(PUBLIC_DIR, source));
}

// next/og no decodifica WebP (el formato del catálogo): se convierte a PNG ya recortado.
async function toPngDataUri(source: string, width: number, height: number): Promise<string | null> {
  try {
    const png = await sharp(await readImage(source)).resize(width, height, { fit: "cover" }).png().toBuffer();
    return `data:image/png;base64,${png.toString("base64")}`;
  } catch (error) {
    console.warn(`[og-image] Sin imagen para la tarjeta (${source}):`, error instanceof Error ? error.message : error);
    return null;
  }
}

// Una descarga por proceso del build, no una por tarjeta.
let fontsPromise: Promise<[ArrayBuffer | null, ArrayBuffer | null]> | null = null;
function loadFonts() {
  fontsPromise ??= Promise.all([loadGoogleFont("Playfair Display", 700), loadGoogleFont("DM Sans", 500)]);
  return fontsPromise;
}

interface OgCardInput {
  /** Píldora sobre el título ("Categoría", "Temporada · octubre a noviembre"). */
  eyebrow: string;
  title: string;
  /** Línea bajo el título ("12 diseños personalizables"). */
  detail?: string;
  /** Foto del lado derecho: URL del DAM o ruta dentro de public/. */
  imageSource?: string | null;
}

export async function renderOgCard({ eyebrow, title, detail, imageSource }: OgCardInput): Promise<ImageResponse> {
  const imageSize = OG_IMAGE_SIZE.height;
  const [[playfair, dmSans], logo, photo] = await Promise.all([
    loadFonts(),
    toPngDataUri(LOGO_PATH, 240, 80),
    imageSource ? toPngDataUri(imageSource, imageSize, imageSize) : Promise.resolve(null),
  ]);

  const fonts = [
    ...(playfair ? [{ name: "Playfair Display", data: playfair, weight: 700 as const, style: "normal" as const }] : []),
    ...(dmSans ? [{ name: "DM Sans", data: dmSans, weight: 500 as const, style: "normal" as const }] : []),
  ];
  const titleSize = title.length > 32 ? 56 : 68;

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: COLORS.background }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
            padding: "56px 56px 48px",
            borderBottom: `12px solid ${COLORS.petroleum}`,
            fontFamily: "DM Sans",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- next/og dibuja <img>, no next/image. */}
          {logo ? <img src={logo} width={180} height={60} alt="" /> : <div style={{ display: "flex" }} />}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                padding: "6px 18px",
                borderRadius: 999,
                background: "rgba(54, 122, 138, 0.12)",
                color: COLORS.petroleum,
                fontSize: 24,
              }}
            >
              {eyebrow}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 20,
                fontFamily: "Playfair Display",
                fontSize: titleSize,
                lineHeight: 1.1,
                color: COLORS.charcoal,
              }}
            >
              {title}
            </div>
            {detail && (
              <div style={{ display: "flex", marginTop: 20, fontSize: 28, color: COLORS.muted }}>{detail}</div>
            )}
          </div>
          <div style={{ display: "flex", fontSize: 24, color: COLORS.petroleum }}>inspiraarte.com</div>
        </div>
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element -- next/og dibuja <img>, no next/image.
          <img
            src={photo}
            width={imageSize}
            height={imageSize}
            alt=""
            style={{ borderLeft: `1px solid ${COLORS.hairline}` }}
          />
        )}
      </div>
    ),
    // fonts: [] deja a next/og sin ninguna fuente; sin la clave usa la suya por defecto.
    { ...OG_IMAGE_SIZE, ...(fonts.length > 0 ? { fonts } : {}) },
  );
}
