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

export function buildProductCode(
  productId: number,
  minimumPrice: number,
  suggestedPrice: number,
): string {
  const wordCode = process.env.NEXT_PUBLIC_WORD_CODE ?? ''

  const idChunk = toFourDigits(productId)
  const minimumChunk = toFourDigits(minimumPrice)
  const suggestedChunk = toFourDigits(suggestedPrice)

  return [idChunk, minimumChunk, suggestedChunk]
    .map((chunk) => encodeDigits(chunk, wordCode))
    .join('-')
}

