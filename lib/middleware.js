var make = require('./api/make'),
    chalk = require('chalk');

/**
 * Возвращает middleware-функцию, которая запускает точечную сборку файла и возвращает собранный файл.
 *
 * @param {String} root Корень проекта.
 * @param {Object} [opts]
 * @param {String} [opts.magicMode=full] Режим сборки для magic-нод.
 * @returns {Function}
 */
module.exports = function (root, opts) {
    return function (req, res, next) {
        var startTime = new Date(),
            pathname = req._parsedUrl.pathname,
            target = pathname.replace(/^\/+|\/$/g, ''),
            targets = pathname === '/' ? [] : [target];

        opts || (opts = {});

        return make(targets, {
                dir: root,
                cache: true,
                noLog: true,
                magicMode: opts.magicMode || 'full'
            })
            .then(function () {
                var endTime = new Date();

                logAction(pathname, startTime, endTime);

                next();
            })
            .fail(function (err) {
                var endTime = new Date();

                logError(pathname, startTime, endTime);

                next(err);
            });
    };
};

function log(pathname, message, startTime, endTime) {
    console.log(
        chalk.grey(
            zeros(endTime.getHours(), 2)        + ':' +
            zeros(endTime.getMinutes(), 2)      + ':' +
            zeros(endTime.getSeconds(), 2)      + '.' +
            zeros(endTime.getMilliseconds(), 3) + ' -'
        ),
        '[' + message + ']',
        '[' + chalk.blue(pathname) + '] - ' +  chalk.red((endTime - startTime) + 'ms')
    );
}

function logAction(pathname, startTime, endTime) {
    log(pathname, chalk.magenta('server'), startTime, endTime);
}

function logError(pathname, startTime, endTime) {
    log(pathname, chalk.red('error'), startTime, endTime);
}

function zeros(s, l) {
    s = '' + s;

    while (s.length < l) {
        s = '0' + s;
    }

    return s;
}
