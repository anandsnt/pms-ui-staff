var DesktopUUIDService = function() {
    var that = this;
    this.isActive = false;
    var ws = {};
    this.startDesktopUUIDService = function(portNumber, callbacks){
        this.portNumber = portNumber;
        this.callbacks = callbacks;
        this.createConnection();
    };

    this.createConnection = function(portNumber) {
        try{
            ws = new WebSocket("wss://localhost:" + that.portNumber +"/CCSwipeService");
        }
        catch(e){
            console.warn("Could not connect to card reader. Please check if the port number is valid!!");
        }

        //Triggers when websocket connection is established.
        ws.onopen = function () {
            that.isActive = true;
            ws.send("UUIDforDevice");

        };

        // Triggers when there is a message from websocket server.
        ws.onmessage = function (event) {
            var cardData = event.data;
            that.callbacks.uuidServiceSuccessCallBack(JSON.parse(cardData));
        };

        ws.onclose = function () {
            // websocket is closed.
            that.callbacks.uuidServiceFailureCallBack();
        };
    };


};