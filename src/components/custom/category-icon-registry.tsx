import { FaBaby } from "@react-icons/all-files/fa/FaBaby";
import { FaBoxOpen } from "@react-icons/all-files/fa/FaBoxOpen";
import { FaBriefcase } from "@react-icons/all-files/fa/FaBriefcase";
import { FaBurn } from "@react-icons/all-files/fa/FaBurn";
import { FaChessBoard } from "@react-icons/all-files/fa/FaChessBoard";
import { FaFlag } from "@react-icons/all-files/fa/FaFlag";
import { FaGem } from "@react-icons/all-files/fa/FaGem";
import { FaGhost } from "@react-icons/all-files/fa/FaGhost";
import { FaGift } from "@react-icons/all-files/fa/FaGift";
import { FaHatWizard } from "@react-icons/all-files/fa/FaHatWizard";
import { FaHome } from "@react-icons/all-files/fa/FaHome";
import { FaImage } from "@react-icons/all-files/fa/FaImage";
import { FaKey } from "@react-icons/all-files/fa/FaKey";
import { FaLandmark } from "@react-icons/all-files/fa/FaLandmark";
import { FaMapPin } from "@react-icons/all-files/fa/FaMapPin";
import { FaMedal } from "@react-icons/all-files/fa/FaMedal";
import { FaSchool } from "@react-icons/all-files/fa/FaSchool";
import { FaSkullCrossbones } from "@react-icons/all-files/fa/FaSkullCrossbones";
import { FaTree } from "@react-icons/all-files/fa/FaTree";
import type { ComponentType } from "react";
import {
  CATEGORY_ICON_OPTIONS,
  resolveCategoryIconKey,
  normalizeCategoryIcon,
} from "@/lib/category-icon-definitions";
import { FaPuzzlePiece } from "@react-icons/all-files/fa/FaPuzzlePiece";

type IconComponent = ComponentType<{ className?: string; size?: number }>;

type IconRegistryItem = {
  key: string;
  icon: IconComponent;
};

const CATEGORY_ICON_REGISTRY: IconRegistryItem[] = [
  { key: "fa/FaHome", icon: FaHome },
  { key: "fa/FaGem", icon: FaGem },
  { key: "fa/FaBoxOpen", icon: FaBoxOpen },
  { key: "fa/FaSkullCrossbones", icon: FaSkullCrossbones },
  { key: "fa/FaSchool", icon: FaSchool },
  { key: "fa/FaGhost", icon: FaGhost },
  { key: "fa/FaHatWizard", icon: FaHatWizard },
  { key: "fa/FaChessBoard", icon: FaChessBoard },
  { key: "fa/FaKey", icon: FaKey },
  { key: "fa/FaFlag", icon: FaFlag },
  { key: "fa/FaBaby", icon: FaBaby },
  { key: "fa/FaTree", icon: FaTree },
  { key: "fa/FaBriefcase", icon: FaBriefcase },
  { key: "fa/FaImage", icon: FaImage },
  { key: "fa/FaGift", icon: FaGift },
  { key: "fa/FaPuzzlePiece", icon: FaPuzzlePiece },
  { key: "fa/FaLandmark", icon: FaLandmark },
  { key: "fa/FaBurn", icon: FaBurn },
  { key: "fa/FaMapPin", icon: FaMapPin },
  { key: "fa/FaMedal", icon: FaMedal },
];

const iconRegistryByKey = CATEGORY_ICON_REGISTRY.reduce<Record<string, IconRegistryItem>>((acc, item) => {
  acc[item.key] = item;
  return acc;
}, {});


export function getCategoryIconComponent(iconKey: unknown, categoryName?: string | null): IconComponent {
  const resolvedKey = resolveCategoryIconKey(iconKey, categoryName);
  return iconRegistryByKey[resolvedKey]?.icon ?? FaHome;
}

export function CategoryIcon({
  iconKey,
  categoryName,
  className,
}: {
  iconKey?: string | null;
  categoryName?: string | null;
  className?: string;
}) {
  const Icon = getCategoryIconComponent(iconKey, categoryName);
  return <Icon className={className} />;
}




