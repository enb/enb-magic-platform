var path = require('path'),
    fs = require('fs'),
    chalk = require('chalk'),
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
 * @param {String} root                 Корень проекта.
 * @param {Object} [opts]
 * @param {Number} [opts.port=8080]     Номер порта.
 * @param {String} [opts.host=0.0.0.0]  Имя хоста.
 * @param {String} [opts.socket]        Путь к сокету.
 * @param {String} [opts.magicMode=pre] Режим сборки для magic-нод.
 * @name MagicServer
 * @constructor
 */
function Server(root, opts) {
    opts || (opts = {});

    this._root = root;
    this._port = opts.port || 8080;
    this._host = opts.host || '0.0.0.0';
    this._socket = opts.socket;
    this._magicMode = opts.magicMode || 'pre';
}

Server.prototype.run = function () {
    var root = this._root,
        app;

    app = connect()
        .use(favicon(faviconFilename))
        .use(enb(root, {
            magicMode: this._magicMode
        }))
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
        message = 'Magic server started at ' + chalk.underline('http://' + this._host + ':' + this._port);

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
