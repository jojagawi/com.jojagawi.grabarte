/**
 * Convierte texto a slug para URLs.
 *
 * Reglas:
 * - minúsculas
 * - sin acentos ni caracteres especiales
 * - espacios y separadores reemplazados por guiones
 *
 * Ejemplo:
 * "Taza Día del Niño" -> "taza-dia-del-nino"
 */
export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

