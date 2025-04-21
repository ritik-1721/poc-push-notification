"use client";
import { useEffect, useState } from "react";
import {
  getMessagingInstance,
  getToken,
  onMessage,
} from "@/lib/firebase-config";

// Utility to check for push support
const isPushSupported = () => {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
};

export default function usePushNotifications() {
  const [fcmToken, setFcmToken] = useState(null);
  const [errors, setErrors] = useState([]);

  const addError = (message) => {
    setErrors((prev) => [...prev, message]);
    console.error(message); // Still logs to console for visibility
  };

  const setupPush = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        addError("Notification permission denied.");
        return;
      }

      const messaging = getMessagingInstance();
      if (!messaging) {
        addError("Firebase Messaging is not available.");
        return;
      }

      const swRegistration = await navigator.serviceWorker.ready;
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: swRegistration,
      });

      if (token) {
        console.log("FCM Token:", token);
        setFcmToken(token);
        await fetch("/api/save-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
      } else {
        addError("Failed to retrieve FCM token.");
      }

      onMessage(messaging, (payload) => {
        const { title, body } = payload.notification || {};
        if (title && body) {
          alert(`${title}: ${body}`);
        }
      });
    } catch (err) {
      addError(`Unexpected error setting up push notifications: ${err.message || err}`);
    }
  };

  useEffect(() => {
    if (!isPushSupported()) {
      addError("not setupPush called");
      addError("Push notifications not supported in this browser.");
      return;
    }
    setupPush();
  }, []);

  return { setupPush, fcmToken, errors };
}
