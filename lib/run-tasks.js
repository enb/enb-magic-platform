var vow = require('vow');

/**
 * Выполняет список тасков для указанной make-платформы.
 *
 * @param {{ name: String, args: String[] }[]} tasks Список тасков, которые нужно выполнить.
 * @param {MakePlatform} makePlatform
 * @param {Object}       [opts]
 * @param {String}       [opts.magicMode=full]       Режим сборки для magic-нод.
 * @returns {Promise}
 */
module.exports = function (tasks, makePlatform, opts) {
    var factory = makePlatform._projectConfig._modules['enb-magic-factory'],
        metatask = factory.getMetaTaskName(),
        subtasks = factory._taskNames,
        magicMode = opts.magicMode || 'full',
        promises = [],
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
        } else if (metatask === name) {
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
        } else {
            promise = makePlatform.buildTask(name, args);

            promises.push(promise);
        }
    });

    return vow.all(promises)
        .then(function () {
            return {
                builtTargets: builtTargets
            };
        });
};
