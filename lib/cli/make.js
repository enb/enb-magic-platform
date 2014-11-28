var make = require('../api/make');

module.exports = function () {
    this
        .title('build specified targets')
        .helpful()
        .opt()
            .name('dir')
            .title('custom project root')
            .short('d')
            .long('dir')
            .end()
        .opt()
            .name('noCache')
            .title('drop cache before running make')
            .short('n')
            .long('no-cache')
            .flag()
            .end()
        .opt()
            .name('force')
            .title('drop cache before running make')
            .long('force')
            .flag()
            .end()
        .opt()
            .name('hideWarnings')
            .title('hides warnings')
            .long('hide-warnings')
            .flag()
            .end()
        .opt()
            .name('graph')
            .title('draws build graph')
            .long('graph')
            .flag()
            .end()
        .arg()
            .name('targets')
            .title('path targets to build')
            .arr()
            .end()
        .act(function (opts, args) {
            opts.cache = !(opts.noCache || opts.force);

            make(args.targets, opts)
                .fail(function (err) {
                    console.error(err.stack);
                    process.exit(1);
                });
        })
        .end();
};
