"use client";

import { useSyncExternalStore } from "react";
import {
  GOOGLE_VISUAL_STORAGE_KEY,
  hasPrivilegedEmailPrefix,
} from "@/lib/google-visual-auth";
import { decodeProductCode } from "@/lib/utils";

type ProductCodeVisibilityProps = {
  encodedCode: string | null;
  fallback: string;
};

type StoredGoogleVisualUser = {
  email?: string;
};

function subscribeToNothing(): () => void {
  return () => {};
}

function readIsPrivileged(): boolean {
  const rawUser = window.localStorage.getItem(GOOGLE_VISUAL_STORAGE_KEY);
  if (!rawUser) {
    return false;
  }

  try {
    const parsedUser = JSON.parse(rawUser) as StoredGoogleVisualUser;
    return hasPrivilegedEmailPrefix(String(parsedUser.email || "").trim());
  } catch {
    return false;
  }
}

// Solo recibe el código cifrado. Para sesiones con privilegios se descifra aquí,
// en el navegador: el código en claro nunca se incluye en el HTML estático.
export function ProductCodeVisibility({ encodedCode, fallback }: ProductCodeVisibilityProps) {
  const canSeeOriginalCode = useSyncExternalStore(subscribeToNothing, readIsPrivileged, () => false);

  if (!encodedCode) {
    return <>{fallback}</>;
  }

  const visibleCode = canSeeOriginalCode ? decodeProductCode(encodedCode) ?? encodedCode : encodedCode;
  return <>{visibleCode}</>;
}
