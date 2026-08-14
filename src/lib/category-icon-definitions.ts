export const CATEGORY_ICON_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "fa/FaHome", label: "Todos / Adornos" },
  { value: "fa/FaGem", label: "Aretes" },
  { value: "fa/FaBoxOpen", label: "Cajas" },
  { value: "fa/FaSkullCrossbones", label: "Dia de muertos" },
  { value: "fa/FaSchool", label: "Escuela" },
  { value: "fa/FaGhost", label: "Halloween" },
  { value: "fa/FaHatWizard", label: "Harry Potter" },
  { value: "fa/FaChessBoard", label: "Juegos de mesa" },
  { value: "fa/FaKey", label: "Llaveros" },
  { value: "fa/FaFlag", label: "Mexico" },
  { value: "fa/FaBaby", label: "Nacimiento" },
  { value: "fa/FaTree", label: "Navidad" },
  { value: "fa/FaBriefcase", label: "Oficina" },
  { value: "fa/FaImage", label: "Portaretrato" },
  { value: "fa/FaGift", label: "Regalos" },
  { value: "fa/FaPuzzlePiece", label: "Rompecabezas 3D" },
  { value: "fa/FaLandmark", label: "Tradiciones" },
  { value: "fa/FaBurn", label: "Vela" },
  { value: "fa/FaMapPin", label: "Pin" },
  { value: "fa/FaMedal", label: "Medalla" },
];

const validIconKeys = new Set(CATEGORY_ICON_OPTIONS.map((option) => option.value));

const legacyIconMap: Record<string, string> = {
  FaGift: "fa/FaGift",
  FaBriefcase: "fa/FaBriefcase",
  FaHeart: "fa/FaGift",
  FaChurch: "fa/FaLandmark",
  FaStore: "fa/FaBriefcase",
  FaGraduationCap: "fa/FaSchool",
  FaBaby: "fa/FaBaby",
  FaHome: "fa/FaHome",
};

const fallbackIconByCategory: Record<string, string> = {
  todos: "fa/FaHome",
  adornos: "fa/FaHome",
  aretes: "fa/FaGem",
  cajas: "fa/FaBoxOpen",
  diademuertos: "fa/FaSkullCrossbones",
  escuela: "fa/FaSchool",
  halloween: "fa/FaGhost",
  harrypotter: "fa/FaHatWizard",
  juegosdemesa: "fa/FaChessBoard",
  llaveros: "fa/FaKey",
  mexico: "fa/FaFlag",
  nacimiento: "fa/FaBaby",
  navidad: "fa/FaTree",
  oficina: "fa/FaBriefcase",
  portaretrato: "fa/FaImage",
  regalos: "fa/FaGift",
  rompecabezas3d: "fa/FaPuzzlePiece",
  tradiciones: "fa/FaLandmark",
  vela: "fa/FaBurn",
};

function normalizeCategoryName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export function normalizeCategoryIcon(iconKey: unknown): string | null {
  if (typeof iconKey !== "string") {
    return null;
  }

  const trimmed = iconKey.trim();
  if (!trimmed) {
    return null;
  }

  const mappedLegacy = legacyIconMap[trimmed] ?? trimmed;
  return validIconKeys.has(mappedLegacy) ? mappedLegacy : null;
}

export function resolveCategoryIconKey(iconKey: unknown, categoryName?: string | null): string {
  const normalized = normalizeCategoryIcon(iconKey);
  if (normalized) {
    return normalized;
  }

  if (categoryName) {
    const normalizedName = normalizeCategoryName(categoryName);
    const fallback = fallbackIconByCategory[normalizedName];
    if (fallback) {
      return fallback;
    }
  }

  return "fa/FaHome";
}

