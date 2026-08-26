"use client";

import { useEffect, useMemo, useState } from "react";
import {
  GOOGLE_VISUAL_STORAGE_KEY,
  hasPrivilegedEmailPrefix,
} from "@/lib/google-visual-auth";

type ProductCodeVisibilityProps = {
  encodedCode: string | null;
  originalCode: string | null;
  fallback: string;
};

type StoredGoogleVisualUser = {
  email?: string;
};

export function ProductCodeVisibility({
  encodedCode,
  originalCode,
  fallback,
}: ProductCodeVisibilityProps) {
  const [canSeeOriginalCode, setCanSeeOriginalCode] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const rawUser = window.localStorage.getItem(GOOGLE_VISUAL_STORAGE_KEY);
    if (!rawUser) {
      setCanSeeOriginalCode(false);
      return;
    }

    try {
      const parsedUser = JSON.parse(rawUser) as StoredGoogleVisualUser;
      const email = String(parsedUser.email || "").trim();
      setCanSeeOriginalCode(hasPrivilegedEmailPrefix(email));
    } catch {
      setCanSeeOriginalCode(false);
    }
  }, []);

  const visibleCode = useMemo(() => {
    if (canSeeOriginalCode && originalCode) {
      return originalCode;
    }

    return encodedCode || fallback;
  }, [canSeeOriginalCode, encodedCode, fallback, originalCode]);

  return <>{visibleCode}</>;
}

