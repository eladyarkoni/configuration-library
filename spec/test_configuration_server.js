const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const app = express();

let server;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());

let _configuration = {};

app.get('/api/v1/configuration', (req, res) => {
    return res.json(_configuration);
});

app.post('/api/v1/configuration', (req, res) => {
    _configuration = req.body;
    return res.json({ message: "configuration is updated" });
});

module.exports = {

    start() {
        return new Promise((resolve, reject) => {
            server = app.listen(8080, (err) => {
                if (err) {
                    return reject();
                }
                resolve(app);
            });
        });
    },

    stop() {
        if (server) {
            server.close();
        }
    }
}