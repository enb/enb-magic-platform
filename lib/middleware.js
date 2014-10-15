var make = require('./api/make');

/**
 * Возвращает middleware-функцию, которая запускает точечную сборку файла и возвращает собранный файл.
 *
 * @param {String} root Корень проекта.
 * @returns {Function}
 */
module.exports = function (root) {
    return function (req, res, next) {
        var pathname = req._parsedUrl.pathname,
            target = pathname.replace(/^\/+|\/$/g, '');

        return make([target], {
                dir: root,
                cache: true,
                hideWarnings: true,
                noLog: true
            })
            .then(function () {
                next();
            })
            .fail(function (err) {
                next(err);
            });
    };
};
