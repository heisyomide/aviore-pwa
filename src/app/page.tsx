"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type InstallOutcome = "accepted" | "dismissed";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: InstallOutcome;
    platform: string;
  }>;
};

const ONBOARDING_ROUTE = "/onboarding";

function isIOSDevice() {
  const userAgent = navigator.userAgent || "";

  return (
    /iPad|iPhone|iPod/.test(userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function isStandalonePWA() {
  const standaloneMediaQuery = window.matchMedia(
    "(display-mode: standalone)"
  ).matches;

  const iosStandalone =
    (navigator as Navigator & { standalone?: boolean }).standalone === true;

  return standaloneMediaQuery || iosStandalone;
}

function AndroidIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6 shrink-0"
      aria-hidden="true"
      fill="none"
    >
      <path
        d="M7.25 9.25h9.5v8.1c0 .91-.74 1.65-1.65 1.65H8.9c-.91 0-1.65-.74-1.65-1.65v-8.1Z"
        fill="#3DDC84"
      />

      <path
        d="M5.75 10.25v5.5"
        stroke="#3DDC84"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M18.25 10.25v5.5"
        stroke="#3DDC84"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M8.25 8.5 6.9 6.15"
        stroke="#3DDC84"
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      <path
        d="m15.75 8.5 1.35-2.35"
        stroke="#3DDC84"
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      <circle cx="9.75" cy="11.75" r="0.75" fill="white" />
      <circle cx="14.25" cy="11.75" r="0.75" fill="white" />

      <path
        d="M9.25 19v2"
        stroke="#3DDC84"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M14.75 19v2"
        stroke="#3DDC84"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IPhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6 shrink-0"
      aria-hidden="true"
      fill="none"
    >
      <rect
        x="6.5"
        y="2.5"
        width="11"
        height="19"
        rx="2.4"
        stroke="#07120f"
        strokeWidth="1.6"
      />

      <path
        d="M10 5h4"
        stroke="#07120f"
        strokeWidth="1.3"
        strokeLinecap="round"
      />

      <circle cx="12" cy="18.5" r="0.75" fill="#07120f" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

export default function AppGatewayPage() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [isIOS, setIsIOS] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);

  /*
   * Detect the environment once the page mounts.
   */
  useEffect(() => {
    if (isStandalonePWA()) {
      /*
       * This page is not supposed to be the normal entry point
       * for an installed PWA.
       *
       * Send standalone users into the real application flow.
       */
      window.location.replace(ONBOARDING_ROUTE);
      return;
    }

    setIsIOS(isIOSDevice());

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();

      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt
    );

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );

      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  /*
   * Native installation prompt.
   *
   * Android / Chromium browsers can provide beforeinstallprompt.
   * iOS Safari does not, so iOS falls back to the instructions modal.
   */
  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) {
      setShowHowTo(true);
      return;
    }

    try {
      await deferredPrompt.prompt();

      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        setDeferredPrompt(null);
      }
    } catch {
      /*
       * If the browser rejects the native prompt,
       * show the manual installation instructions.
       */
      setShowHowTo(true);
    }
  }, [deferredPrompt]);

  const openHowToInstall = useCallback(() => {
    setShowHowTo(true);
  }, []);

  const closeHowToInstall = useCallback(() => {
    setShowHowTo(false);
  }, []);

  return (
    <main className="min-h-[100svh] overflow-hidden bg-[#00412e] px-3 py-3 text-white">
      <div className="mx-auto flex min-h-[calc(100svh-24px)] w-full max-w-[430px] flex-col overflow-hidden rounded-[20px] bg-[#00412e] shadow-2xl">
        {/* -------------------------------------------------
            Header
        ------------------------------------------------- */}
        <header className="flex items-center justify-between px-5 pb-3 pt-5">
          <div
            className="text-[20px] font-extrabold tracking-[-0.8px] md:text-[22px]"
            aria-label="AviorèGo"
          >
            Avior
            <span className="text-emerald-400">è</span>
            Go
          </div>

          <button
            type="button"
            onClick={() => window.history.back()}
            aria-label="Close installation page"
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            <CloseIcon />
          </button>
        </header>

        {/* -------------------------------------------------
            App preview
        ------------------------------------------------- */}
        <section
          aria-label="AviorèGo app preview"
          className="relative flex h-[205px] items-end justify-center overflow-hidden"
        >
          <div className="relative h-[205px] w-[145px] overflow-hidden rounded-[24px] border-[4px] border-[#061c14] bg-black shadow-2xl">
            <Image
              src="/images/app.jpeg"
              alt="Preview of the AviorèGo app"
              fill
              priority
              className="object-cover"
              sizes="145px"
            />
          </div>
        </section>

        {/* -------------------------------------------------
            Main installation content
        ------------------------------------------------- */}
        <section className="px-7 pb-6 pt-5 text-center">
          <h1 className="text-[25px] font-extrabold tracking-[-0.03em]">
            Install AviorèGo
          </h1>

          <p className="mx-auto mt-2 max-w-[290px] text-[11px] leading-[1.55] text-white/75">
            Get faster access, a smoother experience and enjoy all the
            features right from your home screen.
          </p>

          <button
            type="button"
            onClick={handleInstall}
            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-5 text-[11px] font-bold text-[#00412e] shadow-lg transition hover:bg-white/95 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            <DownloadIcon />
            Install Now
          </button>

          <button
            type="button"
            onClick={openHowToInstall}
            className="mt-4 text-[10px] font-medium text-white underline underline-offset-2 transition hover:text-emerald-200 focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            How to install?
          </button>
        </section>

        {/* -------------------------------------------------
            Platform instructions
        ------------------------------------------------- */}
        <section
          aria-label="Installation instructions"
          className="mt-auto grid grid-cols-2 overflow-hidden rounded-t-[18px] bg-white text-[#07120f]"
        >
          {/* Android */}
          <div className="border-r border-gray-200 px-5 py-5">
            <div className="mb-3 flex items-center gap-2">
              <AndroidIcon />

              <span className="text-[11px] font-bold">
                Android
              </span>
            </div>

            <p className="text-[9px] leading-[1.55] text-gray-500">
              Tap “Install” when prompted by your browser.
            </p>
          </div>

          {/* iPhone */}
          <div className="px-5 py-5">
            <div className="mb-3 flex items-center gap-2">
              <IPhoneIcon />

              <span className="text-[11px] font-bold">
                iPhone
              </span>
            </div>

            <p className="text-[9px] leading-[1.55] text-gray-500">
              Use Safari and tap “Add to Home Screen”.
            </p>
          </div>
        </section>
      </div>

      {/* -------------------------------------------------
          Installation instructions modal
      ------------------------------------------------- */}
      {showHowTo && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-3 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeHowToInstall();
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="install-help-title"
            className="w-full max-w-[430px] rounded-[24px] bg-white p-6 text-[#07120f] shadow-2xl"
          >
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-gray-200" />

            <div className="flex items-center justify-between">
              <h2
                id="install-help-title"
                className="text-lg font-extrabold"
              >
                How to install AviorèGo
              </h2>

              <button
                type="button"
                onClick={closeHowToInstall}
                aria-label="Close installation instructions"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
              >
                <CloseIcon />
              </button>
            </div>

            {isIOS ? (
              /* -------------------------------------------
                 iPhone / iPad
              ------------------------------------------- */
              <div className="mt-5 space-y-4">
                <div className="flex gap-3 rounded-2xl bg-emerald-50 p-4">
                  <IPhoneIcon />

                  <div>
                    <p className="text-sm font-bold text-[#00412e]">
                      iPhone / iPad
                    </p>

                    <p className="mt-2 text-xs leading-6 text-gray-600">
                      Open this page in Safari, tap the{" "}
                      <strong>Share</strong> button, then choose{" "}
                      <strong>Add to Home Screen</strong>.
                    </p>
                  </div>
                </div>

                <p className="text-center text-[10px] text-gray-400">
                  AviorèGo will then appear on your Home Screen like an app.
                </p>
              </div>
            ) : (
              /* -------------------------------------------
                 Android
              ------------------------------------------- */
              <div className="mt-5 space-y-4">
                <div className="flex gap-3 rounded-2xl bg-emerald-50 p-4">
                  <AndroidIcon />

                  <div>
                    <p className="text-sm font-bold text-[#00412e]">
                      Android
                    </p>

                    <p className="mt-2 text-xs leading-6 text-gray-600">
                      Tap <strong>Install Now</strong> and accept the
                      installation prompt from your browser.
                    </p>
                  </div>
                </div>

                <p className="text-center text-[10px] text-gray-400">
                  Once installed, AviorèGo will appear on your Home Screen.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={closeHowToInstall}
              className="mt-6 h-11 w-full rounded-full bg-[#00412e] text-xs font-bold text-white transition hover:bg-[#00533a] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
            >
              Got it
            </button>
          </section>
        </div>
      )}
    </main>
  );
}