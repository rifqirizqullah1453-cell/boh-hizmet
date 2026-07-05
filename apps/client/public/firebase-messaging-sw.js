importScripts("https://www.gstatic.com/firebasejs/10.14.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.14.0/firebase-messaging-compat.js");

let messaging = null;

self.addEventListener("message", (event) => {
  if (event.data?.type === "FIREBASE_CONFIG" && !messaging) {
    firebase.initializeApp(event.data.config);
    messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      const title = payload.notification?.title ?? "BÖH Hizmet";
      const body = payload.notification?.body ?? "";

      self.registration.showNotification(title, {
        body,
        icon: "/images/boh-cat.png",
        badge: "/images/boh-cat.png",
        vibrate: [100, 50, 100],
        data: payload.data ?? {},
        tag: payload.data?.orderId ?? "boh-customer",
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
