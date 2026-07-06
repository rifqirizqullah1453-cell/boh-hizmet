import { useEffect, useRef } from 'react';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import app from '../firebase/config';
import { trpc } from '../providers/trpc';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY as string | undefined;

async function registerSw() {
  if (!('serviceWorker' in navigator)) return null;
  try {
    await navigator.serviceWorker.register('/firebase-messaging-sw.js', { scope: '/' });
    return await navigator.serviceWorker.ready;
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

        const swReg = await registerSw();
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
