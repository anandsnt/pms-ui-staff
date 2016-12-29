this.chromeApp = function(onMessageCallback, chromeAppId, fetchQRCode) {
    var that = this;

    if (typeof chrome !== 'undefined' && typeof chrome.runtime !== 'undefined') {
        // only init these if using chrome, this is for the chromeapp virtual keyboard
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
                attempt: this.qrAttempt + 1
            };
            console.log('response from Datalogic: ', response);
            if (!response.qr_code) {
                setTimeout(function() {
                    console.log('listening for QR code scan...');
                    // if (!that.cancelNextMsg) {
                        chrome.runtime.sendMessage(chromeAppId, msg, that.listenerForQRCodeResponse);
                    // } else {
                        // console.log('should stop sending messages to chrome app now :)');
                    // }

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

            // this.onChromeAppMsgResponse();
        };

        that.qrAttempt = 0;
        that.fetchQRCode = function() {
            var msg = 'initQRCodeScan';

            chrome.runtime.sendMessage(chromeAppId, msg, that.listenerForQRCodeResponse);
            console.log('SENDING message: ', msg);
        };

        if (fetchQRCode) {
            that.cancelNextMsg = false;
            that.fetchQRCode();
        } else {
            that.setupChromeAppListener();
        }
    }
    return that;
};

this.chromeExtensionListener = function(onMessageCallback, chromeAppId, fetchQRCode) {
    var initExtensionSocket = function() {
        window.addEventListener('message', function(evt) {
            if (evt.source !== window) {
                return;
            }
            var passedDataObject = evt.data;

            if (passedDataObject.switchToTheme) {
                    // switch theme requested from our SNT chrome extension for debugging/testing
                console.info('theme switch requested from extension, switching to [', passedDataObject.switchToTheme, ']');
                zestSntApp.debugTheme(passedDataObject.switchToTheme);
            } else if (passedDataObject.toggleDebuggerOnOff) {
                    // pass toggle argument to station app, not direct on/off
                    // - this turns on the on-screen timer and workstation details so an admin can verify settings/and proper times
                    // possible args = //workstationFetchTimer, languageResetTimer, refreshTimer, idlePopupTimer, backToHomeTimer, toggleOnly
                    // if (debugTimers(true), like here, then the method is only used for toggling on/off the timer view);
                zestSntApp.debugTimers(true);

            } else if (passedDataObject.stationSelectLang) {
                zestSntApp.setLanguage(passedDataObject.stationSelectLang);

            } else if (passedDataObject.toggleEditorOnOff) {
                   // pass toggle argument to station app, to turn on/off Language-Tag-Editor
                zestSntApp.toggleEditorMode();

            } else if (passedDataObject.toggleTags) {
                   // pass toggle argument to station app, to turn on/off Language-Tags (to view tags behind text)
                zestSntApp.toggleLanguageTags();

            }
            // TODO show language tags method;


        }, false);
    };

    try {
        initExtensionSocket();
    } catch (err) {
        console.warn(err);
    }

};