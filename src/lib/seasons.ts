// Lógica del calendario de temporadas de la vitrina de la portada.
// Los datos viven en la base (CatSeasons + RelSeasonsCategories) y se administran
// en /catalogos/temporadas; los valores iniciales están en prisma/seed.ts.

export interface Season {
  id: number;
  slug: string;
  label: string;
  // Meses de 1 a 12, inclusivos. startMonth > endMonth cruza el año.
  startMonth: number;
  endMonth: number;
  // Días antes del primer mes en que la temporada empieza a mostrarse,
  // para dar tiempo de producir y enviar antes de la fecha.
  leadDays: number;
  categoryIds: number[];
}

// Registro completo de una temporada tal como lo edita /catalogos/temporadas.
export interface AdminSeason {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  startMonth: number;
  endMonth: number;
  leadDays: number;
  sortOrder: number;
  status: number;
  categoryIds: number[];
}

// Estados de CatSeasons.status.
// - activa: entra a la vitrina de la portada y tiene página /temporada/[slug].
// - solo página: tiene página, pero no aparece en la portada.
// - inactiva: ni portada ni página.
export const SEASON_STATUS = { inactive: 0, active: 1, pageOnly: 2 } as const;
export const SEASON_PAGE_STATUSES: number[] = [SEASON_STATUS.active, SEASON_STATUS.pageOnly];
export const SEASON_STATUS_LABELS: Record<number, string> = {
  [SEASON_STATUS.active]: "Activa",
  [SEASON_STATUS.pageOnly]: "Solo página",
  [SEASON_STATUS.inactive]: "Inactiva",
};

export function isValidSeasonStatus(value: number): boolean {
  return Object.values(SEASON_STATUS).some((status) => status === value);
}

export const DEFAULT_SEASON_LEAD_DAYS = 21;

// Menos piezas que esto no sostienen un carrusel con el nombre de la ocasión.
export const MIN_SEASON_DESIGNS = 6;

// Respaldo cuando ninguna temporada activa tiene piezas suficientes.
export const FALLBACK_CATEGORY_ALIASES = ["regalos", "adornos"];

export const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export function isValidMonth(value: number): boolean {
  return Number.isInteger(value) && value >= 1 && value <= 12;
}

// "Octubre" o "Noviembre – Diciembre".
export function formatSeasonMonths(startMonth: number, endMonth: number): string {
  const start = MONTH_NAMES[startMonth - 1] ?? "?";
  return startMonth === endMonth ? start : `${start} – ${MONTH_NAMES[endMonth - 1] ?? "?"}`;
}

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
  const start = new Date(new Date(startYear, season.startMonth - 1, 1).getTime() - season.leadDays * DAY_MS);
  // Día 0 del mes siguiente = último día del mes final; se toma hasta el final de ese día.
  const end = new Date(endYear, season.endMonth, 0, 23, 59, 59, 999);
  return { start, end };
}

// Temporadas visibles en `date`, de la que termina antes a la que termina después,
// para que la ocasión en curso vaya primero y la siguiente (por el adelanto) después.
export function getActiveSeasons(seasons: Season[], date: Date = new Date()): Season[] {
  const year = date.getFullYear();
  const active: { season: Season; end: number }[] = [];

  for (const season of seasons) {
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
