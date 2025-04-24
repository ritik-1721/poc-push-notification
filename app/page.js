"use client";

import usePushNotifications from "@/hooks/usePushNotifications";
import { useEffect, useState } from "react";

export default function Home() {
  const { setupPush, fcmToken, errors, notificationPermission } = usePushNotifications();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("✅ Service Worker registered:", registration);
        })
        .catch((error) => {
          console.error("❌ Service Worker registration failed:", error);
        });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = e.target.token.value;
      const title = e.target.title.value;
      const body = e.target.body.value;

      const res = await fetch("/api/send-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, title, body }),
      });

      const data = await res.json();
      console.log("Push sent:", data);
    } catch (err) {
      console.error("Failed to send push:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6 sm:p-12 bg-gradient-to-br from-gray-900 via-[#1e1e2f] to-black text-white font-mono flex flex-col gap-16 items-center justify-center">
      <main className="flex flex-col gap-6 items-center text-center w-full max-w-xl">
        <h1 className="text-3xl font-bold tracking-tight">🔔 Push Notification POC</h1>

        {(!notificationPermission || !fcmToken )&& (
          <button
            onClick={() => setupPush()}
            className="bg-pink-600 hover:bg-pink-700 transition text-white px-6 py-3 rounded-full shadow-md"
          >
            🚀 Enable Push Notifications
          </button>
        )}

        <div className="w-full bg-[#121212] border border-gray-700 p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-2">📲 Dummy FCM Token</h2>
          <code className="break-words text-sm text-green-400">{fcmToken}</code>
          <code className="break-words text-sm text-red-400">{!fcmToken && errors.join(", ")}</code>
        </div>

        <div className="w-full bg-[#1c1c1c] border border-gray-700 p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-2">🧪 Preview Notification</h2>
          <div className="bg-black text-left p-3 rounded-md shadow-inner border border-pink-500">
            <p className="text-pink-400 font-bold">Hello!</p>
            <p className="text-gray-300">This is your push test 🎯</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 bg-[#1c1c1c] p-4 rounded-md border border-gray-700 w-full"
        >
          <h2 className="text-lg font-semibold mb-2">📤 Send Push Notification</h2>
          <input
            type="text"
            name="token"
            placeholder="Token (leave empty for all)"
            className="p-2 rounded bg-black text-white border border-gray-600"
          />
          <input
            type="text"
            name="title"
            placeholder="Notification Title"
            required
            className="p-2 rounded bg-black text-white border border-gray-600"
          />
          <input
            type="text"
            name="body"
            placeholder="Notification Body"
            required
            className="p-2 rounded bg-black text-white border border-gray-600"
          />
          <button
            disabled={submitting}
            type="submit"
            className={`px-4 py-2 rounded-full shadow transition ${submitting
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
              } text-white`}
          >
            {submitting ? "📤 Sending..." : "🎯 Send Push"}
          </button>
        </form>
      </main>
    </div>
  );
}