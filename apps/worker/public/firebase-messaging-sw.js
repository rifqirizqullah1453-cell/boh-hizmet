importScripts("https://www.gstatic.com/firebasejs/10.14.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.14.0/firebase-messaging-compat.js");

let messaging = null;

// Config is injected at registration time via postMessage so we don't have to
// hardcode it here (and it stays in sync with the env vars used by the main app).
self.addEventListener("message", (event) => {
  if (event.data?.type === "FIREBASE_CONFIG" && !messaging) {
    firebase.initializeApp(event.data.config);
    messaging = firebase.messaging();

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
  }
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
