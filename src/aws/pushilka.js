'use strict';
exports.handler = (event, context, callback) => {
    const path = require('path');
    const cf = event.Records[0].cf;
    const request = cf.request;
    const response = cf.response;
    const pushilka = response.headers;

    if (path.basename(request.uri) === "serviceWorker.js") {
        pushilka['cache-control'] = [{
            key: 'Cache-Control',
            value: "no-cache, no-store, must-revalidate"
        }];

        pushilka['expires'] = [{
            key: 'Expires',
            value: "0"
        }];

        pushilka['service-worker-allowed'] = [{
            key: 'Service-Worker-Allowed',
            value: "/"
        }];
    }

    callback(null, response);
};