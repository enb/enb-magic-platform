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
 * @param {String}  [opts.magicMode=full]       Режим сборки для magic-нод.
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

    var magicMode = opts.magicMode || 'full';

    return makePlatform.init(path.resolve(opts.dir))
        .then(function () {
            var logger = makePlatform.getLogger(),
                promises = [];

            if (opts.noLog) {
                logger.setEnabled(false);
            } else if (opts.hideWarnings) {
                logger.hideWarnings();
            }

            logger.log('build started');

            if (opts.cache) {
                makePlatform.loadCache();
            }

            var factory = makePlatform._projectConfig._modules['enb-magic-factory'],
                metatask = factory.getMetaTaskName(),
                subtasks = factory._taskNames,
                builtTargets = [];

            if (!factory) {
                throw new Error('The `enb-magic-factory` module not found!');
            }

            tasks.forEach(function (task) {
                var name = typeof task === 'string' ? task : task.name,
                    args = task.args || [],
                    promise;

                if (subtasks[name]) {
                    var helper = factory.getHelper(name),
                        channel = helper.getEventChannel(),
                        oldMode = helper.getMode();

                    channel.on('build', function (buildInfo) {
                        builtTargets = builtTargets.concat(buildInfo.builtTargets);
                    });

                    magicMode && helper.setMode(magicMode);
                    promise = makePlatform.buildTask(name, args);

                    promise.always(function () {
                        helper.setMode(oldMode);
                        factory.getEventChannel(name).emit('end');
                    });

                    promises.push(promise);
                }

                if (metatask === name) {
                    var taskNames = factory.getTaskNames(),
                        helpers = factory._helpers,
                        oldModes = {},
                        magic = factory._projectConfig.getTaskConfig(metatask);

                    // Устанавлиаем режим сборки для всех magic-тасков
                    taskNames.forEach(function (name) {
                        var helper = helpers[name];

                        oldModes[name] = helper.getMode();

                        helper.setMode(magicMode);
                    });

                    magic.setMakePlatform(makePlatform);

                    // Запускаем мета-таск.
                    promise = vow.when(magic._chains[0].apply(magic, [magic].concat(args)))
                        .then(function (buildInfo) {
                            // Восстанавливаем режим сборки для всех magic-тасков
                            taskNames.forEach(function (name) {
                                var helper = helpers[name];

                                helper.setMode(oldModes[name]);
                            });

                            builtTargets = buildInfo.builtTargets;
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

                    return {
                        builtTargets: builtTargets
                    };
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
