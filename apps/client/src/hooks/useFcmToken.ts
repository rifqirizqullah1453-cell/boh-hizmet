import { useEffect, useRef } from 'react';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import app from '../firebase/config';
import { trpc } from '../providers/trpc';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY as string | undefined;

const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

async function registerSwAndInjectConfig() {
  if (!('serviceWorker' in navigator)) return null;
  try {
    await navigator.serviceWorker.register('/firebase-messaging-sw.js', { scope: '/' });
    // Wait until the SW is fully activated before postMessage — avoids losing
    // the config message when the SW is still in the "installing" state.
    const reg = await navigator.serviceWorker.ready;
    reg.active?.postMessage({ type: 'FIREBASE_CONFIG', config: FIREBASE_CONFIG });
    return reg;
  } catch (err) {
    console.warn('[useFcmToken] SW registration failed', err);
    return null;
  }
}

export function useFcmToken(enabled: boolean) {
  const saveFcmToken = trpc.auth.saveFcmToken.useMutation();
  const savedRef = useRef(false);

  useEffect(() => {
    if (!enabled || savedRef.current) return;
    if (!VAPID_KEY) {
      console.warn('[useFcmToken] VITE_FIREBASE_VAPID_KEY is not set — push notifications disabled');
      return;
    }

    void (async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return;

        const swReg = await registerSwAndInjectConfig();
        if (!swReg) return;

        const messaging = getMessaging(app);
        const token = await getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: swReg });
        if (!token) return;

        await saveFcmToken.mutateAsync({ token });
        savedRef.current = true;
        console.info('[useFcmToken] FCM token saved (customer)');

        // Handle foreground messages.
        onMessage(messaging, (payload) => {
          const title = payload.notification?.title ?? 'BÖH Hizmet';
          const body = payload.notification?.body ?? '';
          if (Notification.permission === 'granted') {
            new Notification(title, {
              body,
              icon: '/images/boh-cat.png',
              tag: payload.data?.orderId ?? 'boh-customer-fg',
            });
          }
        });
      } catch (err) {
        console.warn('[useFcmToken] Failed to get FCM token', err);
      }
    })();
  }, [enabled]);
}
