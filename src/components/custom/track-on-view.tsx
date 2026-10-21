"use client";

import { useEffect } from "react";
import { type AnalyticsParams, trackEvent } from "@/lib/analytics";

interface TrackOnViewProps {
  event: string;
  params: AnalyticsParams;
}

// Para páginas de servidor: envía un evento una vez al montarse (p. ej. view_item en la ficha).
export function TrackOnView({ event, params }: TrackOnViewProps) {
  const serialized = JSON.stringify(params);

  useEffect(() => {
    trackEvent(event, JSON.parse(serialized) as AnalyticsParams);
  }, [event, serialized]);

  return null;
}
