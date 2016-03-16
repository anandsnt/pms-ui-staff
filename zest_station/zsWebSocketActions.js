var wsConfig = {
    "swipeService": "wss://localhost:4649/CCSwipeService",
    "connected_alert": "[ WebSocket Connected ]. Warning : Clicking on Connect multipple times will create multipple connections to the server",
    "close_alert": "Socket Server is no longer connected.",
    "swipe_alert": "Please swipe.",
    "connect_delay": 1000 //ms after opening the app, which will then attempt to connect to the service, should only be a second or two
};
var ws = new WebSocket(wsConfig['swipeService']);

var simulateSwipe = function() {
    var ws.send("{\"Command\" : \"cmd_simulate_swipe\"}");
};
var observe = function() {
    var ws.send("{\"Command\" : \"cmd_observe_for_swipe\"}");
};
var UUIDforDevice = function() {
    var ws.send("{\"Command\" : \"cmd_device_uid\"}");
};
var DispenseKey = function(keyDispenseUID) { //write to key after successful encodeKey call
    console.info('dispense called : [', keyDispenseUID, ']')
    var ws.send("{\"Command\" : \"cmd_dispense_key_card\", \"Data\" : \"" + keyDispenseUID + "\"}");
};
var EjectKeyCard = function() { //reject key on failure
    var ws.send("{\"Command\" : \"cmd_eject_key_card\"}");
};
var CaptureKeyCard = function() { //dumps key into internal bucket after insert key
    var ws.send("{\"Command\" : \"cmd_capture_key_card\"}");
};
var InsertKeyCard = function() { //use key for checkout takes key in
    var ws.send("{\"Command\" : \"cmd_insert_key_card\"}");
};
var connect = function(callback) {
    //Triggers when websocket connection is established.
    ws.onopen = function() {
        console.info(wsConfig['connected_alert']);
    };

    // Triggers when there is a message from websocket server.
    ws.onmessage = function(evt) {
        var received_msg = evt.data;
        if (received_msg) {
            received_msg = JSON.parse(received_msg);
            var cmd = received_msg.Command,
                msg = received_msg.Message;
            callback(cmd,msg);
        }
    };
    // Triggers when the server is down.
    ws.onclose = function() {
        // websocket is closed.
        console.warn('[::: WebSocket Closed :::]');
    };
    return ws;
};

var connectWebSocket = function(callback) {
    console.info('--> Connecting WebSocket...');
    setTimeout(function() {
        console.info('[:: Connecting ... .. .  ::]');
        connect(callback);
    },
    wsConfig['connect_delay']);
};