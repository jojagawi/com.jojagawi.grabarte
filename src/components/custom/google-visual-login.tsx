"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GOOGLE_VISUAL_STORAGE_KEY } from "@/lib/google-visual-auth";

type GoogleVisualUser = {
  name: string;
  email: string;
  picture: string;
};

type GoogleVisualLoginProps = {
  fullWidth?: boolean;
  onAction?: () => void;
};

type GoogleTokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

type GoogleTokenClient = {
  requestAccessToken: (overrides?: { prompt?: string }) => void;
};

type GoogleAccounts = {
  oauth2: {
    initTokenClient: (config: {
      client_id: string;
      scope: string;
      callback: (response: GoogleTokenResponse) => void;
      prompt?: string;
    }) => GoogleTokenClient;
  };
};

declare global {
  interface Window {
    google?: {
      accounts: GoogleAccounts;
    };
  }
}

const STORAGE_KEY = GOOGLE_VISUAL_STORAGE_KEY;
const GOOGLE_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

function loadGoogleScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("No browser environment available"));
      return;
    }

    if (window.google?.accounts?.oauth2) {
      resolve();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(`script[src=\"${GOOGLE_SCRIPT_SRC}\"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("No se pudo cargar Google Identity Services")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = GOOGLE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("No se pudo cargar Google Identity Services"));
    document.head.appendChild(script);
  });
}

async function fetchGoogleUser(accessToken: string): Promise<GoogleVisualUser> {
  const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("No se pudo obtener la informacion del usuario");
  }

  const payload = (await response.json()) as {
    name?: string;
    email?: string;
    picture?: string;
  };

  return {
    name: payload.name || "Cuenta de Google",
    email: payload.email || "",
    picture: payload.picture || "",
  };
}

// Evento propio: "storage" solo avisa a otras pestañas, no a la que escribe.
const STORED_USER_EVENT = "inspiraarte:google-visual-user";

function subscribeToStoredUser(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  window.addEventListener(STORED_USER_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(STORED_USER_EVENT, onChange);
  };
}

function readStoredUser(): string | null {
  return window.localStorage.getItem(STORAGE_KEY);
}

function writeStoredUser(rawUser: string | null): void {
  if (rawUser) {
    window.localStorage.setItem(STORAGE_KEY, rawUser);
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  window.dispatchEvent(new Event(STORED_USER_EVENT));
}

function parseStoredUser(rawUser: string | null): GoogleVisualUser | null {
  if (!rawUser) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawUser) as GoogleVisualUser;
    return parsed?.name ? parsed : null;
  } catch {
    return null;
  }
}

export function GoogleVisualLogin({ fullWidth = false, onAction }: GoogleVisualLoginProps) {
  const rawUser = useSyncExternalStore(subscribeToStoredUser, readStoredUser, () => null);
  const user = useMemo(() => parseStoredUser(rawUser), [rawUser]);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const tokenClientRef = useRef<GoogleTokenClient | null>(null);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

  useEffect(() => {
    if (!clientId) {
      return;
    }

    let isMounted = true;

    const initializeGoogle = async () => {
      try {
        await loadGoogleScript();
        if (!isMounted || !window.google?.accounts?.oauth2) {
          return;
        }

        tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: "openid profile email",
          prompt: "select_account",
          callback: async (tokenResponse) => {
            if (tokenResponse.error || !tokenResponse.access_token) {
              setIsLoading(false);
              return;
            }

            try {
              const profile = await fetchGoogleUser(tokenResponse.access_token);
              writeStoredUser(JSON.stringify(profile));
            } catch (error) {
              console.error(error);
            } finally {
              setIsLoading(false);
            }
          },
        });

        setIsReady(true);
      } catch (error) {
        console.error(error);
      }
    };

    void initializeGoogle();

    return () => {
      isMounted = false;
    };
  }, [clientId]);

  const buttonClassName = useMemo(() => (fullWidth ? "w-full" : ""), [fullWidth]);

  const handleLogin = () => {
    onAction?.();

    if (!tokenClientRef.current) {
      return;
    }

    setIsLoading(true);
    tokenClientRef.current.requestAccessToken({ prompt: "select_account" });
  };

  const handleLogout = () => {
    onAction?.();
    writeStoredUser(null);
  };

  if (user) {
    return (
      <div className={`flex items-center gap-2 ${buttonClassName}`}>
        <div className="flex min-w-0 items-center gap-2 rounded-md border border-border bg-background px-2 py-1">
          {user.picture ? (
            <Image
              src={user.picture}
              alt={`Foto de ${user.name}`}
              width={24}
              height={24}
              unoptimized
              className="h-6 w-6 rounded-full"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="h-6 w-6 rounded-full bg-muted" />
          )}
          <span className="max-w-30 truncate text-xs text-foreground" title={user.email || user.name}>
            {user.name}
          </span>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className={fullWidth ? "flex-1" : ""}
        >
          <LogOut className="h-4 w-4" />
          Salir
        </Button>
      </div>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleLogin}
      disabled={!clientId || !isReady || isLoading}
      className={`border-primary text-primary hover:bg-primary/10 ${buttonClassName}`.trim()}
    >
      <LogIn className="h-4 w-4" />
      {isLoading ? "Conectando..." : "Iniciar con Google"}
    </Button>
  );
}
