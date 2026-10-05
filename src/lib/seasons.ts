// Calendario de temporadas de la vitrina de la portada.
// Cada ocasión se busca por nombre de categoría normalizado (sin acentos ni mayúsculas),
// así que basta con crear la categoría en el panel y publicar diseños en ella.

export interface Season {
  id: string;
  label: string;
  categoryAliases: string[];
  // Meses de 1 a 12, inclusivos. startMonth > endMonth cruza el año.
  startMonth: number;
  endMonth: number;
}

// La temporada se muestra 3 semanas antes de su primer mes para dar tiempo de
// producir y enviar antes de la fecha.
export const SEASON_LEAD_DAYS = 21;

// Menos piezas que esto no sostienen un carrusel con el nombre de la ocasión.
export const MIN_SEASON_DESIGNS = 6;

export const SEASONS: Season[] = [
  {
    id: "amor-y-amistad",
    label: "Amor y amistad",
    categoryAliases: ["dia del amor y la amistad", "amor y amistad", "san valentin"],
    startMonth: 1,
    endMonth: 2,
  },
  { id: "primavera", label: "Primavera", categoryAliases: ["primavera"], startMonth: 3, endMonth: 3 },
  { id: "pascua", label: "Pascua", categoryAliases: ["pascua"], startMonth: 4, endMonth: 4 },
  {
    id: "dia-del-nino",
    label: "Día del niño",
    categoryAliases: ["dia del nino", "dia de los ninos", "dia del nino y la nina"],
    startMonth: 4,
    endMonth: 4,
  },
  {
    id: "dia-de-la-madre",
    label: "Día de la madre",
    categoryAliases: ["dia de la madre", "dia de las madres"],
    startMonth: 5,
    endMonth: 5,
  },
  {
    id: "dia-del-maestro",
    label: "Día del maestro",
    categoryAliases: ["dia del maestro", "dia de los maestros"],
    startMonth: 5,
    endMonth: 5,
  },
  { id: "dia-del-padre", label: "Día del padre", categoryAliases: ["dia del padre"], startMonth: 6, endMonth: 6 },
  {
    id: "graduaciones",
    label: "Graduaciones",
    categoryAliases: ["graduacion", "graduaciones"],
    startMonth: 6,
    endMonth: 7,
  },
  {
    id: "regreso-a-clases",
    label: "Regreso a clases",
    categoryAliases: ["regreso a clases", "escuela"],
    startMonth: 8,
    endMonth: 8,
  },
  {
    id: "fiestas-patrias",
    label: "Fiestas patrias",
    categoryAliases: ["fiestas patrias", "mexico"],
    startMonth: 9,
    endMonth: 9,
  },
  { id: "dia-de-muertos", label: "Día de muertos", categoryAliases: ["dia de muertos"], startMonth: 10, endMonth: 10 },
  { id: "halloween", label: "Halloween", categoryAliases: ["halloween"], startMonth: 10, endMonth: 10 },
  {
    id: "navidad",
    label: "Navidad",
    categoryAliases: ["navidad", "nacimiento"],
    startMonth: 11,
    endMonth: 12,
  },
];

// Respaldo cuando ninguna temporada activa tiene piezas suficientes.
export const FALLBACK_CATEGORY_ALIASES = ["regalos", "adornos"];

export function normalizeCategoryName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

const DAY_MS = 24 * 60 * 60 * 1000;

function seasonWindow(season: Season, startYear: number): { start: Date; end: Date } {
  const endYear = season.endMonth < season.startMonth ? startYear + 1 : startYear;
  const start = new Date(new Date(startYear, season.startMonth - 1, 1).getTime() - SEASON_LEAD_DAYS * DAY_MS);
  // Día 0 del mes siguiente = último día del mes final; se toma hasta el final de ese día.
  const end = new Date(endYear, season.endMonth, 0, 23, 59, 59, 999);
  return { start, end };
}

// Temporadas visibles en `date`, de la que termina antes a la que termina después,
// para que la ocasión en curso vaya primero y la siguiente (por el adelanto) después.
export function getActiveSeasons(date: Date = new Date()): Season[] {
  const year = date.getFullYear();
  const active: { season: Season; end: number }[] = [];

  for (const season of SEASONS) {
    for (const startYear of [year - 1, year, year + 1]) {
      const { start, end } = seasonWindow(season, startYear);
      if (date >= start && date <= end) {
        active.push({ season, end: end.getTime() });
        break;
      }
    }
  }

  return active.sort((a, b) => a.end - b.end).map(({ season }) => season);
}

// "A", "A y B", "A, B y C".
export function joinSpanishList(items: string[]): string {
  if (items.length <= 1) {
    return items[0] ?? "";
  }
  return `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`;
}
