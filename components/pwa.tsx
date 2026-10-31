"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

/** Registers the service worker. Production only, so it can't interfere with
 *  hot reloading while you develop. Render it once, inside <body> in layout.tsx. */
export function RegisterServiceWorker() {
  useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" ||
      !("serviceWorker" in navigator)
    )
      return;
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {});
  }, []);
  return null;
}

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

/** Shows an "Install app" button only when the browser says the app can be
 *  installed (Chrome, Edge, Android). It renders nothing otherwise, and
 *  disappears after installing. On iPhone, users use Share > Add to Home Screen. */
export function InstallAppButton({ className = "" }: { className?: string }) {
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(
    null,
  );

  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as InstallPromptEvent);
    };
    const onInstalled = () => setPromptEvent(null);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!promptEvent) return null;

  return (
    <button
      type="button"
      onClick={async () => {
        await promptEvent.prompt();
        await promptEvent.userChoice;
        setPromptEvent(null);
      }}
      className={
        className ||
        "inline-flex items-center gap-2 rounded-full border border-[#c8d8cb] bg-white px-4 py-2 text-sm font-semibold text-[#17372d] transition hover:border-[#5a9960]"
      }
    >
      <Download className="size-4" />
      Install app
    </button>
  );
}
