'use strict';

(function() {
    class App {
        constructor(selector = 'app') {
            this.element = document.getElementById(selector);
            if(this.element !== null) {
                this.init();
            }
        }

        init() {
            this.ping();
        }

        ping() {
            const form = document.getElementById('ping-form');
            if(form !== null) {
                const response =  document.getElementById('output');
                const hostInput = document.getElementById('host');
                const submit = form.querySelector('input[type="submit"]');

                const wsURL = 'ws://' + location.host + '/api/ping';
                const wS = new WebSocket(wsURL);

                const handleWSMsg = (data, target) => {
                    if(data.includes('Error') || data.includes('error:')) {
                        target.innerHTML = data;
                        return false;
                    }
                    if(!data.includes('process')) {
                        let line = document.createElement('div');
                        line.innerText = data;
                        target.appendChild(line);
                    } else {
                        let close = document.createElement('div');
                        close.innerText = data;
                        target.appendChild(close);
                        submit.removeAttribute('disabled', 'disabled');
                    }
                };

                wS.onmessage = evt => {
                    handleWSMsg(evt.data, response);
                };


                form.addEventListener('submit', e => {
                    e.preventDefault();
                    response.innerHTML = '';
                    submit.setAttribute('disabled', 'disabled');
                    const host = hostInput.value;
                    const times = 3;

                    const data = {
                        host,
                        times
                    };
                    wS.send(JSON.stringify(data));
                }, false);
            }
        }
    }
    
    const app = new App('app');
})();