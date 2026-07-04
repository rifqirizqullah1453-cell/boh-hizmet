import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { eq } from "drizzle-orm";
import { users, type Database, type User } from "@boh/db";
import { env } from "../../env";

function getAdminAuth() {
  // Reuse the app already initialized by firestore/client.ts if it got there
  // first; initialize it ourselves otherwise (e.g. a request arrives before
  // any Firestore write has been made).
  if (!getApps().length) {
    const useEmulator = Boolean(
      process.env.FIRESTORE_EMULATOR_HOST || process.env.FIREBASE_AUTH_EMULATOR_HOST
    );
    initializeApp(
      useEmulator
        ? { projectId: env.firebaseProjectId || "demo-boh-hizmet" }
        : {
            credential: cert({
              projectId: env.firebaseProjectId,
              clientEmail: env.firebaseClientEmail,
              privateKey: env.firebasePrivateKey.replace(/\\n/g, "\n"),
            }),
          }
    );
  }
  return getAuth();
}

export async function authenticateRequest(headers: Headers, db: Database): Promise<User | undefined> {
  const authorization = headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return undefined;

  const idToken = authorization.slice(7);

  try {
    const decoded = await getAdminAuth().verifyIdToken(idToken);
    const { uid: firebaseUid, name: firebaseName, email } = decoded;

    const existing = await db.query.users.findFirst({ where: eq(users.firebaseUid, firebaseUid) });
    if (existing) return existing;

    // First-ever request from this Firebase account — create a MySQL row with
    // the default customer role. The app calls auth.register immediately after
    // login to set the canonical name and correct role (worker apps pass
    // role: "worker" there).
    const derivedName = firebaseName ?? (email ? email.split("@")[0] : null);
    const [row] = await db
      .insert(users)
      .values({ firebaseUid, name: derivedName, role: "customer" })
      .$returningId();

    return db.query.users.findFirst({ where: eq(users.id, row.id) });
  } catch {
    // Invalid / expired token — treat as anonymous.
    return undefined;
  }
}
