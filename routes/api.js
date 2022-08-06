'use strict';

const Ping = require('../lib/Ping');


module.exports = function (fastify, opts, done) {
    
    fastify.get('/ping', { websocket: true }, (connection, request) => {

        connection.socket.on('message', message => {

            const data = JSON.parse(message.toString());

            try {
                const ping = new Ping(data.host, data.times);
                const actions = {
                    ondata(data) {
                        connection.socket.send(data);
                    },
                    onerror(msg) {
                        connection.socket.send(`error: ${msg}`);
                    },
                    onclose(code) {
                        connection.socket.send(`process exited with code ${code}`);
                    }
                };
                ping.send(actions);
            } catch (err) {
                connection.socket.send('Request error.');
            }

        });

    });
    done();
};    