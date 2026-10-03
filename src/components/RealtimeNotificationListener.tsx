"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";

// Helper sound utility (plays WhatsApp-style ping)
const playNotificationSound = () => {
  try {
    // Short, clean beep generated programmatically via a tiny base64 wav/mp3 string
    const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJ_u3+W7////jIqJioaEdHR0dHQ=");
    audio.volume = 0.5;
    audio.play().catch(() => {});
  } catch (e) {
    // Suppress restrictions
  }
};

export default function RealtimeNotificationListener() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("rider_token") ||
      localStorage.getItem("aviore_token") ||
      sessionStorage.getItem("token") ||
      document.cookie.split("; ").find((row) => row.startsWith("token="))?.split("=")[1];

    if (!token) return;

    const socketUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "http://localhost:5000";
    
    const socket = io(`${socketUrl}/job-comm`, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("[Socket] Connected for real-time notifications, ID:", socket.id);
    });

    // 1. Listen for generic notifications (system, status updates, etc.)
    socket.on("new_notification", (notification) => {
      console.log("[Socket] New system notification:", notification);
      queryClient.invalidateQueries({ queryKey: ["user-notifications"] });

      if (Notification.permission === "granted") {
        new Notification(notification.title || "Aviorè Go", {
          body: notification.body,
          icon: "/images/logo.png",
        });
      }
    });

    // 2. Listen specifically for incoming chat messages in the background
    socket.on("new_chat_notification", (data: { jobId: string; text: string; senderId: string }) => {
      console.log("[Socket] New chat message alert received:", data);
      
      playNotificationSound();
      
      queryClient.invalidateQueries({ queryKey: ["user-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["chat-messages", data.jobId] });

      if (Notification.permission === "granted") {
        new Notification("New Message from Customer / Rider", {
          body: data.text,
          icon: "/images/logo.png",
        });
      }
    });

    socket.on("connect_error", (err) => {
      console.error("[Socket Connection Error]:", err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);

  return null;
}