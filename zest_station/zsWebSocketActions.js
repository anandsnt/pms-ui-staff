this.webSocketOperations = function(socketOpenedSuccessCallback, socketOpenedFailureCallback, actionSuccesCallback) {
    var that = this;
    var wsConfig = {
        "swipeService": "wss://localhost:4649/CCSwipeService",
        "connected_alert": "[ WebSocket Connected ]. Warning : Clicking on Connect multipple times will create multipple connections to the server",
        "close_alert": "Socket Server is no longer connected.",
        "swipe_alert": "Please swipe.",
        "connect_delay": 1000 //ms after opening the app, which will then attempt to connect to the service, should only be a second or two
    };
    //ws = new WebSocket(wsConfig['swipeService']);

    this.simulateSwipe = function() {
        that.ws.send("{\"Command\" : \"cmd_simulate_swipe\"}");
    };
    this.observe = function() {
        that.ws.send("{\"Command\" : \"cmd_observe_for_swipe\"}");
    };
    this.UUIDforDevice = function() {
        that.ws.send("{\"Command\" : \"cmd_device_uid\"}");
    };
    this.DispenseKey = function(keyDispenseUID) { //write to key after successful encodeKey call
        console.info('dispense called : [', keyDispenseUID, ']')
        that.ws.send("{\"Command\" : \"cmd_dispense_key_card\", \"Data\" : \"" + keyDispenseUID + "\"}");
    };
    this.EjectKeyCard = function() { //reject key on failure
        that.ws.send("{\"Command\" : \"cmd_eject_key_card\"}");
    };
    this.CaptureKeyCard = function() { //dumps key into internal bucket after insert key
        that.ws.send("{\"Command\" : \"cmd_capture_key_card\"}");
    };
    this.CaptureQRViaPassportScanner = function() { //captures QR code data from the ARH/Samsotech Passport scanner
        that.ws.send("{\"Command\" : \"cmd_scan_qr_passport_scanner\"}");
    };
    this.InsertKeyCard = function() { //use key for checkout takes key in
        that.ws.send("{\"Command\" : \"cmd_insert_key_card\"}");
    };
    this.connect = function() {
        try {
            that.ws = new WebSocket("wss://localhost:4649/CCSwipeService");
        } catch (e) {
            console.error(e)
            socketOpenedFailureCallback();
        }

        //Triggers when websocket connection is established.
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
}