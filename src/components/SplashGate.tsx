"use client";

import { useState, useEffect } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { usePathname } from "next/navigation";

interface SplashGateProps {
  children: React.ReactNode;
}

export default function SplashGate({ children }: SplashGateProps) {
  const pathname = usePathname();

  const [isReady, setIsReady] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    "Preparing your experience..."
  );
  const [retryCount, setRetryCount] = useState(0);
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let timer: NodeJS.Timeout | undefined;

    /*
     * Onboarding and login must be accessible without waiting
     * for the backend to wake up.
     *
     * This is especially important when the PWA is launched
     * for the first time.
     */
    if (pathname === "/onboarding" || pathname === "/login") {
      setIsReady(true);
      return;
    }

    // Hard fail-safe: never block the app permanently.
    const failSafeTimer = setTimeout(() => {
      if (isMounted && !isReady) {
        console.warn(
          "SplashGate fail-safe triggered: Proceeding to app..."
        );
        setIsReady(true);
      }
    }, 10000);

    const wakeServerAndPreload = async () => {
      const controller = new AbortController();

      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 5000);

      try {
        setStatusMessage(
          retryCount > 0
            ? "Waking up secure server..."
            : "Preparing your experience..."
        );

        const rawApiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

        const apiUrl = rawApiUrl.replace(/\/$/, "");

        const res = await fetch(`${apiUrl}/api/health`, {
          method: "GET",
          headers: {
            "Cache-Control": "no-cache",
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          throw new Error(
            `Server returned status: ${res.status}`
          );
        }

        setStatusMessage("Loading system config...");

        await new Promise((resolve) =>
          setTimeout(resolve, 300)
        );

        if (isMounted) {
          clearTimeout(failSafeTimer);
          setIsReady(true);
        }
      } catch (err) {
        clearTimeout(timeoutId);

        console.warn(
          "Server connection attempt failed:",
          err instanceof Error ? err.message : err
        );

        if (retryCount >= 1) {
          setIsStuck(true);
          setStatusMessage(
            "Server is taking a moment to spin up..."
          );
        } else {
          setStatusMessage("Connecting to server...");
        }

        timer = setTimeout(() => {
          if (isMounted) {
            setRetryCount((prev) => prev + 1);
          }
        }, 2500);
      }
    };

    wakeServerAndPreload();

    return () => {
      isMounted = false;

      if (timer) {
        clearTimeout(timer);
      }

      clearTimeout(failSafeTimer);
    };
  }, [pathname, retryCount, isReady]);

  /*
   * Onboarding and login immediately render.
   */
  if (isReady) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-neutral-900 p-6 font-sans text-white">
      <div className="h-12 w-full" />

      <div className="flex max-w-xs flex-col items-center space-y-6 text-center">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-white">
            Aviorè<span className="text-emerald-500">Go</span>
          </h1>
        </div>

        <div className="flex flex-col items-center space-y-3 pt-4">
          <div className="relative flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          </div>

          <p className="text-xs font-semibold tracking-wide text-neutral-400">
            {statusMessage}
          </p>
        </div>

        {isStuck && (
          <button
            type="button"
            onClick={() => {
              setIsReady(true);
            }}
            className="mt-4 flex cursor-pointer items-center gap-2 rounded-full border border-neutral-700 bg-neutral-800 px-4 py-2 text-xs font-bold text-neutral-300 transition-colors hover:bg-neutral-700"
          >
            <RefreshCw size={14} />
            <span>Skip & Continue to App</span>
          </button>
        )}
      </div>

      <div className="pb-6 text-center">
        <p className="text-[11px] font-medium text-neutral-500">
          Securing connection to services
        </p>
      </div>
    </div>
  );
}