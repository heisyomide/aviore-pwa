"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};

export default function AppGatewayPage() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);

  useEffect(() => {
    // Check if AviorèGo is already running as an installed PWA
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;

    if (standalone) {
      setIsInstalled(true);

      // Already inside the installed app.
      // Send the user into the actual app.
      window.location.replace("/");
      return;
    }

    // Detect iPhone / iPad
    const userAgent = navigator.userAgent || "";

    const ios =
      /iPad|iPhone|iPod/.test(userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    setIsIOS(ios);

    // Android / Chrome / supported browsers
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();

      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      setShowHowTo(true);
      return;
    }

    await deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#00412e] px-3 py-3 text-white">
      <div className="mx-auto flex min-h-[calc(100svh-24px)] w-full max-w-[430px] flex-col overflow-hidden rounded-[20px] bg-[#00412e] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3 pt-5">
          <div className="flex items-center gap-2">

              <span className="text-[20px] font-extrabold tracking-[-0.8px] md:text-[22px]">
                Avior
                <span className="text-emerald-400">è</span>
                Go
              </span>
          </div>

          <button
            type="button"
            onClick={() => window.history.back()}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            <span className="text-xl leading-none">×</span>
          </button>
        </div>

        {/* App preview */}
        <div className="relative flex h-[205px] items-end justify-center overflow-hidden">
          <div className="relative h-[205px] w-[145px] overflow-hidden rounded-[24px] border-[4px] border-[#061c14] bg-black shadow-2xl">
            <Image
              src="/images/app.jpeg"
              alt="AviorèGo app preview"
              fill
              priority
              className="object-cover"
              sizes="145px"
            />
          </div>
        </div>

        {/* Main content */}
        <div className="px-7 pb-6 pt-5 text-center">
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
            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-5 text-[11px] font-bold text-[#00412e] shadow-lg transition active:scale-[0.98]"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 3v12" />
              <path d="m7 10 5 5 5-5" />
              <path d="M5 21h14" />
            </svg>

            Install Now
          </button>

          <button
            type="button"
            onClick={() => setShowHowTo(true)}
            className="mt-4 text-[10px] font-medium text-white underline underline-offset-2"
          >
            How to install?
          </button>
        </div>

        {/* Platform instructions */}
        <div className="mt-auto grid grid-cols-2 overflow-hidden rounded-t-[18px] bg-white text-[#07120f]">
          <div className="border-r border-gray-200 px-5 py-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-xl">🤖</span>

              <span className="text-[11px] font-bold">
                Android
              </span>
            </div>

            <p className="text-[9px] leading-[1.55] text-gray-500">
              Tap “Install” when prompted by your browser.
            </p>
          </div>

          <div className="px-5 py-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-xl"></span>

              <span className="text-[11px] font-bold">
                iPhone
              </span>
            </div>

            <p className="text-[9px] leading-[1.55] text-gray-500">
              Use Safari and tap “Add to Home Screen”.
            </p>
          </div>
        </div>
      </div>

      {/* How-to-install modal */}
      {showHowTo && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-3 backdrop-blur-sm">
          <div className="w-full max-w-[430px] rounded-[24px] bg-white p-6 text-[#07120f] shadow-2xl">
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-gray-200" />

            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold">
                How to install AviorèGo
              </h2>

              <button
                type="button"
                onClick={() => setShowHowTo(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-lg"
              >
                ×
              </button>
            </div>

            {isIOS ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-emerald-50 p-4">
                  <p className="text-sm font-bold text-[#00412e]">
                    iPhone / iPad
                  </p>

                  <p className="mt-2 text-xs leading-6 text-gray-600">
                    Open this page in Safari, tap the Share button, then
                    choose <strong>Add to Home Screen</strong>.
                  </p>
                </div>

                <p className="text-center text-[10px] text-gray-400">
                  AviorèGo will then appear on your Home Screen like an app.
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-emerald-50 p-4">
                  <p className="text-sm font-bold text-[#00412e]">
                    Android
                  </p>

                  <p className="mt-2 text-xs leading-6 text-gray-600">
                    Tap <strong>Install Now</strong> and accept the
                    installation prompt from your browser.
                  </p>
                </div>

                <p className="text-center text-[10px] text-gray-400">
                  Once installed, AviorèGo will appear on your Home Screen.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowHowTo(false)}
              className="mt-6 h-11 w-full rounded-full bg-[#00412e] text-xs font-bold text-white"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </main>
  );
}