import { cert, getApps, initializeApp, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS);
const app = getApps().length ? getApp() : initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore(app);

export async function POST(request) {
  const { token } = await request.json();

  const docRef = db.collection("fcmTokens").doc(token);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    await docRef.set({ token });
    return Response.json({ success: true, message: "Token added." });
  }

  return Response.json({ success: true, message: "Token already exists." });
}


// import { cert, getApps, initializeApp, getApp } from "firebase-admin/app";
// import { getFirestore } from "firebase-admin/firestore";

// const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS);
// const app = getApps().length ? getApp() : initializeApp({ credential: cert(serviceAccount) });
// const db = getFirestore(app);

// export async function POST(request) {
//   const { token } = await request.json();
//   await db.collection("fcmTokens").doc(token).set({ token });
//   return Response.json({ success: true });
// }
