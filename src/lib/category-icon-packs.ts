export type CategoryIconPackMeta = {
  id: string;
  name: string;
};

export const CATEGORY_ICON_PACKS: CategoryIconPackMeta[] = [
  { id: "fa", name: "Font Awesome" },
  { id: "fi", name: "Feather" },
  { id: "md", name: "Material Design" },
  { id: "io5", name: "Ionicons 5" },
  { id: "ri", name: "Remix" },
];

export const CATEGORY_ICON_PACK_IDS = new Set(CATEGORY_ICON_PACKS.map((pack) => pack.id));

