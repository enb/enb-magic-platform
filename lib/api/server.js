var vow = require('vow'),
    Server = require('../server');

/**
 * Запускает разрабочичий сервер.
 *
 * @param {Object} [opts]
 * @param {String} [opts.dir]           Корень проекта.
 * @param {Number} [opts.port=8080]     Номер порта.
 * @param {String} [opts.host=0.0.0.0]  Имя хоста.
 * @param {String} [opts.socket]        Путь к сокету.
 * @returns {Promise}
 */
module.exports = function (opts) {
    var server = new Server();

    opts || (opts = {});
    opts.dir || (opts.dir = process.cwd());
    opts.port || (opts.port = 8080);
    opts.host || (opts.host = '0.0.0.0');

    return vow.when(server.init(opts.dir, opts))
        .then(function () {
            return vow.when(server.run());
        })
        .fail(function (err) {
            console.error(err.stack);
            process.exit(1);
        });
};
