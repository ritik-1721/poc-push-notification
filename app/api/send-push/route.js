
import { cert, getApps, getApp, initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS);

const app = getApps().length
  ? getApp()
  : initializeApp({ credential: cert(serviceAccount) });

const db = getFirestore(app);

export async function POST(request) {
  try {
    const { title, body, token } = await request.json();
    if (!title || !body) {
      return new Response("Missing title or body", { status: 400 });
    }

    let results = [];

    if(token){
    
      await getMessaging().send({
        token,
        notification: { title, body },
      }).then(res => results.push({ token, success: true, messageId: res }))
        .catch(err => results.push({ token, success: false, error: err.message }))
    
    }else{

      const snapshot = await db.collection("fcmTokens").get();
      const tokens = snapshot.docs.map((doc) => doc.id);
      const sendAll = tokens.map((token) =>
        getMessaging().send({
          token,
          notification: { title, body },
        }).then(res => ({ token, success: true, messageId: res }))
          .catch(err => ({ token, success: false, error: err.message }))
      );
      results = await Promise.all(sendAll);
      
    }

    return Response.json({ success: true, results });
  } catch (err) {
    console.error("Push error:", err);
    return new Response("Push send failed", { status: 500 });
  }
}
