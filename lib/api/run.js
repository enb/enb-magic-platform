var path = require('path'),
    colors = require('colors'),
    MakePlatform = require('enb/lib/make'),
    makePlatform = new MakePlatform();

/**
 * Запускает таск.
 *
 * @param {String}  task   Название таска.
 * @param {Array}   [args] Аргументы для таска.
 * @param {Object}  [opts]
 * @param {String}  [opts.dir]                  Корень проекта.
 * @param {Boolean} [opts.noCache=false]        Не учитывать кэш при запуске таска.
 * @param {Boolean} [opts.noLog=false]          Не выводить сообщения в консоль в процессе выполнения таска.
 * @param {Boolean} [opts.hideWarnings=false]   Не выводить warning-сообщения в консоль в процессе выполнения таска.
 * @param {Boolean} [opts.graph=false]          Выводить граф сборки.
 * @returns {Promise}
 */
module.exports = function (task, args, opts) {
    var startTime = new Date();

    opts || (opts = {});
    opts.dir || (opts.dir = process.cwd());

    return makePlatform.init(path.resolve(opts.dir))
        .then(function () {
            var logger = makePlatform.getLogger();

            if (opts.noLog) {
                logger.setEnabled(false);
            } else if (opts.hideWarnings) {
                logger.hideWarnings();
            }

            if (opts.cache) {
                makePlatform.loadCache();
            }

            return makePlatform.buildTask(task, args)
                .then(function () {
                    if (opts.graph) {
                        console.log(makePlatform.getBuildGraph().render());
                    }

                    logger.log('build finished - ' + colors.red((new Date() - startTime) + 'ms'));

                    makePlatform.saveCache();
                    makePlatform.destruct();

                    return args;
                });
        })
        .fail(function (err) {
            if (opts.graph) {
                console.log(makePlatform.getBuildGraph().render());
            }

            console.error(err.stack);
            process.exit(1);
        });
};
