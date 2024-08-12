export default class Pushilka {
    sessionId = null;
    visitorId = null;
    params = null;

    constructor(options) {
        this.sessionId = this.genRandomString();
        this.params = {
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
            var5: "",
            var6: "",
            var7: "",
            var8: "",
            var9: "",
            var10: "",
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
                    + '<div class="pushilka-buttons"><a href="" id="pushilka-agree-button" class="pushilka-agree-button">{ALLOW_TEXT}</a>'
                    + '<a href="" id="pushilka-cancel-button" class="pushilka-cancel-button">{CANCEL_TEXT}</a></div></div>'
            },
            done: function () {
            },
            success: function () {
            },
            decline: function () {
            }
        };

        for (let i in options) {
            if (options.hasOwnProperty(i) && i === 'dialog') {
                for (let j in options[i]) {
                    if (options[i].hasOwnProperty(j) && this.params[i].hasOwnProperty(j)) {
                        this.params[i][j] = options[i][j];
                    }
                }
            } else if (options.hasOwnProperty(i) && this.params.hasOwnProperty(i)) {
                this.params[i] = options[i];
            }
        }
    }

    urlBase64ToUint8Array(base64String) {
        let padding = '='.repeat((4 - base64String.length % 4) % 4);
        let base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        let rawData = window.atob(base64);
        let outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    sendEvent(event) {
        fetch(this.params.eventEndpoint, {
            method: 'POST',
            body: JSON.stringify({
                event: event,
                source: this.params.source,
                visitorId: this.getVisitorId(),
                sessionId: this.sessionId,
                var1: this.params.var1,
                var2: this.params.var2,
                var3: this.params.var3,
                var4: this.params.var4,
                var5: this.params.var5,
                var6: this.params.var6,
                var7: this.params.var7,
                var8: this.params.var8,
                var9: this.params.var9,
                var10: this.params.var10,
            })
        }).catch();
    }

    setCookie(name, value, expires) {
        let date = new Date;
        date.setTime(date.getTime() + 60 * expires * 1000);
        expires = "; expires=" + date.toUTCString();
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    getCookie(name) {
        let parts = document.cookie.split(";"),
            prefix = name + "=";
        for (let i in parts) {
            let part = parts[i].trimStart();
            if (part.indexOf(prefix) === 0) {
                return part.substring(prefix.length);
            }
        }

        return null;
    }

    showDialog() {
        let self = this;

        if (this.getCookie("pushilka-dialog") !== null) {
            this.sendEvent("push_blocked");
            return;
        }

        this.sendEvent("push_invoked");

        let dialog = this.params.dialog;

        let s = document.createElement('link');
        s.rel = "stylesheet";
        s.href = dialog.style;
        document.body.appendChild(s);

        let d = document.createElement('div');
        d.innerHTML = dialog.template
            .replace('{ICON_URL}', dialog.icon)
            .replace('{MESSAGE}', dialog.message)
            .replace('{ALLOW_TEXT}', dialog.allowText)
            .replace('{CANCEL_TEXT}', dialog.cancelText);
        document.body.appendChild(d);

        let els = {
            agreeButton: document.getElementById("pushilka-agree-button"),
            cancelButton: document.getElementById("pushilka-cancel-button"),
            dialog: document.getElementById("pushilka-dialog")
        };

        els.agreeButton.addEventListener("click", function (e) {
            e.preventDefault();

            els.dialog.remove();
            self.subscribe();
        });
        els.cancelButton.addEventListener("click", function (e) {
            e.preventDefault();

            self.sendEvent("push_blocked");
            self.setCookie("pushilka-dialog", "1", self.params.dialog.ttl);
            els.dialog.remove();
        });
    }

    subscribe() {
        let self = this;
        navigator.serviceWorker.ready
            .then(function (serviceWorkerRegistration) {
                self.sendEvent("sys_push_invoked");
                return serviceWorkerRegistration.pushManager
                    .subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: self.urlBase64ToUint8Array(self.params.applicationServerKey)
                    });
            })
            .then(function (subscription) {
                return self.sendSubscriptionToServer(subscription, 'POST');
            })
            .catch(function () {
                self.sendEvent("sys_push_blocked");
                self.params.decline();
                self.params.done();
            });
    }

    genRandomString() {
        let s = [];
        for (let i = 0; i < 2; i++) {
            s.push(Math.floor(Math.random() * 0xFFFFFFFF).toString(36));
        }
        return s.join("-");
    }

    getVisitorId() {
        let st = window.localStorage;
        this.visitorId = this.visitorId || st.getItem("visitorId") || this.getCookie(this.params.visitorCookie) || this.genRandomString();
        st.setItem("visitorId", this.visitorId);
        this.setCookie(this.params.visitorCookie, this.visitorId, 365);

        return this.visitorId;
    }

    getTimezone() {
        let timezone = "";
        try {
            timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        } catch (error) {
            console.error(error);
        }

        return timezone;
    }

    getEndpoint(endpoint) {
        return endpoint + '?'
            + 'vid=' + encodeURIComponent(this.getVisitorId())
            + '&sid=' + encodeURIComponent(this.sessionId)
            + '&s=' + encodeURIComponent(this.params.source.toString())
            + '&var1=' + encodeURIComponent(this.params.var1.toString())
            + '&var2=' + encodeURIComponent(this.params.var2.toString())
            + '&var3=' + encodeURIComponent(this.params.var3.toString())
            + '&var4=' + encodeURIComponent(this.params.var4.toString())
            + '&var5=' + encodeURIComponent(this.params.var5.toString())
            + '&var6=' + encodeURIComponent(this.params.var6.toString())
            + '&var7=' + encodeURIComponent(this.params.var7.toString())
            + '&var8=' + encodeURIComponent(this.params.var8.toString())
            + '&var9=' + encodeURIComponent(this.params.var9.toString())
            + '&var10=' + encodeURIComponent(this.params.var10.toString())
            + '&timezone=' + encodeURIComponent(this.getTimezone());
    }

    sendSubscriptionToServer(subscription, method) {
        let self = this;
        let key = subscription.getKey('p256dh');
        let token = subscription.getKey('auth');
        let contentEncoding = (PushManager.supportedContentEncodings || ['aesgcm'])[0];

        return fetch(self.getEndpoint(self.params.endpoint), {
            method: method,
            body: JSON.stringify({
                endpoint: subscription.endpoint,
                publicKey: key ? btoa(String.fromCharCode.apply(null, new Uint8Array(key))) : null,
                authToken: token ? btoa(String.fromCharCode.apply(null, new Uint8Array(token))) : null,
                contentEncoding: contentEncoding
            })
        })
            .then(function () {
                self.params.success();
                self.params.done();
                return subscription;
            })
            .catch(function () {
                self.params.success();
                self.params.done();
            });
    }

    ready(callback) {
        if (document.readyState === 'interactive' || document.readyState === 'complete') {
            callback();
        } else {
            document.addEventListener("DOMContentLoaded", callback);
        }
    }

    run() {
        let self = this;
        self.ready(function () {
            if (!("showNotification" in ServiceWorkerRegistration.prototype)) {
                console.debug("Push messaging is not supported.");
                self.sendEvent("push_not_supported");
                self.params.decline();
                self.params.done();
                return;
            }

            if (Notification.permission === "denied") {
                console.debug("User has blocked notifications.");
                self.sendEvent("sys_push_blocked");
                self.params.decline();
                self.params.done();
                return;
            }

            navigator.serviceWorker.register(self.params.serviceWorker, self.params.serviceWorkerOptions)
                .then(function () {
                    navigator.serviceWorker.ready
                        .then(function (serviceWorkerRegistration) {
                            return serviceWorkerRegistration.pushManager.getSubscription();
                        })
                        .then(function (subscription) {
                            if (!subscription) {
                                return self.params.useDialog ? self.showDialog() : self.subscribe();
                            } else {
                                return self.sendSubscriptionToServer(subscription, 'PUT');
                            }
                        });
                })
                .catch(function () {
                    self.sendEvent("sys_push_subscribe_error");
                    self.params.decline();
                    self.params.done();
                });
        });
    }
}