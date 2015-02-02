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
 * @param {String} [opts.magicMode]     Режим сборки для magic-нод.
 *                                      По умолчанию сборка будет происходить в `pre` режиме.
 * @returns {Promise}
 */
module.exports = function (opts) {
    opts || (opts = {});
    opts.dir || (opts.dir = process.cwd());

    var server = new Server(opts.dir, opts);

    return vow.when(server.run());
};
