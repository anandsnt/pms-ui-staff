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
		ws = new WebSocket("ws://10.7.1.236:" + that.portNumber);
	}

	//Triggers when websocket connection is established.
    ws.onopen = function () {
    	that.isActive = true;
		alert("Connected. Warning : Clicking on Connect multipple times will create multipple connections to the server");
		listenToSwipeActions();
    };

    var listenToSwipeActions = function(){
    	console.log("observeForSwipe");
		ws.send("observeForSwipe");
    };

    // Triggers when there is a message from websocket server.
	ws.onmessage = function (event) {
		var cardData = event.data;
		that.swipeCallbacks.successCallBack(cardData);
	}




}