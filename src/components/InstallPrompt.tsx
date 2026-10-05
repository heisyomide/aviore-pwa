'use client';

import { useEffect, useState } from 'react';

type BrowserType = 'chrome' | 'samsung' | 'firefox' | 'other';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [isVisible, setIsVisible] = useState(false);

  const [browserType, setBrowserType] =
    useState<BrowserType>('other');

  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();

    let detectedBrowser: BrowserType = 'other';

    if (ua.includes('samsungbrowser')) {
      detectedBrowser = 'samsung';
    } else if (ua.includes('firefox')) {
      detectedBrowser = 'firefox';
    } else if (
      ua.includes('chrome') ||
      ua.includes('chromium') ||
      ua.includes('crios')
    ) {
      detectedBrowser = 'chrome';
    }

    setBrowserType(detectedBrowser);

    // Detect installed PWA
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches ||
      window.matchMedia('(display-mode: minimal-ui)').matches ||
      // iOS Safari
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      return;
    }

    // Native PWA install prompt
    const handleBeforeInstallPrompt = (event: Event) => {
      const e = event as BeforeInstallPromptEvent;

      e.preventDefault();

      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener(
      'beforeinstallprompt',
      handleBeforeInstallPrompt
    );

    /*
     * Firefox does not expose beforeinstallprompt.
     * Samsung Internet may expose it depending on device/version.
     *
     * For browsers without the native event, show our
     * manual installation instructions after a short delay.
     */
    const timer = setTimeout(() => {
      setIsVisible((current) => {
        // If native prompt has already arrived, keep that UI.
        if (deferredPrompt) {
          return current;
        }

        return true;
      });
    }, 3000);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );

      clearTimeout(timer);
    };
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    // Native installation available
    if (deferredPrompt) {
      await deferredPrompt.prompt();

      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        setIsVisible(false);
      }

      setDeferredPrompt(null);
      return;
    }

    // No native prompt — show browser instructions
    setShowInstructions(true);
  };

  if (!isVisible) {
    return null;
  }

  const hasNativeInstall = Boolean(deferredPrompt);

  return (
    <>
      {/* Install Banner */}
      <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto flex max-w-md items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-white shadow-2xl">
        <div className="min-w-0">
          <h4 className="text-sm font-semibold">
            Install AviorèGo
          </h4>

          <p className="text-xs text-zinc-400">
            Get faster access to food, deliveries & logistics.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className="px-2 py-1 text-xs text-zinc-500 transition hover:text-zinc-300"
          >
            Later
          </button>

          <button
            type="button"
            onClick={handleInstallClick}
            className="rounded-xl bg-green-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-green-500"
          >
            {hasNativeInstall ? 'Install App' : 'How to Install'}
          </button>
        </div>
      </div>

      {/* Manual Installation Instructions */}
      {showInstructions && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm space-y-4 rounded-3xl border border-zinc-800 bg-zinc-900 p-6 text-white">
            <h3 className="text-lg font-bold">
              Add AviorèGo to Home Screen
            </h3>

            {browserType === 'firefox' && (
              <div className="space-y-3">
                <p className="text-sm leading-relaxed text-zinc-300">
                  Firefox does not provide the same automatic
                  installation prompt as Chrome.
                </p>

                <p className="text-sm leading-relaxed text-zinc-300">
                  Open the Firefox menu and look for the option to
                  <span className="font-semibold text-green-500">
                    {' '}Add to Home Screen
                  </span>
                  {' '}or add the page to your device home screen.
                </p>
              </div>
            )}

            {browserType === 'samsung' && (
              <div className="space-y-3">
                <p className="text-sm leading-relaxed text-zinc-300">
                  If your Samsung Internet browser provides the
                  installation prompt, choose
                  <span className="font-semibold text-green-500">
                    {' '}Install
                  </span>
                  .
                </p>

                <p className="text-sm leading-relaxed text-zinc-300">
                  Otherwise open the browser menu and choose
                  <span className="font-semibold text-green-500">
                    {' '}Add page to Home screen
                  </span>
                  .
                </p>
              </div>
            )}

            {browserType === 'chrome' && !deferredPrompt && (
              <div className="space-y-3">
                <p className="text-sm leading-relaxed text-zinc-300">
                  Chrome has not made the automatic installation
                  prompt available yet.
                </p>

                <p className="text-sm leading-relaxed text-zinc-300">
                  Open the Chrome menu and look for
                  <span className="font-semibold text-green-500">
                    {' '}Install app
                  </span>
                  {' '}or
                  <span className="font-semibold text-green-500">
                    {' '}Add to Home screen
                  </span>
                  .
                </p>
              </div>
            )}

            {browserType === 'other' && (
              <p className="text-sm leading-relaxed text-zinc-300">
                Open your browser menu and look for
                <span className="font-semibold text-green-500">
                  {' '}Add to Home Screen
                </span>
                {' '}or
                <span className="font-semibold text-green-500">
                  {' '}Install
                </span>
                .
              </p>
            )}

            <button
              type="button"
              onClick={() => setShowInstructions(false)}
              className="mt-2 w-full rounded-xl bg-zinc-800 py-3 text-sm font-medium text-white transition hover:bg-zinc-700"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}