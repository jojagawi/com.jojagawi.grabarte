import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function toFourDigits(value: number): string {
  return Math.trunc(value).toString().padStart(4, '0')
}

function encodeDigits(value: string, wordCode: string): string {
  return value
    .split('')
    .map((digit) => {
      const index = Number(digit)
      return wordCode[index] ?? digit
    })
    .join('')
}

// Inverso de encodeDigits: solo se usa en el navegador para sesiones con privilegios,
// así el código en claro (precio mínimo y mayoreo) nunca viaja en el HTML público.
export function decodeProductCode(encodedCode: string): string | null {
  const wordCode = process.env.NEXT_PUBLIC_WORD_CODE ?? ''
  if (!wordCode) {
    return encodedCode
  }
  // Con letras repetidas la sustitución no es reversible; mejor no mostrar nada que mostrar cifras falsas.
  if (new Set(wordCode).size !== wordCode.length) {
    return null
  }

  return encodedCode
    .split('')
    .map((char) => {
      if (char === '-') {
        return char
      }
      const index = wordCode.indexOf(char)
      return index >= 0 && index <= 9 ? String(index) : char
    })
    .join('')
}

export function buildProductCode(
  productId: number,
  minimumPrice: number,
  suggestedPrice: number,
  wholesalePrice: number
): string {
  const wordCode = process.env.NEXT_PUBLIC_WORD_CODE ?? "";

  const idChunk = toFourDigits(productId);
  const minimumChunk = toFourDigits(minimumPrice);
  const suggestedChunk = toFourDigits(suggestedPrice);
  const wholesalePriceChunk = toFourDigits(wholesalePrice);

  return [idChunk, minimumChunk, suggestedChunk, wholesalePriceChunk]
    .map((chunk) => encodeDigits(chunk, wordCode))
    .join("-");
}
