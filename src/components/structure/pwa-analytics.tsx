"use client";

import { useEffect } from "react";

interface BeforeInstallPromptChoice {
  outcome: "accepted" | "dismissed";
  platform: string;
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<BeforeInstallPromptChoice>;
  prompt: () => Promise<void>;
}

declare global {
  interface Window {
    gtag?: (
      command: "event",
      eventName: string,
      eventParams?: Record<string, unknown>,
    ) => void;
  }
}

function trackPwaEvent(
  eventName: string,
  eventParams: Record<string, unknown> = {},
): void {
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: eventName,
      ...eventParams,
    });
    return;
  }

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, eventParams);
  }
}

function isStandaloneMode(): boolean {
  if (window.matchMedia("(display-mode: standalone)").matches) {
    return true;
  }

  return Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);
}

export function PwaAnalytics() {
  useEffect(() => {
    const onBeforeInstallPrompt = (rawEvent: Event) => {
      const event = rawEvent as BeforeInstallPromptEvent;

      trackPwaEvent("install_prompt_shown", {
        platforms: event.platforms?.join(",") || "unknown",
      });

      event.userChoice
        .then((choice) => {
          trackPwaEvent(
            choice.outcome === "accepted"
              ? "install_prompt_accepted"
              : "install_prompt_dismissed",
            {
              platform: choice.platform || "unknown",
            },
          );
        })
        .catch(() => {
          trackPwaEvent("install_prompt_error");
        });
    };

    const onAppInstalled = () => {
      trackPwaEvent("pwa_installed");
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    if (isStandaloneMode()) {
      trackPwaEvent("pwa_standalone_session");
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  return null;
}

