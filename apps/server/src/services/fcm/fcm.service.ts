import { getApps, getApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import { getFirestoreClient } from "../firestore/client";

// Ensure the Firebase Admin app is initialized (getFirestoreClient does this).
function getMessagingClient() {
  // Trigger lazy init of the admin app if not yet done.
  getFirestoreClient();
  const app = getApps()[0] ?? getApp();
  return getMessaging(app);
}

export async function sendPushToTokens(
  tokens: string[],
  notification: { title: string; body: string },
  data?: Record<string, string>
) {
  if (tokens.length === 0) return;

  const messaging = getMessagingClient();

  // sendEachForMulticast supports up to 500 tokens per call.
  const chunks: string[][] = [];
  for (let i = 0; i < tokens.length; i += 500) {
    chunks.push(tokens.slice(i, i + 500));
  }

  for (const chunk of chunks) {
    try {
      await messaging.sendEachForMulticast({
        tokens: chunk,
        notification,
        data,
        android: { priority: "high" },
        apns: {
          payload: { aps: { sound: "default", badge: 1 } },
          headers: { "apns-priority": "10" },
        },
      });
    } catch (err) {
      console.error("[fcm.service] sendEachForMulticast failed", err);
    }
  }
}

export async function sendPushToToken(
  token: string,
  notification: { title: string; body: string },
  data?: Record<string, string>
) {
  await sendPushToTokens([token], notification, data);
}
