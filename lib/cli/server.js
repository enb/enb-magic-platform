var server = require('../api/run-server');

module.exports = function () {
    this
        .title('run development server')
        .helpful()
        .opt()
            .name('dir')
            .title('custom project root')
            .short('d')
            .long('dir')
            .end()
        .opt()
            .name('port')
            .title('socket port [8080]')
            .short('p')
            .long('port')
            .end()
        .opt()
            .name('host')
            .title('socket host [0.0.0.0]')
            .long('host')
            .end()
        .opt()
            .name('socket')
            .title('unix socket path')
            .short('s')
            .long('socket')
            .end()
        .act(function (opts) {
            return server(opts);
        })
        .end();
};
