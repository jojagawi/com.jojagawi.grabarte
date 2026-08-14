import "server-only";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import type { CategoryIconOption } from "@/lib/category-icon-types";
import { CATEGORY_ICON_PACK_IDS } from "@/lib/category-icon-packs";

const MAX_ICONS_PER_PACK = 200;
const optionsCache = new Map<string, CategoryIconOption[]>();

function toLabel(iconName: string): string {
  return iconName.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
}

export async function getCategoryIconOptionsByPack(packId: string): Promise<CategoryIconOption[]> {
  if (!CATEGORY_ICON_PACK_IDS.has(packId)) {
    return [];
  }

  const cached = optionsCache.get(packId);
  if (cached) {
    return cached;
  }

  const iconsRoot = join(process.cwd(), "node_modules", "@react-icons", "all-files");
  const packPath = join(iconsRoot, packId);
  const packFiles = await readdir(packPath, { withFileTypes: true });

  const options = packFiles
    .filter((file) => file.isFile() && file.name.endsWith(".js") && file.name !== "index.js")
    .slice(0, MAX_ICONS_PER_PACK)
    .map((file) => {
      const iconName = file.name.replace(/\.js$/u, "");
      return {
        value: `${packId}/${iconName}`,
        label: toLabel(iconName),
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

  optionsCache.set(packId, options);
  return options;
}



