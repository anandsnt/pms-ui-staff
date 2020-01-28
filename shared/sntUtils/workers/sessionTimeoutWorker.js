var self = this,
    timer,
    refreshTokenTimer,
    refreshTokenDelay;

this.addEventListener('message',  function(event) {
    var data = event.data;

    switch (data.cmd) {
        case 'START_TIMER':
            if (timer) {
                clearTimeout(timer);
            }

            if (refreshTokenTimer) {
                clearTimeout(refreshTokenTimer); 
            }
            
            timer = setTimeout (function () {
                self.postMessage({cmd: 'SHOW_TIMEOUT_POPUP' });
            }, data.interval);

            if (!refreshTokenDelay) {
                refreshTokenDelay =  data.interval - 30000;
            }
            this.console.log("Worker : " + refreshTokenDelay);

            refreshTokenTimer = setTimeout (function () {
                self.postMessage({cmd: 'RFRESH_TOKEN' });
            }, refreshTokenDelay);

            self.postMessage({cmd: 'RESET_IDLE_TIME' });

            break;

        case 'SHOW_TIMEOUT_POPUP':
            if (timer) {
                clearTimeout(timer);
            }
            self.postMessage({cmd: 'SHOW_TIMEOUT_POPUP' });
            break;

        case 'STOP_TIMER': 
            if (timer) {
                clearTimeout(timer);
            }
            break;

        default:
            break;
    }

}, false );