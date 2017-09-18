var DesktopCardOperations = function() {
    var that = this;
    var ws = {};
    // Set to true if the desktop swipe is enabled and a WebSocket connection is established.

    that.isActive = false;
    that.isDesktopUUIDServiceInvoked = false;

    this.swipeCallbacks;
    this.startDesktopReader = function(portNumber, swipeCallbacks, url) {
        that.portNumber = portNumber;
        that.ccSwipeURL = url;
        that.swipeCallbacks = swipeCallbacks;
        createConnection();
    };

    this.setDesktopUUIDServiceStatus = function(status) {
        that.isDesktopUUIDServiceInvoked = true;
    };

    this.startReader = function () {
        ws.send("observeForSwipe");
    };

    var createConnection = function() {
        try {
            if (_.isUndefined(that.ccSwipeURL) || that.ccSwipeURL === '') {
                ws = new WebSocket("wss://localhost:" + that.portNumber + "/CCSwipeService");
            } else {
                ws = new WebSocket(that.ccSwipeURL + ':' + that.portNumber + "/CCSwipeService");
            }
        }
        catch (e) {
            console.warn("Could not connect to card reader. Please check if the port number is valid!!");
        }

        // Triggers when websocket connection is established.
        ws.onopen = function () {
            that.isActive = true;
            ws.send("observeForSwipe");

            if (that.isDesktopUUIDServiceInvoked) {
                ws.send("UUIDforDevice");
            }

        };

        // Triggers when there is a message from websocket server.
        ws.onmessage = function (event) {
            var response = event.data;

            response = JSON.parse(response);
            if (response.ResponseType === 'UUIDforDeviceResponse') {
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
            that.swipeCallbacks.failureCallBack();
        };
    };


};
