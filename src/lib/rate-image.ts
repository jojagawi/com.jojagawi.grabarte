// Foto del cliente para su calificación: se convierte a WebP en el navegador antes de subirla a
// imagenes-usuarios/<id>.webp. Redibujar en canvas también descarta los metadatos EXIF (ubicación
// GPS, modelo del teléfono) que traen las fotos del celular.

// Debe coincidir con MAX_IMAGE_BYTES de .aws/lambda/rates/lambda-rates-handler.mjs.
export const MAX_RATE_IMAGE_BYTES = 5 * 1024 * 1024;
// Antes de convertir: una foto de celular rara vez pasa de 20 MB.
export const MAX_RATE_SOURCE_BYTES = 20 * 1024 * 1024;

const MAX_DIMENSION = 1600;
const WEBP_QUALITY = 0.82;

async function loadBitmap(file: File): Promise<ImageBitmap> {
  try {
    // from-image respeta la orientación EXIF (fotos verticales del celular).
    return await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new Error("No pudimos leer la foto. Usa una imagen JPG, PNG o WebP.");
  }
}

function drawScaled(bitmap: ImageBitmap): HTMLCanvasElement {
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Tu navegador no pudo procesar la foto.");
  }
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas;
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/webp", WEBP_QUALITY));
}

// Safari no codifica WebP con canvas (devuelve PNG): ahí se usa el codificador WASM de Squoosh,
// que solo se descarga en ese caso.
async function encodeWithWasm(canvas: HTMLCanvasElement): Promise<Blob> {
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Tu navegador no pudo procesar la foto.");
  }

  const { encode } = await import("@jsquash/webp");
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const buffer = await encode(imageData, { quality: Math.round(WEBP_QUALITY * 100) });
  return new Blob([buffer], { type: "image/webp" });
}

export async function convertToWebp(file: File): Promise<Blob> {
  if (file.size > MAX_RATE_SOURCE_BYTES) {
    throw new Error("La foto pesa más de 20 MB. Elige una más ligera.");
  }

  const bitmap = await loadBitmap(file);
  const canvas = drawScaled(bitmap);
  bitmap.close();

  const nativeBlob = await canvasToBlob(canvas);
  const webp = nativeBlob?.type === "image/webp" ? nativeBlob : await encodeWithWasm(canvas);

  if (webp.size > MAX_RATE_IMAGE_BYTES) {
    throw new Error("La foto sigue pesando más de 5 MB después de optimizarla. Elige otra.");
  }
  return webp;
}

// URL pública de la foto (la política del bucket hace público imagenes-usuarios/*).
export function getRateImageUrl(rateId: string): string {
  const protocol = process.env.NEXT_PUBLIC_S3_PROTOCOL || "https";
  const host = process.env.NEXT_PUBLIC_S3 || "dam.inspiraarte.com";
  return `${protocol}://${host}/imagenes-usuarios/${encodeURIComponent(rateId)}.webp`;
}
