var mime = require('mime'),
    send = require('send'),
    make = require('./api/make'),
    TargetNotFoundError = require('enb/lib/errors/target-not-found-error');

/**
 * Возвращает middleware-функцию, которая запускает точечную сборку файла и возвращает собранный файл.
 *
 * @param {String} root Корень проекта.
 * @returns {Function}
 */
module.exports = function (root) {
    return function (req, res, next) {
        var startTime = new Date(),
            pathname = req._parsedUrl.pathname,
            target = pathname.replace(/^\/+|\/$/g, '');

        return make([target], {
                dir: root,
                cache: true,
                hideWarnings: true,
                noLog: true
            })
            .then(function (filename) {
                try {
                    var mimeType = mime.lookup(filename),
                        mimeCharset = mimeType === 'application/javascript' ?
                        'UTF-8' :
                        mime.charsets.lookup(mimeType, null);

                    res.setHeader('Content-Type', mimeType + (mimeCharset ? '; charset=' + mimeCharset : ''));
                    send(req, filename).pipe(res);
                    console.log('----- ' + pathname + ' ' + (new Date() - startTime) + 'ms');
                } catch (err) {
                    next(err);
                }
            })
            .fail(function (err) {
                if (err instanceof TargetNotFoundError) {
                    next();
                } else {
                    next(err);
                }
            });
    };
};
