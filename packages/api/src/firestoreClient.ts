import { initializeApp, getApps, type FirebaseOptions } from "firebase/app";
import { connectFirestoreEmulator, getFirestore, type Firestore } from "firebase/firestore";

export interface CreateFirestoreClientOptions {
  config: FirebaseOptions;
  useEmulator?: boolean;
  emulatorHost?: string;
  emulatorPort?: number;
}

// `connectFirestoreEmulator` throws if called twice on the same instance —
// guard with a module-level flag so Vite HMR re-running this module doesn't
// crash the dev server on the second hot reload. `var` + `globalThis` (not a
// local module variable) so the flag survives module re-evaluation across
// HMR boundaries, and so two apps sharing this package in the same browser
// tab (unlikely, but cheap to guard) don't double-connect either.
declare global {
  // eslint-disable-next-line no-var
  var __firestoreEmulatorConnected: boolean | undefined;
}

let firestoreInstance: Firestore | undefined;

/**
 * Shared by every frontend so the "init once, connect to emulator at most
 * once" guard lives in one place. Each app passes its own VITE_FIREBASE_*
 * config and VITE_USE_FIRESTORE_EMULATOR flag — this function doesn't read
 * import.meta.env itself so it stays usable from any Vite app without
 * coupling to a specific app's env var names.
 */
export function createFirestoreClient(opts: CreateFirestoreClientOptions): Firestore {
  if (firestoreInstance) return firestoreInstance;

  const app = getApps().length ? getApps()[0] : initializeApp(opts.config);
  firestoreInstance = getFirestore(app);

  if (opts.useEmulator && !globalThis.__firestoreEmulatorConnected) {
    const host = opts.emulatorHost ?? "localhost";
    const port = opts.emulatorPort ?? 8080;
    connectFirestoreEmulator(firestoreInstance, host, port);
    globalThis.__firestoreEmulatorConnected = true;
    console.info(`[firestoreClient] Connected to local Firestore emulator at ${host}:${port}`);
  }

  return firestoreInstance;
}
