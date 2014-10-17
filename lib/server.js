var path = require('path'),
    fs = require('fs'),
    connect = require('connect'),
    favicon = require('serve-favicon'),
    serveStatic = require('serve-static'),
    serveIndex = require('serve-index'),
    enb = require('./middleware'),
    faviconFilename = path.join(__dirname, '..', 'favicon.ico');

/**
 * Разрабочичий сервер для сборки таргетов.
 * Умеет запускать web-сервер, основанный на `connect`, обрабатывая запросы посредством вызова мета-таска.
 *
 * @name MagicServer
 */
function Server(root, options) {
    this._root = root;
    this._port = options.port;
    this._host = options.host;
    this._socket = options.socket;
}

Server.prototype.run = function () {
    var root = this._root,
        app;

    app = connect()
        .use(favicon(faviconFilename))
        .use(enb(root))
        .use(serveStatic(root, {
            redirect: false
        }))
        .use(serveIndex(root, {
            icons: true
        }));

    this._listen(app);

    process.on('uncaughtException', function (err) {
        console.error(err.stack);
    });
};

Server.prototype._listen = function (app) {
    var socket = this._socket,
        message = 'Server started at ' + this._host + ':' + this._port;

    if (socket) {
        try {
            fs.unlinkSync(socket);
        } catch (e) {}

        app.listen(socket, function () {
            fs.chmod(socket, '0777');
            console.log(message);
        });
    } else {
        app.listen(this._port, this._host, function () {
            console.log(message);
        });
    }
};

module.exports = Server;
