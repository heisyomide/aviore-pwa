"use client";

import { useState, useEffect } from "react";
import { Loader2, RefreshCw } from "lucide-react";

interface SplashGateProps {
  children: React.ReactNode;
}

export default function SplashGate({ children }: SplashGateProps) {
  const [isReady, setIsReady] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Preparing your experience...");
  const [retryCount, setRetryCount] = useState(0);
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let timer: NodeJS.Timeout;

    // Hard fail-safe: Force entry after 10 seconds so user is never permanently blocked
    const failSafeTimer = setTimeout(() => {
      if (isMounted && !isReady) {
        console.warn("SplashGate fail-safe triggered: Proceeding to app...");
        setIsReady(true);
      }
    }, 10000);

    const wakeServerAndPreload = async () => {
      const controller = new AbortController();
      // 5-second timeout per fetch attempt
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      try {
        if (retryCount > 0) {
          setStatusMessage("Waking up secure server...");
        } else {
          setStatusMessage("Preparing your experience...");
        }

        const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        // Clean trailing slashes
        const apiUrl = rawApiUrl.replace(/\/$/, "");

        // 1. Try waking backend with fallback route paths
        let res: Response | null = null;
        try {
          res = await fetch(`${apiUrl}/api/health`, {
            method: "GET",
            headers: { "Cache-Control": "no-cache" },
            signal: controller.signal,
          });
        } catch {
          // Fallback to /api/health if /health fails
          res = await fetch(`${apiUrl}/api/health`, {
            method: "GET",
            headers: { "Cache-Control": "no-cache" },
            signal: controller.signal,
          });
        }

        clearTimeout(timeoutId);

        if (!res || !res.ok) {
          throw new Error(`Server returned status: ${res?.status || "No Response"}`);
        }

        setStatusMessage("Loading system config...");
        await new Promise((resolve) => setTimeout(resolve, 300)); // Smooth transition

        if (isMounted) {
          clearTimeout(failSafeTimer);
          setIsReady(true);
        }
      } catch (err: any) {
        clearTimeout(timeoutId);
        console.warn("Server connection attempt failed:", err.message);

        if (retryCount >= 1) {
          setIsStuck(true);
          setStatusMessage("Server is taking a moment to spin up...");
        } else {
          setStatusMessage("Connecting to server...");
        }

        // Retry after 2.5 seconds
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
      if (timer) clearTimeout(timer);
      if (failSafeTimer) clearTimeout(failSafeTimer);
    };
  }, [retryCount]);

  // Once server ping passes or fail-safe triggers, show app
  if (isReady) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-neutral-900 text-white p-6 font-sans">
      <div className="w-full h-12" />

      <div className="flex flex-col items-center text-center max-w-xs space-y-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-white">
            Aviorè<span className="text-emerald-500">Go</span>
          </h1>
        </div>

        <div className="flex flex-col items-center space-y-3 pt-4">
          <div className="relative flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          </div>

          <p className="text-xs font-semibold text-neutral-400 tracking-wide">
            {statusMessage}
          </p>
        </div>

        {isStuck && (
          <button
            onClick={() => {
              setIsReady(true); // Allow direct bypass on manual click
            }}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-full text-xs font-bold border border-neutral-700 transition-colors cursor-pointer"
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