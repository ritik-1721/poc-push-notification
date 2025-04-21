import { cert, getApps, initializeApp, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS);
const app = getApps().length ? getApp() : initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore(app);

export async function POST(request) {
  console.log("serviceAccount:", serviceAccount);
  console.log("Firebase app initialized:", app.name);
  const { token } = await request.json();
  console.log("Received token:", token);    
  await db.collection("fcmTokens").doc(token).set({ token });
  return Response.json({ success: true });
}
