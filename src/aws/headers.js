'use strict';
exports.handler = (event, context, callback) => {
    const path = require('path');
    const cf = event.Records[0].cf;
    const request = cf.request;
    const response = cf.response;
    const headers = response.headers;

    if (path.basename(request.uri) === "serviceWorker.js") {
        headers['cache-control'] = [{
            key: 'Cache-Control',
            value: "no-cache, no-store, must-revalidate"
        }];

        headers['expires'] = [{
            key: 'Expires',
            value: "0"
        }];

        headers['service-worker-allowed'] = [{
            key: 'Service-Worker-Allowed',
            value: "/"
        }];
    }

    callback(null, response);
};