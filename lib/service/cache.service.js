/**
 * Cache Service
 */
const fs = require('fs-extra');

let _cacheFilePath;
let _data;
let _updateTime = 0;

function init(cacheFilePath) {
    _data = null;
    _cacheFilePath = cacheFilePath;
    return fs.ensureFile(_cacheFilePath).then(fetch);
}

function save(data) {
    _updateTime = Date.now();
    _data = data;
    return fs.writeJson(_cacheFilePath, _data);
}

function fetch() {
    return fs.readJson(_cacheFilePath).then((data) => {
        _data = data;
    }).catch(() => { });
}

function getAll() {
    return _data;
}

function get(key) {
    return !!_data && !!_data.conf ? _data.conf[key] : null;
}

function clearMemory() {
    _data = null;
}

function getUpdateTime() {
    return _updateTime;
}

module.exports = {
    init, save, fetch, getAll, get, clearMemory, getUpdateTime
}
