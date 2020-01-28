function Pushilka(options) {
    var sessionId = genVisitorId();
    var params = {
        endpoint: "https://push.wuazu.net/push_subscription.php",
        eventEndpoint: "https://push.wuazu.net/event",
        serviceWorker: "/serviceWorker.js",
        serviceWorkerOptions: {scope: "/"},
        applicationServerKey: "BCmIwkLHxJNPccoVf2UXDjd7kDuiyJpKsSOqSHCtGBMfBkjfHLCq4-d8eNtabNlCNKFF8CZIzeDwOo3OvNCQAns",
        source: "",
        var1: "",
        var2: "",
        var3: "",
        var4: "",

        done: function () {
        },
        success: function () {
        },
        decline: function () {
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

    function sendEvent(event) {
        fetch(params.eventEndpoint, {
            method: 'POST',
            body: JSON.stringify({
                event: event,
                source: params.source,
                visitorId: getVisitorId(),
                sessionId: sessionId,
                var1: params.var1,
                var2: params.var2,
                var3: params.var3,
                var4: params.var4,
            })
        }).catch();
    }

    function subscribe() {
        navigator.serviceWorker.ready
            .then(function (serviceWorkerRegistration) {
                sendEvent("sys_push_invoked");
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
                sendEvent("sys_push_blocked");
                params.decline();
            });
    }

    function genVisitorId() {
        var s = [];
        for (var i = 0; i < 2; i++) {
            s.push(Math.floor(Math.random() * 0xFFFFFFFF).toString(36));
        }
        return s.join("-");
    }

    function getVisitorId() {
        var st = window.localStorage;
        var visitorId = st.getItem("visitorId") || genVisitorId();
        st.setItem("visitorId", visitorId);
        return visitorId;
    }

    function getEndpoint(endpoint) {
        return endpoint + '?'
            + 'vid=' + encodeURIComponent(getVisitorId())
            + '&sid=' + encodeURIComponent(sessionId)
            + '&s=' + encodeURIComponent(params.source.toString())
            + '&var1=' + encodeURIComponent(params.var1.toString())
            + '&var2=' + encodeURIComponent(params.var2.toString())
            + '&var3=' + encodeURIComponent(params.var3.toString())
            + '&var4=' + encodeURIComponent(params.var4.toString());
    }

    function sendSubscriptionToServer(subscription, method) {
        var key = subscription.getKey('p256dh');
        var token = subscription.getKey('auth');
        var contentEncoding = (PushManager.supportedContentEncodings || ['aesgcm'])[0];

        return fetch(getEndpoint(params.endpoint), {
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
                params.success();
                return subscription;
            })
            .catch(function () {
                params.done();
                params.success();
            });
    }

    this.ready = function (callback) {
        if (document.readyState === 'interactive' || document.readyState === 'complete') {
            callback();
        } else {
            document.addEventListener("DOMContentLoaded", callback);
        }
    };

    this.run = function () {
        this.ready(function () {
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