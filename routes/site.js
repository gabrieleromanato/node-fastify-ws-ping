'use strict';

module.exports = function (fastify, opts, done) {
    fastify.get('/', (request, reply) => {
        return reply.sendFile('index.html');
    });

    done();
};    