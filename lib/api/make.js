var run = require('./run'),
    ENB_MAGIC_TASK = process.env.ENB_MAGIC_TASK || '__magic__';

/**
 * Запускает сборку указанных целей посредством вызова мета-таска, в котором будут происходить вызовы всех тасков,
 * так или иначе связанных со сборкой magic-нод.
 *
 * @param {String[]} [targets]                 Список целей на файловой системе, которые нужно собрать.
 * @param {Object}   [opts]
 * @param {String}   [opts.dir]                Корень проекта.
 * @param {Boolean}  [opts.noCache=false]      Не учитывать кэш при запуске таска.
 * @param {Boolean}  [opts.noLog=false]        Не выводить сообщения в консоль в процессе выполнения таска.
 * @param {Boolean}  [opts.hideWarnings=false] Не выводить warning-сообщения в консоль в процессе выполнения таска.
 * @param {Boolean}  [opts.graph=false]        Выводить граф сборки.
 * @returns {Promise}
 */
module.exports = function (targets, opts) {
    return run(ENB_MAGIC_TASK, targets, opts);
};
