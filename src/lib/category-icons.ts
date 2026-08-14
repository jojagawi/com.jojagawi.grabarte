const legacyIconMap: Record<string, string> = {
  FaGift: "fa/FaGift",
  FaBriefcase: "fa/FaBriefcase",
  FaHeart: "fa/FaHeart",
  FaChurch: "fa/FaChurch",
  FaStore: "fa/FaStore",
  FaGraduationCap: "fa/FaGraduationCap",
  FaBaby: "fa/FaBaby",
  FaHome: "fa/FaHome",
};

export function normalizeCategoryIcon(iconKey: unknown): string | null {
  if (typeof iconKey !== "string") {
    return null;
  }

  const trimmed = iconKey.trim();
  if (!trimmed) {
    return null;
  }

  if (legacyIconMap[trimmed]) {
    return legacyIconMap[trimmed];
  }

  return /^[a-z0-9]+\/[A-Za-z0-9]+$/u.test(trimmed) ? trimmed : null;
}


