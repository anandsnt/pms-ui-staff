this.chromeApp = function(onMessageCallback, chromeAppId, fetchQRCode) {
    var that = this;
    if (typeof chrome !== "undefined" && typeof chrome.runtime !== "undefined") {
        //only init these if using chrome, this is for the chromeapp virtual keyboard
        that.onChromeAppMsgResponse = function(response) {
            console.log(response);
            onMessageCallback(response);
            if (response) {
                if (response.isChromeApp) {
                    this.inChromeApp = true;
                }
            }
        };

        that.setupChromeAppListener = function() {
            // The ID of the extension we want to talk to.
            // Make a simple request:
            if (chromeAppId) {
                var msg = {
                    fromZestStation: true
                };
                console.log('msg to ChromeApp:', msg);
                chrome.runtime.sendMessage(chromeAppId, msg, this.onChromeAppMsgResponse);
            }
        };


        that.cancelNextMsg = false;
        that.listenerForQRCodeResponse = function(response) {
            var msg = {
                listening: true,
                attempt: (this.qrAttempt + 1)
            };

            if (!response.qr_code) {
                setTimeout(function() {
                    console.log('listening for QR code scan...');
                    if (!that.cancelNextMsg) {
                        chrome.runtime.sendMessage(chromeAppId, msg, that.listenerForQRCodeResponse);
                    } else {
                        console.log('should stop sending messages to chrome app now :)');
                    }

                }, 2000);
            } else {
                that.cancelNextMsg = true;
                console.log('GOT QR CODE BACK FROM CHROMEAPP !!! : ', response.reservation_id);
                msg.listening = false;
                onMessageCallback({
                    qr_code: true,
                    reservation_id: response.reservation_id
                });

                chrome.runtime.sendMessage(chromeAppId, msg, that.listenerForQRCodeResponse);
            }

            //this.onChromeAppMsgResponse();
        };

        that.qrAttempt = 0;
        that.fetchQRCode = function() {
            var msg = 'initQRCodeScan';
            chrome.runtime.sendMessage(chromeAppId, msg, that.listenerForQRCodeResponse);
            console.log('SENDING message: ', msg);
        };

        if (fetchQRCode) {
            that.fetchQRCode();
        } else {
            that.setupChromeAppListener();
        }
    }
    return that;
};