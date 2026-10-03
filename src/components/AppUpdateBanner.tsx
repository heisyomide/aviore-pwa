'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { RefreshCw, Sparkles, ShieldAlert } from 'lucide-react';

export default function UpdateBanner() {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // 1. Check version via API endpoint on load
    const checkServerVersion = async () => {
      try {
        const res = await api.get('/api/health/version');
        const currentVersion = res.data.version;
        const savedVersion = localStorage.getItem('aviore_app_version');

        if (savedVersion && savedVersion !== currentVersion) {
          setShowUpdateModal(true);
        } else if (!savedVersion) {
          localStorage.setItem('aviore_app_version', currentVersion);
        }
      } catch (err) {
        // Ignore network errors
      }
    };

    checkServerVersion();

    // 2. Keep Service Worker listener as a fallback if registered
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setShowUpdateModal(true);
              }
            });
          }
        });
      });
    }
  }, []);

  const handleReload = async () => {
    setIsUpdating(true);
    try {
      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
        }
      }

      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }

      const res = await api.get('/api/health/version');
      localStorage.setItem('aviore_app_version', res.data.version);
    } catch (e) {
      // fallback
    }
    window.location.reload();
  };

  if (!showUpdateModal) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6 shadow-2xl text-center flex flex-col items-center">
        
        {/* Glowing visual indicator */}
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>

        <h3 className="text-white text-lg font-bold tracking-tight mb-1 font-mono">
          System Update Required
        </h3>
        
        <p className="text-zinc-400 text-xs leading-relaxed max-w-xs mb-6">
          A new version of Aviorè has been deployed with performance improvements and critical updates. Please reload to continue.
        </p>

        <button 
          onClick={handleReload}
          disabled={isUpdating}
          className="w-full flex items-center justify-center gap-2 bg-white text-black font-semibold text-xs py-3 rounded-xl hover:bg-zinc-200 transition-all duration-200 cursor-pointer disabled:opacity-50 font-mono tracking-wider uppercase shadow-lg shadow-white/5"
        >
          <RefreshCw className={`w-4 h-4 ${isUpdating ? "animate-spin" : ""}`} />
          {isUpdating ? "Updating Workspace..." : "Update & Reload Now"}
        </button>

        <div className="mt-4 flex items-center gap-1.5 text-[10px] text-zinc-600 font-mono">
          <ShieldAlert className="w-3 h-3" />
          <span>Unsaved actions are safely persisted</span>
        </div>
      </div>
    </div>
  );
}