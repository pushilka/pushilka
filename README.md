# Pushilka

## Description
Web-Push notifications client library. In order to get it works you need:
* Have HTTPS set up.
* Configure your web server to serve app.js and serviceWorker.js files from the same domain, where content is served from. If you use CDN for static files like css, js and imaged this two files MUST NOT be served from CDN.
* Condigure your web server to send `Service-Worker-Allowed: /` header for serviceWorker.js file.
* Configure your web server NOT to cache `app.js` and `serviceWorker.js` files.

## Installation

```
npm install pushilka
```

## Usage

```javascript
var pushilka = new Pushilka({
    source: "<source token>",
    serviceWorker: "/node_modules/pushilka/dist/serviceWorker.js"
})
pushilka.run()
```

## Options
* `endpoint` - endpoint where subscription will be sent to. (Default: https://push.wuazu.net/push_subscription.php)
* `serviceWorker` - path to service worker. Not that service worker MUST be served from the same domain (Default: `"/serviceWorker.js"`)
* `serviceWorkerOptions` - service worker options. (Default: `{scope: "/"}`),
* `applicationServerKey` - public key that the push server will use to authenticate your application server.
* `source` - you will obtain this from pushilka's team
* `var1`, `var2`, `var3`, `var4` - custom tracking parameters.
* `done` - callback that will be called when user press Allow or Deny

## Nginx configuration example

```
location ~ /node_modules/pushilka/dist/(serviceWorker|app).js$ {
    add_header 'Service-Worker-Allowed' '/';
    expires -1;
}
```

