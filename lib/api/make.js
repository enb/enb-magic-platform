var path = require('path'),
    colors = require('colors'),
    run = require('./run'),
    MakePlatform = require('enb/lib/make'),
    TargetNotFoundError = require('enb/lib/errors/target-not-found-error'),
    ENB_MAGIC_TASK = process.env.ENB_MAGIC_TASK || '__magic__';

/**
 * Запускает сборку указанных целей посредством вызова мета-таска, в котором будут происходить вызовы всех тасков,
 * так или иначе связанных со сборкой magic-нод.
 *
 * @param {String[]} [targets]                 Список целей на файловой системе, которые нужно собрать.
 * @param {Object}   [opts]
 * @param {String}   [opts.dir]                Корень проекта.
 * @param {String}   [opts.magicMode=full]     Режим сборки для magic-нод.
 * @param {Boolean}  [opts.noCache=false]      Не учитывать кэш при запуске таска.
 * @param {Boolean}  [opts.noLog=false]        Не выводить сообщения в консоль в процессе выполнения таска.
 * @param {Boolean}  [opts.hideWarnings=false] Не выводить warning-сообщения в консоль в процессе выполнения таска.
 * @param {Boolean}  [opts.graph=false]        Выводить граф сборки.
 * @returns {Promise}
 */
module.exports = function (targets, opts) {
    var startTime = new Date(),
        makePlatform = new MakePlatform();

    targets || (targets = []);
    opts || (opts = {});
    opts.dir || (opts.dir = process.cwd());

    return run(ENB_MAGIC_TASK, targets, opts)
        .then(function (buildInfo) {
            var builtTargets = buildInfo.builtTargets,
                toBuild = targets.filter(function (target) {
                    return builtTargets.indexOf(target) === -1;
                });

            if (targets.length !== 0 && toBuild.length === 0) {
                return buildInfo;
            }

            return makePlatform.init(path.resolve(opts.dir))
                .then(function () {
                    var logger = makePlatform.getLogger();

                    if (opts.noLog) {
                        logger.setEnabled(false);
                    } else if (opts.hideWarnings) {
                        logger.hideWarnings();
                    }

                    logger.log('build started');

                    if (opts.cache) {
                        makePlatform.loadCache();
                    }

                    return makePlatform.buildTargets(toBuild)
                        .then(function () {
                            if (opts.graph) {
                                console.log(makePlatform.getBuildGraph().render());
                            }

                            logger.log('build finished - ' + colors.red((new Date() - startTime) + 'ms'));

                            makePlatform.saveCache();
                            makePlatform.destruct();
                        })
                        .fail(function (err) {
                            if (opts.graph) {
                                console.log(makePlatform.getBuildGraph().render());
                            }

                            if (err instanceof TargetNotFoundError) {
                                return logger.log('build finished - ' + colors.red((new Date() - startTime) + 'ms'));
                            }

                            console.error(err.stack);
                            process.exit(1);
                        });
                })
                .fail(function (err) {
                    console.error(err.stack);
                    process.exit(1);
                });
        });
};
