/* eslint-disable angular/timeout-service,angular/json-functions,angular/document-service,angular/log,no-console */
// eslint-disable-next-line no-unused-vars
var DesktopCardOperations = function () {
    var that = this;
    var ws = {};

    that.callBacks = {};

    // Set to true if the desktop swipe is enabled and a WebSocket connection is established.
    that.isActive = false;
    that.isDesktopUUIDServiceInvoked = false;

    // This is a map for the legacy Windows Service
    var commands = {
        observeForSwipe: 'observeForSwipe',
        UUIDforDevice: 'UUIDforDevice'
    };

    // This is the map for the current commands
    var commandMap = {
        observeForSwipe: JSON.stringify({'Command': 'cmd_observe_for_swipe'}),
        UUIDforDevice: JSON.stringify({'Command': 'cmd_device_uid'}),
        getConnectedDeviceDetails: JSON.stringify({'Command': 'cmd_get_device_states'})
    };

    var handleServiceMessages = function (response) {
        switch (response['Command']) {
            case 'cmd_observe_for_swipe':
                that.swipeCallbacks.successCallBack(response.Card);
                break;
            case 'cmd_device_uid':
                that.swipeCallbacks.uuidServiceSuccessCallBack(response.Message);
                break;
            case 'cmd_get_device_states':
                if (response.ResponseCode === 0) {
                    that.callBacks['getConnectedDeviceDetails'].successCallBack(response.device_states, {
                        version: response.service_version,
                        activeClients: response.number_of_clients
                    });
                } else { // Handle failure and response.responseCode
                    that.callBacks['getConnectedDeviceDetails'].failureCallBack(response);
                }
                break;
            case 'an_invalid_command':
                if (response.ResponseCode === 10) {
                    commands = commandMap;
                }
                break;
            default:
                console.error('Unhandled Command');
        }
    };

    this.startDesktopReader = function (portNumber, swipeCallbacks, url) {
        that.portNumber = portNumber;
        that.ccSwipeURL = url;
        that.swipeCallbacks = swipeCallbacks;
        createConnection();
    };

    this.setDesktopUUIDServiceStatus = function () {
        that.isDesktopUUIDServiceInvoked = true;
    };

    this.startReader = function () {
        ws.send(commands['observeForSwipe']);
    };

    this.getConnectedDeviceDetails = function (callBacks) {
        that.callBacks['getConnectedDeviceDetails'] = callBacks;
        ws.send(commands['getConnectedDeviceDetails']);
    };

    var init = function () {
        ws.send(commands['observeForSwipe']);

        if (that.isDesktopUUIDServiceInvoked) {
            ws.send(commands['UUIDforDevice']);
        }
    };

    var createConnection = function () {
        try {
            if (_.isUndefined(that.ccSwipeURL) || that.ccSwipeURL === '') {
                ws = new WebSocket('wss://localhost:' + that.portNumber + '/CCSwipeService');
            } else {
                ws = new WebSocket(that.ccSwipeURL + ':' + that.portNumber + '/CCSwipeService');
            }
        }
        catch (e) {
            console.warn('Could not connect to card reader. Please check if the port number is valid!!');
        }

        // Triggers when websocket connection is established.
        ws.onopen = function () {

            /**
             *   The below event is used by listeners inside Rover app to enable functionality
             *   only available with an active web socket connection
             */
            that.isActive = true;
            document.dispatchEvent(new Event('WS_CONNECTION_ESTABLISHED'));
            ws.send(JSON.stringify({Command: 'an_invalid_command'}));
            setTimeout(init, 2000);
        };

        // Triggers when there is a message from websocket server.
        ws.onmessage = function (event) {
            var response = event.data;

            response = JSON.parse(response);

            if (response['Command']) {
                handleServiceMessages(response);
            } else if (response['ResponseType'] === 'UUIDforDeviceResponse') {
                that.swipeCallbacks.uuidServiceSuccessCallBack(response);
            } else if (response['RVCardReadPAN']) {
                that.swipeCallbacks.successCallBack(response);
            } else {
                // Any other scenario other than above is NOT handled in Rover
                console.error(response);
            }
        };

        ws.onclose = function () {
            // websocket is closed.
            that.isActive = false;
            document.dispatchEvent(new Event('WS_CONNECTION_LOST'));
            that.swipeCallbacks.failureCallBack();
        };
    };
};
