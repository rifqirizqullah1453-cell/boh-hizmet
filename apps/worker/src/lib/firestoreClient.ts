import { createFirestoreClient } from "@boh/api";
import { getAuth, connectAuthEmulator } from "firebase/auth";

// Web SDK config — public by design (Firestore security rules do the real
// access control), safe to bundle into the client. When pointed at the
// emulator, these values are never actually sent anywhere — the emulator
// accepts any project id — but projectId must still match .firebaserc's
// "default" so the Worker App and `firebase emulators:start` agree on
// which project's data they're looking at.
export const firestore = createFirestoreClient({
  config: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-boh-hizmet",
  },
  useEmulator: import.meta.env.VITE_USE_FIRESTORE_EMULATOR === "true",
});

declare global {
  // eslint-disable-next-line no-var
  var __authEmulatorConnected: boolean | undefined;
}
if (import.meta.env.VITE_USE_FIRESTORE_EMULATOR === "true" && !globalThis.__authEmulatorConnected) {
  connectAuthEmulator(getAuth(), "http://localhost:9099", { disableWarnings: true });
  globalThis.__authEmulatorConnected = true;
}
