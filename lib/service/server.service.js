/**
 * Server Service
 */
const requestPromise = require('request-promise');

let _customerKey;
let _serverDomain;
let _serverAPIPath;

function init(customerKey, serverDomain, serverAPIPath) {
    _customerKey = customerKey;
    _serverDomain = serverDomain;
    _serverAPIPath = serverAPIPath;
}

function fetch() {
    return requestPromise({
        uri: `${_serverDomain}${_serverAPIPath}`,
        qs: {
            customer_key: _customerKey
        },
        json: true
    });
}

module.exports = {
    init, fetch
}
