var DesktopCardOperations = function(){
	var that = this;
	var ws;
	this.swipeCallbacks;
		
	var startDesktopReader = function(portNumber, swipeCallbacks){
		that.portNumber = portNumber;
		that.swipeCallbacks = swipeCallbacks;
		createConnection();
	}

	var createConnection = function(){
		ws = new WebSocket("ws://localhost:" + that.portNumber);
	}

	//Triggers when websocket connection is established.
    ws.onopen = function () {
		alert("Connected. Warning : Clicking on Connect multipple times will create multipple connections to the server");
		listenToSwipeActions();
    };

    var listenToSwipeActions = function(){
    	console.log("listenToSwipeActions");
    	console.log(that.swipeCallbacks);
		ws.send("observeForSwipe");
    };

    // Triggers when there is a message from websocket server.
	ws.onmessage = function (event) {
		var cardData = event.data;
		that.swipeCallbacks.successCallBack(cardData);
	}




}