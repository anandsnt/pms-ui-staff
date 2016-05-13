var DesktopCardOperations = function(){
	var that = this;
	var ws = {};
	//Set to true if the desktop swipe is enabled and a WebSocket connection is established.
    that.isActive = false;
    that.isDesktopUUIDServiceInvoked = false;

	this.swipeCallbacks;
	this.startDesktopReader = function(portNumber, swipeCallbacks){
		that.portNumber = portNumber;
		that.swipeCallbacks = swipeCallbacks;
		createConnection();
	};

	this.setDesktopUUIDServiceStatus = function(status) {
		that.isDesktopUUIDServiceInvoked = true;
	};

	var createConnection = function(){
		try{
			ws = new WebSocket("wss://localhost:" + that.portNumber +"/CCSwipeService");
		}
		catch(e){
			console.warn("Could not connect to card reader. Please check if the port number is valid!!");
		}

		//Triggers when websocket connection is established.
	    ws.onopen = function () {
	    	that.isActive = true;
			ws.send("observeForSwipe");

			if (that.isDesktopUUIDServiceInvoked) {
				ws.send("UUIDforDevice");
			}

	    };

	    // Triggers when there is a message from websocket server.
		ws.onmessage = function (event) {
			var cardData = event.data;
			var cardDataJSON = JSON.parse(cardData);
			if(cardDataJSON.ResponseType) {
				that.swipeCallbacks.uuidServiceSuccessCallBack(cardDataJSON);
			}
			else {
				that.swipeCallbacks.successCallBack(cardDataJSON);
			}

		};

		ws.onclose = function () {
            // websocket is closed.
            that.swipeCallbacks.failureCallBack();
        };
	};






};