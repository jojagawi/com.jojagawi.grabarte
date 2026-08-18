"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";

type RateStatusSwitchProps = {
  rateId: string;
  initialStatus: number;
  name: string;
};

type UpdateResponse = {
  status?: number;
  message?: string;
};

export function RateStatusSwitch({ rateId, initialStatus, name }: RateStatusSwitchProps) {
  const [status, setStatus] = useState(initialStatus === 1 ? 1 : 0);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleStatusChange = async (checked: boolean) => {
    const nextStatus = checked ? 1 : 0;
    const previousStatus = status;

    setStatus(nextStatus);
    setIsSaving(true);
    setErrorMessage("");

    try {
      const response = await fetch(`/api/rates/${rateId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      const payload = (await response.json().catch(() => null)) as UpdateResponse | null;

      if (!response.ok) {
        setStatus(previousStatus);
        setErrorMessage(payload?.message || "No se pudo actualizar el status.");
        return;
      }

      setStatus(payload?.status === 1 ? 1 : 0);
    } catch {
      setStatus(previousStatus);
      setErrorMessage("No se pudo actualizar el status.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-3">
        <Switch
          checked={status === 1}
          disabled={isSaving}
          onCheckedChange={handleStatusChange}
          aria-label={`Status de ${name || "calificacion"}`}
        />
        <span className="text-xs text-muted-foreground">{status}</span>
        {isSaving && <span className="text-xs text-muted-foreground">Guardando...</span>}
      </div>
      {errorMessage && <span className="text-xs text-destructive">{errorMessage}</span>}
    </div>
  );
}

