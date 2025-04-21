import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

/**
 * const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;
 * This is a workaround to avoid the error "window is not defined" in SSR.
 * Safely get messaging instance only in the browser.
*/

const getMessagingInstance = () => {
  if (typeof window !== 'undefined') {
    return getMessaging(app);
  }
  return null;
};

export { getMessagingInstance, getToken, onMessage };
