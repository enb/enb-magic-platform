var path = require('path'),
    vow = require('vow'),
    colors = require('colors'),
    MakePlatform = require('enb/lib/make');

/**
 * Запускает таски.
 *
 * @param {String}  tasks  Список тасков.
 * @param {Array}   [args] Аргументы для таска, если первый аргумент это название таска.
 * @param {Object}  [opts]
 * @param {String}  [opts.dir]                  Корень проекта.
 * @param {Boolean} [opts.noCache=false]        Не учитывать кэш при запуске таска.
 * @param {Boolean} [opts.noLog=false]          Не выводить сообщения в консоль в процессе выполнения таска.
 * @param {Boolean} [opts.hideWarnings=false]   Не выводить warning-сообщения в консоль в процессе выполнения таска.
 * @param {Boolean} [opts.graph=false]          Выводить граф сборки.
 * @returns {Promise}
 */
module.exports = function (tasks, args, opts) {
    var startTime = new Date(),
        makePlatform = new MakePlatform();

    if (typeof tasks === 'string') {
        tasks = [{ name: tasks, args: args }];
    } else {
        opts = args;
    }

    opts || (opts = {});
    opts.dir || (opts.dir = process.cwd());

    return makePlatform.init(path.resolve(opts.dir))
        .then(function () {
            var logger = makePlatform.getLogger(),
                promises = [];

            if (opts.noLog) {
                logger.setEnabled(false);
            } else if (opts.hideWarnings) {
                logger.hideWarnings();
            }

            if (opts.cache) {
                makePlatform.loadCache();
            }

            var factory = makePlatform._projectConfig._modules['enb-magic-factory'],
                metatask = factory.getMetaTaskName(),
                subtasks = factory._taskNames;

            if (!factory) {
                throw new Error('The `enb-magic-factory` module not found!');
            }

            tasks.forEach(function (task) {
                var name = typeof task === 'string' ? task : task.name,
                    args = task.args || [];

                if (metatask === name || subtasks[name]) {
                    var promise = makePlatform.buildTask(name, args);

                    name !== metatask && promise.always(function () {
                        factory.getEventChannel(name).emit('end');
                    });

                    promises.push(promise);
                }
            });

            return vow.all(promises)
                .then(function () {
                    if (opts.graph) {
                        console.log(makePlatform.getBuildGraph().render());
                    }

                    logger.log('build finished - ' + colors.red((new Date() - startTime) + 'ms'));

                    makePlatform.saveCache();
                    makePlatform.destruct();
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
