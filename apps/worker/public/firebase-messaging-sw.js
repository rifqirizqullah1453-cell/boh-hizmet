importScripts("https://www.gstatic.com/firebasejs/10.14.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.14.0/firebase-messaging-compat.js");

// Firebase client config is public — safe to hardcode here.
// Service workers are not processed by Vite so import.meta.env is unavailable.
firebase.initializeApp({
  apiKey: "AIzaSyBoYkPOG7ltuDYZXFl1kYUj70nMXnY4dlU",
  authDomain: "boh-hizmet-ef709.firebaseapp.com",
  projectId: "boh-hizmet-ef709",
  storageBucket: "boh-hizmet-ef709.firebasestorage.app",
  messagingSenderId: "237170457682",
  appId: "1:237170457682:web:156f128cc7784cc126738b",
});

const messaging = firebase.messaging();

// Handles push notifications when the app is closed or in the background.
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title ?? "BÖH Hizmet";
  const body = payload.notification?.body ?? "";

  self.registration.showNotification(title, {
    body,
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    vibrate: [150, 75, 150],
    data: payload.data ?? {},
    tag: payload.data?.orderId ?? "boh-worker",
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) return clientList[0].focus();
      return clients.openWindow("/");
    })
  );
});
