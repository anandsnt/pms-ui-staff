this.chromeExtensionListener = function() {
    var initExtensionSocket = function() {
        window.addEventListener('message', function(evt) {
            if (evt.source !== window) {
                return;
            }
            var passedDataObject = evt.data;

            if (passedDataObject.switchToTheme) {
                // switch theme requested from our SNT chrome extension for debugging/testing
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

            } else if (passedDataObject.getStateList) {
                // pass toggle argument to station app, to turn on/off Demo Mode, 
                // *demo mode does not encode keys, only shows success flow
                zestSntApp.getStateList();

            }


        }, false);

        // since multi-property support changed the URL / session methods, need to reload differently if the URL is (/zest_station/h/) 
        //  refreshing with just that will result in a blank page, a way around this is to just remove the /h/
        //  but to persist the hotel session, include the hotel session key (end of location string reference)
        var initRefreshStation = function() {
            var refs, UrlWithSessionId, ref;

            if (location.href.indexOf('zest_station') !== -1 && location.href.indexOf('/h/') !== -1) {
                refs = location.href.split('/h/');

                if (refs.length > 1 && refs[1] !== '') {
                    console.log('reload refs: ', refs);
                    UrlWithSessionId = refs[0] + '/h/' + refs[1];

                    location.href = UrlWithSessionId;
                } else if (refs.length > 1 && refs[1] === '') {
                    console.log('reload /h ref no session: ', refs);
                    ref = location.href.split('/h/');

                    location.href = ref[0];
                } else {
                    console.log('simple reload');
                    location.reload(true);
                }
            } else if (location.href.indexOf('zest_station') !== -1 && location.href.indexOf('/h') !== -1) {
                console.log('reload station without /h ref');
                ref = location.href.split('/h/');

                location.href = ref[0];
            } else if (location.href.indexOf('zest_station') !== -1 && location.href.indexOf('/h') === -1) {
                console.log('simple reload, no /h');
                location.reload(true);
            } else {
                console.log('not a Zest Station URL');
                if ((location.href.indexOf('staff') !== -1 || location.href.indexOf('admin') !== -1) && location.href.indexOf('/h/') !== -1) {
                    refs = location.href.split('/h/');

                    if (refs.length > 1 && refs[1] !== '') {
                        var from = refs[0],
                            stationPrefix = '';

                        if (location.href.indexOf('staff') !== -1) { 
                            stationPrefix = from.split('staff')[0] + 'zest_station'; 
                        } else if (location.href.indexOf('admin') !== -1) { 
                            stationPrefix = from.split('admin')[0] + 'zest_station'; 
                        }
                        console.log('switch to station: ', refs);
                        UrlWithSessionId = stationPrefix + '/h/' + refs[1];

                        location.href = UrlWithSessionId;
                    }
                }
            }
        };

        /*
            listen for Hotkey events to work with chrome extension, to fire off the above events
         */
        function doc_keyDown(e) {
            // Hotkeys!
            // this would listen for the alt key + some other key to fire an event, in this case to tell our chrome extension
            // to run one of its methods
            // 
            // e.metaKey === (mac Command key)


            if (e.metaKey && e.shiftKey && e.keyCode === 82) {
                e.preventDefault();
                e.stopPropagation();
                initRefreshStation();
            }

            if (e.altKey && e.keyCode === 69) { // E - Editor Mode
                zestSntApp.toggleEditorMode();
            } else if (e.altKey && e.keyCode === 84) { // T - Toggle Tags
                zestSntApp.toggleLanguageTags();
            } else if (e.altKey && e.keyCode === 67) { // C - No-Check-in
                zestSntApp.toggleNoCheckIns();
            } else if (e.altKey && e.keyCode === 68) { // D - Demo mode
                zestSntApp.toggleDemoModeOnOff();
            } else if (e.altKey && e.keyCode === 73 && !e.metaKey) { // I - info (dont show if holding cmd key on mac- ie. when bringing up dev console)
                zestSntApp.debugTimers(true);
            } else if (e.altKey && e.keyCode === 74) { // J - Jumper (screen jumping)
                zestSntApp.getStateList();
            } else if (e.ctrlKey && e.shiftKey && e.keyCode === 82) { // CTRL + SHIFT + R -> Refresh Station (for chromeapp/electron testing)
                initRefreshStation();
            }

        }
        document.addEventListener('keydown', doc_keyDown, false); // listen for hotkeys to work with chrome extension


    };

    try {
        initExtensionSocket();
    } catch (err) {
        console.warn(err);
    }

};
