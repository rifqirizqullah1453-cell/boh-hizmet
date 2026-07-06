import { createFirestoreClient } from "@boh/api";
import { getAuth, connectAuthEmulator } from "firebase/auth";

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
