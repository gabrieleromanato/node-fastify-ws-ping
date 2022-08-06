'use strict';

const path = require('path');
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const fastify = require('fastify')({
    logger: true
});
const fastifyStatic = require('@fastify/static');

fastify.setErrorHandler(function (error, request, reply) {
    this.log.error(error);
    reply.status(500).send({ error });
});

fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'static')
});

fastify.register(require('@fastify/websocket'));

fastify.register(require('./routes/site'));
fastify.register(require('./routes/api'), { prefix: '/api' });

const start = async () => {
    try {
        await fastify.listen({ port: PORT, host: HOST});
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}
start();