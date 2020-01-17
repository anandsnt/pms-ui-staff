var self = this,
    timer;

this.addEventListener('message',  function(event) {
    var data = event.data;

    switch (data.cmd) {
        case 'START_TIMER':
            if (timer) {
                clearTimeout(timer);
            }
            
            timer = setTimeout(function () {
                self.postMessage({cmd: 'SHOW_TIMEOUT_POPUP' });
            }, data.interval);
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