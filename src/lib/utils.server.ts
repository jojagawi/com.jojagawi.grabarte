import sharp from "sharp";

function isHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

export async function toResizedWebpDataUrlFromUrl(
  imageUrl: string,
  maxSize: number,
): Promise<string | null> {
  if (!isHttpUrl(imageUrl) || !Number.isFinite(maxSize) || maxSize <= 0) {
    return null;
  }

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      return null;
    }

    const sourceBuffer = Buffer.from(await response.arrayBuffer());
    const resizedBuffer = await sharp(sourceBuffer)
      .rotate()
      .resize({
        width: maxSize,
        height: maxSize,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 85 })
      .toBuffer();

    return `data:image/webp;base64,${resizedBuffer.toString("base64")}`;
  } catch {
    return null;
  }
}

