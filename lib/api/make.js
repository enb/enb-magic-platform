var path = require('path'),
    colors = require('colors'),
    apply = require('../apply'),
    run = require('../run-tasks'),
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
    var startTime = new Date();

    targets || (targets = []);
    opts || (opts = {});
    opts.dir || (opts.dir = process.cwd());

    var magicMode = opts.magicMode || 'full';

    return apply(function (makePlatform) {
        var logger = makePlatform.getLogger();

        return run([{ name: ENB_MAGIC_TASK, args: targets }], makePlatform, opts)
            .then(function (buildInfo) {
                var builtTargets = buildInfo.builtTargets,
                    toBuild;

                if (magicMode === 'pre') {
                    return buildInfo;
                }

                if (targets.length === 0) {
                    toBuild = Object.keys(makePlatform._projectConfig._nodeConfigs)
                        .filter(function (node) {
                            var has = false;

                            builtTargets.forEach(function (target) {
                                if (path.dirname(target) === node) {
                                    has = true;
                                }
                            });

                            return !has;
                        });
                } else {
                    toBuild = targets.filter(function (requiredTarget) {
                        var has = false;

                        builtTargets.forEach(function (builtTarget) {
                            if (builtTarget.indexOf(requiredTarget) === -1) {
                                has = true;
                            }
                        });

                        return !has;
                    });

                    if (toBuild.length === 0) {
                        return buildInfo;
                    }
                }

                return makePlatform.buildTargets(toBuild)
                    .fail(function (err) {
                        if (err instanceof TargetNotFoundError) {
                            return logger.log('build finished - ' + colors.red((new Date() - startTime) + 'ms'));
                        }

                        console.error(err.stack);
                        process.exit(1);
                    });
            });
    }, opts);
};
