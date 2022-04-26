function Pushilka(options) {
    var sessionId = genRandomString(),
        visitorId;

    var params = {
        endpoint: "https://swarmpush.com/push_subscription.php",
        eventEndpoint: "https://swarmpush.com/event",
        serviceWorker: "/serviceWorker.js",
        serviceWorkerOptions: {scope: "/"},
        applicationServerKey: "BCmIwkLHxJNPccoVf2UXDjd7kDuiyJpKsSOqSHCtGBMfBkjfHLCq4-d8eNtabNlCNKFF8CZIzeDwOo3OvNCQAns",
        source: "",
        var1: "",
        var2: "",
        var3: "",
        var4: "",
        useDialog: false,
        visitorCookie: 'pushilka_vid',
        dialog: {
            ttl: 30,
            message: "We'd like to send you notifications for the latest news and updates.",
            allowText: "Allow",
            cancelText: "No thanks",
            icon: 'https://swarmpush.com/s/pushilka/bell.webp',
            style: 'https://swarmpush.com/s/pushilka/app.css',
            template: '<div id="pushilka-dialog" class="pushilka-dialog"><div class="pushilka-icon">'
                + '<img width="80" src="{ICON_URL}" alt=""></div><div class="pushilka-message">{MESSAGE}</div>'
                + '<div class="pushilka-buttons"><a id="pushilka-agree-button" class="pushilka-agree-button">{ALLOW_TEXT}</a>'
                + '<a id="pushilka-cancel-button" class="pushilka-cancel-button">{CANCEL_TEXT}</a></div></div>'
        },
        done: function () {
        },
        success: function () {
        },
        decline: function () {
        }
    };

    for (var i in options) {
        if (options.hasOwnProperty(i) && i === 'dialog') {
            for (var j in options[i]) {
                if (options[i].hasOwnProperty(j) && params[i].hasOwnProperty(j)) {
                    params[i][j] = options[i][j];
                }
            }
        } else if (options.hasOwnProperty(i) && params.hasOwnProperty(i)) {
            params[i] = options[i];
        }
    }

    function urlBase64ToUint8Array(base64String) {
        var padding = '='.repeat((4 - base64String.length % 4) % 4);
        var base64 = (base64String + padding)
            .replace(/-/g, '+')
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
                var4: params.var4
            })
        }).catch();
    }

    function setCookie(name, value, expires) {
        var date = new Date;
        date.setTime(date.getTime() + 60 * expires * 1000);
        expires = "; expires=" + date.toUTCString();
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    function getCookie(name) {
        var parts = document.cookie.split(";"),
            prefix = name + "=";
        for (var i in parts) {
            var part = parts[i].trimLeft();
            if (part.indexOf(prefix) === 0) {
                return part.substring(prefix.length);
            }
        }

        return null;
    }

    function showDialog() {
        if (getCookie("pushilka-dialog") !== null) {
            sendEvent("push_blocked");
            return;
        }

        sendEvent("push_invoked");

        var dialog = params.dialog;

        var s = document.createElement('link');
        s.rel = "stylesheet";
        s.href = dialog.style;
        document.body.appendChild(s);

        var d = document.createElement('div');
        d.innerHTML = dialog.template
            .replace('{ICON_URL}', dialog.icon)
            .replace('{MESSAGE}', dialog.message)
            .replace('{ALLOW_TEXT}', dialog.allowText)
            .replace('{CANCEL_TEXT}', dialog.cancelText);
        document.body.appendChild(d);

        var els = {
            agreeButton: document.getElementById("pushilka-agree-button"),
            cancelButton: document.getElementById("pushilka-cancel-button"),
            dialog: document.getElementById("pushilka-dialog")
        };

        els.agreeButton.addEventListener("click", function (e) {
            e.preventDefault();

            els.dialog.remove();
            subscribe();
        });
        els.cancelButton.addEventListener("click", function (e) {
            e.preventDefault();

            sendEvent("push_blocked");
            setCookie("pushilka-dialog", "1", params.dialog.ttl);
            els.dialog.remove();
        });
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
                params.done();
            });
    }

    function genRandomString() {
        var s = [];
        for (var i = 0; i < 2; i++) {
            s.push(Math.floor(Math.random() * 0xFFFFFFFF).toString(36));
        }
        return s.join("-");
    }

    function getVisitorId() {
        var st = window.localStorage;
        visitorId = visitorId || st.getItem("visitorId") || getCookie(params.visitorCookie) || genRandomString();
        st.setItem("visitorId", visitorId);
        setCookie(params.visitorCookie, visitorId, 365);

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
                params.success();
                params.done();
                return subscription;
            })
            .catch(function () {
                params.success();
                params.done();
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
            if ("showNotification" in ServiceWorkerRegistration.prototype === false) {
                console.debug("Push messaging is not supported.");
                sendEvent("push_not_supported");
                params.decline();
                params.done();
                return;
            }

            if (Notification.permission === "denied") {
                console.debug("User has blocked notifications.");
                sendEvent("sys_push_blocked");
                params.decline();
                params.done();
                return;
            }

            navigator.serviceWorker.register(params.serviceWorker, params.serviceWorkerOptions)
                .then(function () {
                    navigator.serviceWorker.ready
                        .then(function (serviceWorkerRegistration) {
                            return serviceWorkerRegistration.pushManager.getSubscription();
                        })
                        .then(function (subscription) {
                            if (!subscription) {
                                return params.useDialog ? showDialog() : subscribe();
                            } else {
                                return sendSubscriptionToServer(subscription, 'PUT');
                            }
                        });
                })
                .catch(function () {
                    sendEvent("sys_push_subscribe_error");
                    params.decline();
                    params.done();
                });
        });
    }
}
