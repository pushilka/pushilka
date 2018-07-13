self.addEventListener('push', function (event) {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }

    var sendNotification = function (message) {
        return self.registration.showNotification(message.title, {
            body: message.body,
            icon: message.icon,
            badge: message.badge,
            image: message.image,
            vibrate: message.vibrate,
            sound: message.sound,
            sticky: true,
            noscreen: false,
            requireInteraction: false,
            timestamp: message.timestamp,
            data: {
                url: message.url
            }
        });
    };

    if (event.data) {
        var message = event.data.json();
        event.waitUntil(sendNotification(message));
    }
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});