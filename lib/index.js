const cacheService = require('./service/cache.service');
const serverService = require('./service/server.service');
const winston = require('winston');
const fs = require('fs-extra');
const util = require('util')
const logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({ colorize: true, timestamp: true })
    ]
});

let _defaultProperties = {
    key: null,
    crashFile: "/tmp/config-api-crash-file.json",
    cacheFile: "/tmp/config-api-cache.json",
    server: {
        domain: "http://localhost:8080",
        apiPath: "/api/v1/configuration"
    }
}

function init(props) {
    cacheService.clearMemory();
    process.on('uncaughtException', onUncaughtException);
    return Promise.resolve().then(() => {
        _defaultProperties = Object.assign(_defaultProperties, props);
        if (!_defaultProperties.key) {
            throw "library should get a customer key propery"
        }
        return null;
    })
        .then(() => { return cacheService.init(_defaultProperties.cacheFile); })
        .then(() => { return serverService.init(_defaultProperties.key, _defaultProperties.server.domain, _defaultProperties.server.apiPath); })
        .then(() => { return fs.pathExists(_defaultProperties.crashFile) })
        .then((crashFileExists) => {
            if (crashFileExists) {
                // end the initialization after the cache is updated
                return fs.remove(_defaultProperties.crashFile).then(updateCache);
            } else {
                // end the initialization, retrieve the server state async after.
                updateCache();
                return null;
            }
        });
}

function onUncaughtException(err) {
    logger.info("library detects an application crash.");
    try {
        fs.ensureFileSync(_defaultProperties.crashFile);
    } catch (ex) { }
    fs.writeJsonSync(_defaultProperties.crashFile, { timestamp: Date.now(), exception: util.inspect(err, { depth: null }) });
    throw err;
}

function updateCache() {
    return serverService.fetch().then((data) => {
        return cacheService.save(data);
    });
}

function get(key, defaultValue) {
    return cacheService.get(key) || defaultValue;
}

function getProperties() {
    return _defaultProperties;
}

module.exports = {
    init, get, getProperties
}