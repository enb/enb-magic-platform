var path = require('path'),
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
    targets || (targets = []);
    opts || (opts = {});
    opts.dir || (opts.dir = process.cwd());

    var magicMode = opts.magicMode || 'full';

    return apply(function (makePlatform) {
        return run([{ name: ENB_MAGIC_TASK, args: targets }], makePlatform, opts)
            .then(function (buildInfo) {
                var builtTargets = buildInfo.builtTargets,
                    toBuild = [];

                if (targets.length === 0) {
                    if (magicMode === 'full') {
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
                    }
                } else {
                    toBuild = targets.filter(function (requiredTarget) {
                        var has = false;

                        builtTargets.forEach(function (builtTarget) {
                            if (builtTarget.indexOf(requiredTarget) !== -1) {
                                has = true;
                            }
                        });

                        return !has;
                    });

                    if (toBuild.length === 0) {
                        return buildInfo;
                    }
                }

                if (magicMode === 'pre' && toBuild.length !== 1) {
                    return buildInfo;
                }

                return makePlatform.buildTargets(toBuild)
                    .fail(function (err) {
                        if (err instanceof TargetNotFoundError && err.message.indexOf('Target not found') === 0) {
                            return;
                        }

                        throw err;
                    });
            });
    }, opts);
};
