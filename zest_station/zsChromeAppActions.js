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

            } else if (passedDataObject.toggleDemo) {
                   // pass toggle argument to station app, to turn on/off Demo Mode, 
                   // *demo mode does not encode keys, only shows success flow
                zestSntApp.toggleDemoModeOnOff();

            } else if (passedDataObject.noCheckIns) {
                   // pass toggle argument to station app, to turn on/off No-Check-Ins Mode, 
                   // *this will allow a user to re-use the same check-in, by simulating successful check-in
                   // and not actually checking in the reservation.
                   // 
                   // *Will Not be able to go through check-in with this ON then onto pickup
                   // -since they wont actually be checked-in.
                zestSntApp.toggleNoCheckIns();

            }


        }, false);
        /*
            listen for Hotkey events to work with chrome extension, to fire off the above events
         */
        function doc_keyDown(e) {
            // Hotkeys!
            // this would listen for the alt key + some other key to fire an event, in this case to tell our chrome extension
            // to run one of its methods
            // 
            if (e.altKey && e.keyCode === 69) {// E - Editor Mode
                zestSntApp.toggleEditorMode();
            } else if (e.altKey && e.keyCode === 84) {// T - Toggle Tags
                zestSntApp.toggleLanguageTags();
            } else if (e.altKey && e.keyCode === 67) {// C - No-Check-in
                zestSntApp.toggleNoCheckIns();
            } else if (e.altKey && e.keyCode === 68) {// D - Demo mode
                zestSntApp.toggleDemoModeOnOff();
            } else if (e.altKey && e.keyCode === 73) {// I - info
                zestSntApp.debugTimers(true);
            }

        }
        document.addEventListener('keydown', doc_keyDown, false);// listen for hotkeys to work with chrome extension


    };

    try {
        initExtensionSocket();
    } catch (err) {
        console.warn(err);
    }

};