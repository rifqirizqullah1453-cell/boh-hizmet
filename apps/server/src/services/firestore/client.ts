import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { env } from "../../env";

let firestore: Firestore | undefined;

// Lazily initialized so importing this module never throws when
// FIREBASE_* env vars are unset (e.g. running the SQL-only parts in dev).
export function getFirestoreClient(): Firestore {
  if (!firestore) {
    // The Admin SDK auto-detects FIRESTORE_EMULATOR_HOST (set this in
    // apps/server/.env when running `firebase emulators:start`) and talks
    // to the emulator unauthenticated — passing a service-account cert()
    // in that mode isn't just unnecessary, it actively fails because the
    // placeholder FIREBASE_* values in .env.example aren't a valid PEM key.
    const useEmulator = Boolean(process.env.FIRESTORE_EMULATOR_HOST);

    const app =
      getApps()[0] ??
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
    firestore = getFirestore(app);
  }
  return firestore;
}
