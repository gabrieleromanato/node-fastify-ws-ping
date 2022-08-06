'use strict';

const { spawn } = require('child_process');
const validator = require('validator');

class Ping {
    constructor(host, times = 3) {
        this.host = host;
        this.times = times;
    }

    validate() {
        if(!validator.isFQDN(this.host) && !validator.isIP(this.host)) {
            return false;
        }
        if(this.times < 1 || this.times > 10) {
            return false;
        }
        const times = this.times.toString();

        return validator.isInt(times);
    }

    send({ ondata = function () {}, onerror = function () {}, onclose = function () {} }) {
        if(!this.validate()) {
            throw new Error('Invalid parameters.');
        }
        const cmd = spawn('ping', ['-c', this.times, this.host]);

        cmd.stdout.on('data', data => {
            ondata(data.toString());
        });

        cmd.stderr.on('data', data => {
            onerror(data.toString());
        });

        cmd.on('close', code => {
            onclose(code);
        });
    }
}

module.exports = Ping;