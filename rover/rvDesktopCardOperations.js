var DesktopCardOperations = function(){
	var that = this;
	var ws = {};
	//Set to true if the desktop swipe is enabled and a WebSocket connection is established.
    that.isActive = false;

	this.swipeCallbacks;
	this.startDesktopReader = function(portNumber, swipeCallbacks){
		that.portNumber = portNumber;
		that.swipeCallbacks = swipeCallbacks;
		createConnection();
	}

	var createConnection = function(){
		//ws = new WebSocket("wss://localhost:" + that.portNumber);
		try{
			ws = new WebSocket("wss://localhost:" + that.portNumber +"/CCSwipeService");
		}
		catch(e){
			console.warn("Could not connect to card reader. Please check if the port number is valid!!");
		}

		//Triggers when websocket connection is established.
	    ws.onopen = function () {
	    	that.isActive = true;
			console.log("Web Socket connected");
			ws.send("observeForSwipe");

	    };

	    // Triggers when there is a message from websocket server.
		ws.onmessage = function (event) {
			var cardData = event.data;
			that.swipeCallbacks.successCallBack(JSON.parse(cardData));
		};

		ws.onclose = function () {
            // websocket is closed.
            //console.log("Websocket server is not running.");
            that.swipeCallbacks.failureCallBack();
        };
	}






}