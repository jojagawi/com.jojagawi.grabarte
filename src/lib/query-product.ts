"use client";

import { useMemo, useSyncExternalStore } from "react";

export type QueryProduct = {
  id: number;
  name: string;
};

// Export estático: el ?id= se lee en el cliente (useSearchParams obligaría a un Suspense).
// En el HTML prerenderado no hay query string, así que el servidor reporta "".
function subscribeToLocation(): () => void {
  return () => {};
}

function getLocationSearch(): string {
  return window.location.search;
}

function getServerLocationSearch(): string {
  return "";
}

function findProductById<T extends QueryProduct>(products: T[], search: string): T | null {
  const rawId = new URLSearchParams(search).get("id")?.trim() ?? "";
  if (!/^\d+$/u.test(rawId)) {
    return null;
  }

  return products.find((product) => product.id === Number(rawId)) ?? null;
}

/** Diseño publicado que indica ?id= en la URL (los QR de los flyers lo llevan), o null. */
export function useQueryProduct<T extends QueryProduct>(products: T[]): T | null {
  const locationSearch = useSyncExternalStore(subscribeToLocation, getLocationSearch, getServerLocationSearch);
  return useMemo(() => findProductById(products, locationSearch), [products, locationSearch]);
}
