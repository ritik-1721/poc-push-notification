importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyANiBSBiMVc7t-VTgicpR5tBCPsCsFfWWo",
    authDomain: "push-demo-cbfd9.firebaseapp.com",
    projectId: "push-demo-cbfd9",
    messagingSenderId: "266500566286",
    appId: "1:266500566286:web:2be7cc58d449cc8af17b5f"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  const { title, body, url } = payload.data;
  self.registration.showNotification(title, {
    body,
    icon: '/vercel.svg',
    data: {
      url: url,
    }
  });
});


// Handle notification click
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});