function Pushilka(options) {
    var params = {
        endpoint: "https://push.wuazu.net/push_subscription.php",
        serviceWorker: "/serviceWorker.js",
        serviceWorkerOptions: {scope: "/"},
        applicationServerKey: "BCmIwkLHxJNPccoVf2UXDjd7kDuiyJpKsSOqSHCtGBMfBkjfHLCq4-d8eNtabNlCNKFF8CZIzeDwOo3OvNCQAns",
        source: "",
        var1: "",
        var2: "",
        var3: "",
        var4: "",

        done: function () {
        }
    };

    for (var i in options) {
        if (options.hasOwnProperty(i) && params.hasOwnProperty(i)) {
            params[i] = options[i];
        }
    }

    function urlBase64ToUint8Array(base64String) {
        var padding = '='.repeat((4 - base64String.length % 4) % 4);
        var base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        var rawData = window.atob(base64);
        var outputArray = new Uint8Array(rawData.length);

        for (var i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    function subscribe() {
        navigator.serviceWorker.ready
            .then(function (serviceWorkerRegistration) {
                return serviceWorkerRegistration.pushManager
                    .subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array(params.applicationServerKey)
                    });
            })
            .then(function (subscription) {
                return sendSubscriptionToServer(subscription, 'POST');
            })
            .catch(function () {
                params.done();
            });
    }

    function sendSubscriptionToServer(subscription, method) {
        var key = subscription.getKey('p256dh');
        var token = subscription.getKey('auth');
        var contentEncoding = (PushManager.supportedContentEncodings || ['aesgcm'])[0];

        return fetch(params.endpoint + '?'
            + 's=' + encodeURIComponent(params.source.toString())
            + '&var1=' + encodeURIComponent(params.var1.toString())
            + '&var2=' + encodeURIComponent(params.var2.toString())
            + '&var3=' + encodeURIComponent(params.var3.toString())
            + '&var4=' + encodeURIComponent(params.var4.toString()), {
            method: method,
            body: JSON.stringify({
                endpoint: subscription.endpoint,
                publicKey: key ? btoa(String.fromCharCode.apply(null, new Uint8Array(key))) : null,
                authToken: token ? btoa(String.fromCharCode.apply(null, new Uint8Array(token))) : null,
                contentEncoding: contentEncoding
            })
        })
            .then(function () {
                params.done();
                return subscription;
            })
            .catch(function () {
                params.done();
            });
    }

    this.run = function () {
        document.addEventListener("DOMContentLoaded", function () {
            navigator.serviceWorker.register(params.serviceWorker, params.serviceWorkerOptions);

            navigator.serviceWorker.ready
                .then(function (serviceWorkerRegistration) {
                    return serviceWorkerRegistration.pushManager.getSubscription();
                })
                .then(function (subscription) {
                    if (!subscription) {
                        return subscribe();
                    } else {
                        return sendSubscriptionToServer(subscription, 'PUT');
                    }
                });
        });
    }
}