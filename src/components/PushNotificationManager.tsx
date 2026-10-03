"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { api } from "../lib/api"; // Import your project's standardized API client

// Helper function to convert base64 VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function PushNotificationManager() {
  const [showBellBtn, setShowBellBtn] = useState(false);

useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;

    const checkAndSync = async () => {
      const token = localStorage.getItem("aviore_token");
      if (!token) {
        return; // Wait until logged in
      }

      if (Notification.permission === "granted") {
        setShowBellBtn(false);
        try {
          const registration = await navigator.serviceWorker.ready;
          await syncPushTokenWithBackend(registration);
        } catch (err) {
          console.error(err);
        }
      } else if (Notification.permission !== "denied") {
        setShowBellBtn(true);
      }
    };

    checkAndSync();

    // Optional: listen for storage changes (e.g. login event in another tab or auth sync)
    window.addEventListener("storage", checkAndSync);
    return () => window.removeEventListener("storage", checkAndSync);
  }, []);

  const syncPushTokenWithBackend = async (registration: ServiceWorkerRegistration) => {
    try {
      // Check if user is actually logged in using the project's token key
      const token = localStorage.getItem("aviore_token");
      if (!token) {
        console.warn("Push sync skipped: Authorization token not found");
        return;
      }

      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!publicVapidKey) {
          console.error("Missing NEXT_PUBLIC_VAPID_PUBLIC_KEY in env variables");
          return;
        }

        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
        });
      }

      // Use the project's api client (automatically injects 'aviore_token' as Bearer)
      await api.post("/notifications/subscribe", subscription);

      console.log("Push subscription synchronized successfully");
    } catch (err) {
      console.error("Failed to sync push subscription with backend:", err);
    }
  };

  const handleRequestPermission = async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support push notifications.");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      setShowBellBtn(false);
      const registration = await navigator.serviceWorker.ready;
      await syncPushTokenWithBackend(registration);
    }
  };

  if (!showBellBtn) return null;

  return (
    <button
      onClick={handleRequestPermission}
      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all cursor-pointer shadow-md"
    >
      <Bell className="w-4 h-4" />
      Enable Push Notifications
    </button>
  );
}