var fs = require('fs'),
    connect = require('connect'),
    serveStatic = require('serve-static'),
    middleware = require('./middleware');

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
    var _this = this,
        app = connect(),
        root = this._root,
        socket;

    app.use(middleware(root));
    app.use(serveStatic(root));

    process.on('uncaughtException', function (err) {
        console.log(err.stack);
    });

    function serverStarted() {
        console.log('Server started at ' + socket);
    }

    if (_this._socket) {
        try {
            fs.unlinkSync(_this._socket);
        } catch (e) {}
        socket = _this._socket;
        app.listen(_this._socket, function () {
            fs.chmod(_this._socket, '0777');
            serverStarted();
        });
    } else {
        socket = _this._host + ':' + _this._port;
        app.listen(_this._port, _this._host, serverStarted);
    }
};

module.exports = Server;
