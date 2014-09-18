var fs = require('fs'),
    inherit = require('inherit'),
    connect = require('connect'),
    serveStatic = require('serve-static'),
    middleware = require('./middleware');

/**
 * Разрабочичий сервер для сборки таргетов.
 * Умеет запускать web-сервер, основанный на `connect`, обрабатывая запросы посредством вызова мета-таска.
 *
 * @name MagicServer
 */
module.exports = inherit(require('enb/lib/server/server'), {
    run: function () {
        var _this = this,
            app = connect(),
            root = this._options.cdir,
            socket;

        app.use(function (req, res, next) {
            if (req.method === 'GET' && req.url === '/') {
                _this._indexPage(req, res);
            } else {
                next();
            }
        });
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
    }
});
