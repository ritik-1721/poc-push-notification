"use client";
import { useEffect, useState } from "react";
import {
  getMessagingInstance,
  getToken,
  onMessage,
} from "@/lib/firebase-config";
import { useToast } from "@/components/ToastProvider";

export default function usePushNotifications() {
  const { showToast } = useToast();
  const [fcmToken, setFcmToken] = useState(null);
  const [errors, setErrors] = useState([]);

  const addError = (message) => {
    setErrors((prev) => [...prev, message]);
    console.error(message);
  };

  const setupPush = async () => {
    try {

      if (!window.Notification) {
        addError("Push notifications not supported in this browser.");
        return;
      }


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
          showToast(title , body, "success");
        }
          
        // if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream /* iOS detection */ || /Macintosh|MacIntel|MacPPC|Mac68K/.test(userAgent) /* macOS */) {
        //   self.registration.showNotification(title, {
        //     body,
        //     icon: '/vercel.svg',
        //     data: {
        //       url: '/notifications',
        //     }
        //   });
        // }

      });

    } catch (err) {
      addError(`Unexpected error setting up push notifications: ${err.message || err}`);
    }
  };

  useEffect(() => {
    const runPushSetup = async () => {
      let attempts = 0;
      let token = null;

      while (attempts < 3 && !token) {
        token = await setupPush();
        attempts++;

        if (!token && attempts < 3) {
          await new Promise((r) => setTimeout(r, 1000));
        }
      }
    };

    runPushSetup();
  }, []);

  return { setupPush, fcmToken, errors };
}
