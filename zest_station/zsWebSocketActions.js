this.webSocketOperations = function() {
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
        ws.send("{\"Command\" : \"cmd_simulate_swipe\"}");
    };
    this.observe = function() {
        ws.send("{\"Command\" : \"cmd_observe_for_swipe\"}");
    };
    this.UUIDforDevice = function() {
        ws.send("{\"Command\" : \"cmd_device_uid\"}");
    };
    this.DispenseKey = function(keyDispenseUID) { //write to key after successful encodeKey call
        console.info('dispense called : [', keyDispenseUID, ']')
        ws.send("{\"Command\" : \"cmd_dispense_key_card\", \"Data\" : \"" + keyDispenseUID + "\"}");
    };
    this.EjectKeyCard = function() { //reject key on failure
        ws.send("{\"Command\" : \"cmd_eject_key_card\"}");
    };
    this.CaptureKeyCard = function() { //dumps key into internal bucket after insert key
        ws.send("{\"Command\" : \"cmd_capture_key_card\"}");
    };
    this.InsertKeyCard = function() { //use key for checkout takes key in
        ws.send("{\"Command\" : \"cmd_insert_key_card\"}");
    };
    this.connect = function(socketOpenedSuccessCallback, socketOpenedFailureCallback, actionSuccesCallback) {
        try {
            ws = new WebSocket("wss://localhost:4649/CCSwipeService");
        } catch (e) {
            console.log(e)
            socketOpenedFailureCallback();
        }

        //Triggers when websocket connection is established.
        ws.onopen = function() {
            console.info(wsConfig['connected_alert']);
            socketOpenedSuccessCallback();
        };

        // Triggers when there is a message from websocket server.
        ws.onmessage = function(evt) {
            var response = evt.data;
            if (response) {
                response = JSON.parse(response);
                actionSuccesCallback(response);
            }
        };
        // Triggers when the server is down.
        ws.onclose = function() {
            // websocket is closed.
            console.warn('[::: WebSocket Closed :::]');
            socketOpenedFailureCallback();
        };
        return ws;
    };

    this.connectWebSocket = function(socketOpenedSuccessCallback, socketOpenedFailureCallback, actionSuccesCallback) {
        console.info('--> Connecting WebSocket...');
        setTimeout(function() {
                console.info('[:: Connecting ... .. .  ::]');
                that.connect(socketOpenedSuccessCallback, socketOpenedFailureCallback, actionSuccesCallback);
            },
            wsConfig['connect_delay']);
    };
}