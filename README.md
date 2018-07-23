# Pushilka

## Description
Web-Push notifications client library. In order to get it works you need:
* Have HTTPS set up.
* Configure your web server to serve `app.js` and `serviceWorker.js` files from the same domain, where content is served from. If you use CDN for static files like css, js and imaged this two files MUST NOT be served from CDN.
* Configure your web server to send `Service-Worker-Allowed: /` header for `serviceWorker.js` file.
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

## CloudFront configuration

1. Deploy [pushilka-cloudfront-headers](https://serverlessrepo.aws.amazon.com/applications/arn:aws:serverlessrepo:us-east-1:237798369076:applications~pushilka-cloudfront-headers) application. During deployment you will be asked for application name, choose any you want. For example "pushilka".
2. Go to the Servies -> IAM -> Roles and find recently created role for your function. If begins with aws-serverless-repository-pushilka-*.
Open Role and under `Trust relationships` change the line:
```
"Service": "lambda.amazonaws.com"
```
with the following:
```
"Service": [
    "lambda.amazonaws.com",
    "edgelambda.amazonaws.com"
]
```
2. Find and open created function (Services -> Lambda -> Functions). Open it and publish new version of function. Choose `Publish new version` under `Actions` menu. 
3. In the new version find CloufFront in Designer block and then enter CloudFront distribution which serves your js files
and choose Origin Response event. Also selected "Enable trigger and replicate". Then press Add and Save function.
4. Go to the Services -> CloudFront and wait until your distribution change state to Deployed. Then check, that headers
are sent correctly. 