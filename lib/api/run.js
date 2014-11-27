var apply = require('../apply'),
    runTask = require('../run-task');

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
    if (typeof tasks === 'string') {
        tasks = [{ name: tasks, args: args }];
    } else {
        opts = args;
    }

    opts || (opts = {});
    opts.dir || (opts.dir = process.cwd());

    return apply(function (makePlatform) {
        return runTask(tasks, makePlatform, opts);
    }, opts);
};
