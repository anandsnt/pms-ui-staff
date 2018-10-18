this.webSocketOperations = function(socketOpenedSuccessCallback, socketOpenedFailureCallback, actionSuccesCallback, wsSwipeUrl, wsSwipePort) {
    var that = this;
    var wsConfig = {
        'swipeService': 'wss://localhost:4649/CCSwipeService',
        'connected_alert': '[ WebSocket Connected ]. Warning : Clicking on Connect multiple times will create multiple connections to the server',
        'close_alert': 'Socket Server is no longer connected.',
        'swipe_alert': 'Please swipe.',
        'connect_delay': 1000 // ms after opening the app, which will then attempt to connect to the service, should only be a second or two
    };
    // ws = new WebSocket(wsConfig['swipeService']);

    this.simulateSwipe = function() {
        that.ws.send('{"Command" : "cmd_simulate_swipe"}');
    };
    this.observe = function() {
        that.ws.send('{"Command" : "cmd_observe_for_swipe"}');
    };
    this.UUIDforDevice = function() {
        that.ws.send('{"Command" : "cmd_device_uid"}');
    };
    this.DispenseKey = function(keyDispenseUID, is_first_key) { // write to key after successful encodeKey call
        console.log('{"Command" : "cmd_dispense_key_card", "Data" : "' + keyDispenseUID + '","is_first_key":"' + is_first_key + '"}');
        that.ws.send('{"Command" : "cmd_dispense_key_card", "Data" : "' + keyDispenseUID + '","is_first_key":"' + is_first_key + '"}');
    };
    this.EjectKeyCard = function() { // reject key on failure
        that.ws.send('{"Command" : "cmd_eject_key_card"}');
    };
    this.CaptureKeyCard = function() { // dumps key into internal bucket after insert key
        that.ws.send('{"Command" : "cmd_capture_key_card"}');
    };
    this.CaptureQRViaPassportScanner = function() { // captures QR code data from the ARH/Samsotech Passport scanner
        that.ws.send('{"Command" : "cmd_scan_qr_passport_scanner"}');
    };
    this.CapturePassport = function() { // captures QR code data from the ARH/Samsotech Passport scanner
        var v1Scanning = angular.element('#header').scope().$parent.zestStationData.v1GuestIDScanning;// to be removed after 3.0
        
        if (v1Scanning === 'true') {
            that.ws.send('{"Command" : "cmd_scan_passport"}');
        } else {
            // default if not configured
            that.ws.send('{"Command" : "cmd_samsotech_scan_passport"}');// (ENHANCED LIBRARY)
        }
    };
    this.CaptureQRViaDatalogic = function() { // captures QR code data (reservation id) from the Datalogic scanner
        that.ws.send('{"Command" : "cmd_scan_qr_datalogic"}');
    };
    this.InsertKeyCard = function() { // use key for checkout takes key in
        that.ws.send('{"Command" : "cmd_insert_key_card"}');
    };
    this.toggleLight = function(Command) {
        that.ws.send(Command);
    };

    this.startPrint = function(data) {
        var printBillJson = {
            'Command': 'cmd_print_bill',
            'Data': data
        };
        var jsonstring = JSON.stringify(printBillJson);

        that.ws.send(jsonstring);
    };

    this.fetchDeviceId = function() {
        that.ws.send('{"Command" : "cmd_device_uid"}');
    };

    this.enableDeviceLogging = function() {
        that.ws.send('{"Command" : "cmd_enable_debug_log"}');
    };

    this.connect = function() {
        try {
            var port = (_.isUndefined(wsSwipePort) || wsSwipePort === '' || wsSwipePort === null) ? 4649 : wsSwipePort;
            
            if (_.isUndefined(wsSwipeUrl) || wsSwipeUrl === '') {
                that.ws = new WebSocket('wss://localhost:' + port + '/CCSwipeService');
            } else {
                that.ws = new WebSocket(wsSwipeUrl + ':' + port + '/CCSwipeService');
            }
        } catch (e) {
            console.error(e);
            socketOpenedFailureCallback();
        }

        // Triggers when websocket connection is established.
        that.ws.onopen = function() {
            console.info(wsConfig['connected_alert']);
            socketOpenedSuccessCallback();
        };

        // Triggers when there is a message from websocket server.
        that.ws.onmessage = function(evt) {
            var response = evt.data;

            if (response) {
                response = JSON.parse(response);
                actionSuccesCallback(response);
            }
        };
        // Triggers when the server is down.
        that.ws.onclose = function() {
            // websocket is closed.
            console.warn('[::: WebSocket Closed :::]');
            socketOpenedFailureCallback();
        };
        return that.ws;
    };

    this.returnWebSocketObject = function() {
        return that.ws;
    };

    this.closeWebSocket = function() {
        that.ws.close();
    };

    console.info('--> Connecting WebSocket...');
    setTimeout(function() {
            console.info('[:: Connecting ... .. .  ::]');
            that.connect();
        },
        wsConfig['connect_delay']);
};