var make = require('./api/make'),
    colors = require('colors');

/**
 * Возвращает middleware-функцию, которая запускает точечную сборку файла и возвращает собранный файл.
 *
 * @param {String} root Корень проекта.
 * @returns {Function}
 */
module.exports = function (root) {
    return function (req, res, next) {
        var pathname = req._parsedUrl.pathname,
            target = pathname.replace(/^\/+|\/$/g, ''),
            startTime = new Date();

        return make([target], {
                dir: root,
                cache: true,
                noLog: true
            })
            .then(function () {
                var endTime = new Date();

                log(pathname, startTime, endTime);

                next();
            })
            .fail(function (err) {
                next(err);
            });
    };
};

function log(pathname, startTime, endTime) {
    console.log(
        colors.grey(
            zeros(endTime.getHours(), 2)        + ':' +
            zeros(endTime.getMinutes(), 2)      + ':' +
            zeros(endTime.getSeconds(), 2)      + '.' +
            zeros(endTime.getMilliseconds(), 3) + ' -'
        ),
        '[' + colors.magenta('server') + ']',
        '[' + colors.blue(pathname) + '] - ' +  colors.red((endTime - startTime) + 'ms')
    );
}

function zeros(s, l) {
    s = '' + s;

    while (s.length < l) {
        s = '0' + s;
    }

    return s;
}
