const assert = require('assert');
const library = require('../../lib');
const fs = require('fs-extra');
const testConfigurationServer = require('../test_configuration_server');
const spawn = require('child_process').spawn;
const request = require('supertest-as-promised');

let configurationServer;

before("Running configuration server", () => {
    return testConfigurationServer.start().then((server) => {
        configurationServer = server;
    });
});

before("Remove crash file", () => {
    return fs.remove(library.getProperties().crashFile).catch((ex) => { });
});

describe("Library general tests", () => {

    before("Seeding the configuration for tests", () => {
        return request(configurationServer).post('/api/v1/configuration').send({
            conf: {
                key1: "value1",
                key2: "value2",
                key3: "value3"
            }
        });
    });

    it("Should failed when no properties object", (done) => {
        library.init().then(() => {
            return done("api is initialized without properties object");
        }).catch(() => {
            return done();
        });
    });

    it("Should failed when key is invalid", (done) => {
        library.init().then(() => {
            return done("api is initialized without any api key");
        }).catch(() => {
            return done();
        });
    });

    it("Should initialized successfully when api key is supplied", (done) => {
        library.init({ key: "12323454" }).then(() => {
            return done();
        }).catch((ex) => {
            return done(ex);
        });
    });

    it("Should get default value when data is unavailable", (done) => {
        // clearing the cache file in order to get default value
        try {
            fs.unlinkSync(library.getProperties().cacheFile);
        } catch (ex) { }
        library.init({ key: "12323454" });
        assert(library.get("key1", "default value") === "default value", "the default value is incorrect.");
        return done();
    });

    it("Should get updated value when data is loaded", (done) => {
        library.init({ key: "12323454" }).then(() => {
            // Enough time for the cache to be updated
            setTimeout(() => {
                assert(library.get("key1", "default value") === "value1", "the updated value is incorrect.");
                return done();
            }, 500);
        }).catch((ex) => {
            return done(ex);
        });
    });
});

describe("Library on process crash test", () => {

    before("Update the library cache with crashable feature", () => {
        return fs.ensureFile(library.getProperties().cacheFile)
            .then(fs.writeJSON(library.getProperties().cacheFile, {
                conf: {
                    featureThatCauseCrash: true
                }
            }));
    });

    before("Update the configuration server and remove the crashable feature", () => {
        return request(configurationServer).post('/api/v1/configuration').send({
            conf: {
                featureThatCauseCrash: false
            }
        });
    });

    before("Clean crash file", () => {
        return fs.remove(library.getProperties().crashFile).catch((ex) => { });
    });

    it("Should wait for server update if previous process run is crashed", (done) => {
        const appRun1 = spawn('node', ['./spec/test_app.js']);
        appRun1.on('exit', (code) => {
            if (code == 0) {
                return done("process should crash by wrong feature in the first time run");
            }
            const appRun2 = spawn('node', ['./spec/test_app.js']);
            appRun2.on('exit', (code) => {
                if (code === 0) {
                    return done();
                }
                return done("app is still crashing");
            });
        })
    });
});

after("Stop test configuration server", () => {
    return testConfigurationServer.stop();
});