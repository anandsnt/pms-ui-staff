/**
*
*
*/

var KeyEncoderModal = function(gotoStayCard, gotoSearch) {
	BaseModal.call(this);
	var that = this;
	var reservation_id = getReservationId();
	this.noOfErrorMethodCalled = 0;
	this.maxSecForErrorCalling = 10000;
	this.key1Printed = false;
	this.isAdditional = false;
	
	this.numOfKeys = 0;
	this.printKeyStatus = [];

	this.url = "/staff/reservations/" + reservation_id + "/get_key_setup_popup";

	//this.url = "/ui/show?haml_file=modals/keys/_key_encode_modal&json_input=keys/keys_encode.json&is_hash_map=true&is_partial=true";

	this.delegateEvents = function() {
		that.myDom.find('#try-again').on('click', that.showDeviceConnectingMessge);
		that.myDom.find('.cancel-key-popup').on('click', that.cancelPopupClicked);
		that.myDom.find('input[name=keys]').on('click', that.keySelected);
		//that.myDom.find('#key1').on('click', that.key1Selected);
		//that.myDom.find('#key2').on('click', that.key2Selected);//
		that.myDom.find('#create-key').on('click', that.keyCreateBtnClicked);
		that.myDom.find('#goto-staycard').on('click', that.clickedGotoStayCard);
		that.myDom.find('#goto-search').on('click', that.clickedGotoSearch);

	};


	this.cancelPopupClicked = function(e){
		if(that.params.origin == views.BILLCARD){
			var message = 'Key creation failed!';
			//if billcard, show a new message with options to navigate to search or staycard
			that.showKeyPrintFailure(message);
		}else{
			that.hide();
			if(!sntapp.cardSwipeDebug){
				that.cancelWriteOperation();
			}
		}
	};

	/*
	* method for cancelling the write operation
	*/
	this.cancelWriteOperation = function(){
		var options = {
			 'successCallBack': that.successCallbackOfCancelWriteOperation,
			 'failureCallBack': that.failureCallbackOfCancelWriteOperation
		};
		if(!sntapp.cardSwipeDebug){
			try{
				sntapp.cardReader.cancelWriteOperation(options);
			}catch(e){
			}
		}
	};

	/*
	* success call back of cancel write operation
	*/
	this.successCallbackOfCancelWriteOperation = function(data){

	};


	/*
	* failure call back of cancel write operation
	*/
	this.failureCallbackOfCancelWriteOperation = function(errorObject){

	};

	/*
	* Configure the popup based on its reservation status and the parent view
	*/
	this.modalDidShow = function() {

		//Apply color themes based on reservation Status
		if(that.params.reservationStatus == "CHECKING_IN") {
			that.myDom.find('#print-key').addClass('check-in');
			that.myDom.find('#room-status .message').text('Check in Complete');

		} else if(that.params.reservationStatus == "CHECKEDIN") {
			that.myDom.find('#print-key').addClass('inhouse');
			that.myDom.find('#modal-close').addClass('blue');
			that.myDom.find('#room-status .message').text('In House');

		} else if(that.params.reservationStatus == "CHECKING_OUT") {
			that.myDom.find('#print-key').addClass('check-out');
			that.myDom.find('#modal-close').addClass('red');
			that.myDom.find('#room-status .message').text('Checking Out')
		}

		//Unbind the overlay click events for billcard popup.
		if(that.params.origin == views.BILLCARD){
			that.myDom.find('#modal-close').remove();
			$("#modal-overlay").unbind("click");
			$("#modal-overlay").addClass("locked");
		}

		that.showDeviceConnectingMessge();
	};

	/*
	* Call the cordova service to check the device connectivity.
	* Show a loading screen unless connection status is returned by the cordova
	*/
	this.showDeviceConnectingMessge = function(){

		that.myDom.find('#room-status, #key-status').removeClass('not-connected').addClass('connecting');
		that.myDom.find('#key-status .status').removeClass('error').addClass('pending').text('Connecting to Key Card Reader ...');
		that.myDom.find('#key-action').hide();
		that.myDom.find('#print-over-action').hide();
		that.myDom.find('#print-keys').hide();
		var options = {
			'successCallBack': that.deviceConnecionStatus,
			'failureCallBack': that.deviceNotConnected
		};

		if(sntapp.cardSwipeDebug){
			sntapp.cardReader.checkDeviceConnectedDebug(options);
		}
		else {
			try {
				sntapp.cardReader.checkDeviceConnected(options);
			} catch(e) {
				that.deviceNotConnected();
			}
		}

	};

	/*
	* If the device is not connected, try the connection again after 1 sec.
	* repeat the connection check for 10 seconds.
	* If the connection still fails, show a device not connected status in the popup.
	*/
	this.deviceNotConnected = function(){
		//For 10 seconds, we will check the connectivity
		//and if still no connection found,
		//will display the device not connected screen
		var secondsAfterCalled = 0;
		that.noOfErrorMethodCalled++;
		secondsAfterCalled = that.noOfErrorMethodCalled * 1000;
		setTimeout(function(){

			if(secondsAfterCalled <= that.maxSecForErrorCalling){ //10seconds
				return that.showDeviceConnectingMessge();
			}

		}, 1000);

		if(secondsAfterCalled > that.maxSecForErrorCalling){
			that.noOfErrorMethodCalled = 0;
			that.myDom.find('#room-status, #key-status').removeClass('connecting').addClass('not-connected');
			that.myDom.find('#key-status .status').removeClass('pending').addClass('error').text('Error connecting to Key Card Reader!');
			that.myDom.find('#print-keys').hide();
			that.myDom.find('#key-action').show();
			that.myDom.find('#print-over-action').hide();
		}

	};

	/*
	* Cordova callback for device connection status.
	* If device is connected, show status as connected in the popup.
	*/
	this.deviceConnecionStatus = function(data){
		if(!data){
			return that.deviceNotConnected();
		}
		that.myDom.find('#room-status, #key-status').removeClass('connecting').addClass('connected');
		that.myDom.find('#key-status .status').removeClass('pending').addClass('success').text('Connected to Key Card Reader!');
		that.myDom.find('#key-action').hide();
		that.myDom.find('#print-over-action').hide();
		that.myDom.find('#print-keys').show();

	};

	/**
	* function to handle on button selected
	* will do style, text change and also create a list of dictionary to help in knowing the printing status
	*/
	this.keySelected = function(event){
		that.numOfKeys = 0;
		var keyElem = $(event.target); 
		var createKeyBtn = that.myDom.find('#create-key');
		$("input[name='keys']").closest('label').removeClass('checked');
		if(keyElem.is(":checked")){
			that.numOfKeys = parseInt(keyElem.val());
		}
		else{
			that.numOfKeys = parseInt(keyElem.val()) - 1;		
		}

		for(var i = 1; i <= that.numOfKeys; i++){
			$("#key" + i).prop('checked', true);
			$("#key" + i).closest('label').addClass('checked'); 			
		}
		if(that.numOfKeys > 0){
			that.myDom.find('#create-key').text('Print key 1');
			createKeyBtn.removeClass('grey').addClass('green');
			createKeyBtn.removeAttr('disabled');
		}	
		else{
			that.myDom.find('#create-key').text('Print key');
			createKeyBtn.removeClass('green').addClass('grey');
			createKeyBtn.attr('disabled','disabled');
		}
		var elementToPut = {};
		that.printKeyStatus = [];
		for(var i = 1; i <= $("input[name=keys]").length; i++){
			elementToPut = {};
			elementToPut['key'] = 'key' + i;
			elementToPut['printed'] = false;
			elementToPut['fetched'] = false;
			that.printKeyStatus.push(elementToPut);
		}		
	};


	/*
	* User selected the key create button.
	* If the key type is safelock, we need to retieve the UID from the card
	* and pass it to the API while fetching the keys.
	*/
	this.keyCreateBtnClicked = function(){

		that.myDom.find("input[name='keys']").attr("disabled", "disabled");

		//On selecting the key create button for the first time, get the keys form API.
		if(that.myDom.find('#print-key').attr('data-retrieve-uid') == "true"){
			that.getUID();
		}else{
			that.callKeyFetchAPI();
		}
		return true;

	};

	/*
	* Call cordova service to get the UID
	*/
	that.getUID = function(){
		that.myDom.find('#key-status .status').removeClass('pending').addClass('success').text('Reading key!');
		sntapp.activityIndicator.showActivityIndicator('BLOCKER');
		var options = {
			'successCallBack': that.callKeyFetchAPI,
			'failureCallBack': that.showUIDFetchFailedMsg
		};

		if(sntapp.cardSwipeDebug){
			sntapp.cardReader.retrieveUserIDDebug(options);
		}
		else{
			sntapp.cardReader.retrieveUserID(options);
		}
	};

	that.showUIDFetchFailedMsg = function(){
		sntapp.activityIndicator.hideActivityIndicator();
		var message = 'Unable to read the key!';
		that.showKeyPrintFailure(message);
	};


	/*
	* Server call to fetch the key data.
	*/
	this.callKeyFetchAPI = function(uID){
		sntapp.activityIndicator.hideActivityIndicator();
		that.myDom.find('#key-status .status').removeClass('pending').addClass('success').text('Getting key image!');
	    var reservationId = getReservationId();

	    var postParams = {"reservation_id": reservationId, "key": 1, "is_additional": true};
	    // for initial case the key we are requesting is not additional
	    if(!that.isAdditional){
	    	that.isAdditional = true;
	    	var postParams = {"reservation_id": reservationId, "key": 1, "is_additional": false};
	    }
	    if(typeof uID !== 'undefined'){
	    	postParams.uid = uID;
	    }else{
	    	postParams.uid = "";

	    }
	    var url = '/staff/reservation/print_key'
	    //var url = '/ui/show?format=json&json_input=keys/fetch_encode_key.json';
		var webservice = new WebServiceInterface();
	  	var options = {
	  			   requestParameters: postParams,
	  			   successCallBack: that.keyFetchSuccess,
	  			   successCallBackParameters: { 'uid': postParams.uid},
	  			   failureCallBack: that.keyFetchFailed,
	  			   loader: "BLOCKER"
	  	};
		webservice.postJSON(url, options);

	};

	/*
	* Success callback for key fetching
	*/
	this.keyFetchSuccess = function(response, requestParams){
		that.keyData = response.data;		
		that.keyData.uid = requestParams.uid;
		that.printKeys();
	};

	/*
	* Calculate the keyWrite data from the API response and call the write key method for key writing.
	*/
	that.printKeys = function(){
		var index = -1;
		for(var i = 0; i < that.printKeyStatus.length; i++){
			if(that.printKeyStatus[i].printed == false){
				index = i + 1;
				break;
			}
		}
	    
	    var keyData = [];
	    
	    //Safelock key
	    if(Object.keys(that.keyData.key_info[0])[0] == "base64"){
	    	keyData.push(that.keyData.key_info[0].base64)
	    }
		else if(Object.keys(that.keyData.key_info[0])[0] == "image"){
	    	keyData.push(that.keyData.key_info[0].image)
	    }	    
	    else{
	    	keyData.push(that.keyData.key_info[0].t3)
	    }

	    keyData.push(Object.keys(that.keyData.key_info[0])[0]);
	    keyData.push(escapeNull(that.keyData.aid));
	    keyData.push(escapeNull(that.keyData.keyb));
		keyData.push(escapeNull(that.keyData.uid));
	    that.writeKey(keyData, index);
	};

	/*
	* Calls the cordova service to write the keys
	*/
	this.writeKey = function(keyWriteData, index){
		sntapp.activityIndicator.showActivityIndicator('BLOCKER');
		that.myDom.find('#key-status .status').removeClass('pending').addClass('success').text('Writing key!');
		var options = {
			//Cordova write success callback. If all the keys were written sucessfully, show key success message
			//If keys left to print, call the cordova write key function to write the pending key
			'successCallBack': function(data){
				sntapp.activityIndicator.hideActivityIndicator();
				that.myDom.find('#key-status .status').removeClass('error').addClass('success').text('Key created!');

				that.numOfKeys--;
				if(that.numOfKeys == 0){
					that.showKeyPrintSuccess();
					return true;
				}

				that.printKeyStatus[index-1].printed = true;
				that.myDom.find('#key' + index).closest('label').addClass('printed');
				that.myDom.find('#create-key').text('Print key '+ (index+1));

			},
			'failureCallBack': function(){
				sntapp.activityIndicator.hideActivityIndicator();
				if(that.numOfKeys > 0){
					that.myDom.find('#key-status .status').removeClass('success').addClass('error').text('Print key failed, Please try again');
				}
				else {
					var message = 'Key creation failed!';
					that.showKeyPrintFailure(message);
				}

			},
			arguments: keyWriteData
		};
		if(sntapp.cardSwipeDebug){
			sntapp.cardReader.writeKeyDataDebug(options);
		}
		else{
			sntapp.cardReader.writeKeyData(options);
		}

	};

	/*
	* Key fetch failed callback. Show a print key failure status
	*/
	this.keyFetchFailed = function(errorMessage){
		sntapp.activityIndicator.hideActivityIndicator();
		sntapp.notification.showErrorMessage(errorMessage, that.myDom);
		var message = 'Key creation failed!';
		that.showKeyPrintFailure(message);

	};

	/*
	* Show the key print success message
	*/
	this.showKeyPrintSuccess = function(){
		that.myDom.find('#room-status, #key-status').removeClass('connecting').addClass('connected completed');
		that.myDom.find('#key-status em').removeClass('pending success icon-key status').addClass('info').text('Keys printed!');
		that.myDom.find('#key-action').hide();
		that.myDom.find('#print-keys').hide();
		that.myDom.find('#room-status h1').addClass('icon-key');
		that.myDom.find('#print-over-action').show();

		//in billcard we show, the gotostaycard option and goto search options and hide the cancel option
		if(that.params.origin == views.STAYCARD){
			that.myDom.find('#print-over-action .cancel-key-popup').removeClass('hidden');
			that.myDom.find('#print-over-action #goto-staycard').addClass('hidden');
			that.myDom.find('#print-over-action #goto-search').addClass('hidden');
		}

	};

	/*
	* Show the key print failure message
	*/
	this.showKeyPrintFailure = function(message){
		if(typeof message == 'undefined'){
			var message = 'Key creation failed!';
		}
		sntapp.activityIndicator.hideActivityIndicator();
		that.myDom.find('#room-status, #key-status').removeClass('connecting').addClass('not-connected completed');
		that.myDom.find('#key-status em').removeClass('pending success icon-key status').addClass('info').text(message);
		that.myDom.find('#key-action').hide();
		that.myDom.find('#print-keys').hide();
		that.myDom.find('#room-status h1').addClass('icon-key');
		that.myDom.find('#print-over-action').show();

		//in billcard we show the gotostaycard option and goto search options, and hide the cancel option
		//This is to avoid going back to the billcard again. we can not close the popup and got to billcard.
		if(that.params.origin == views.STAYCARD){
			that.myDom.find('#print-over-action .cancel-key-popup').removeClass('hidden');
			that.myDom.find('#print-over-action #goto-staycard').addClass('hidden');
			that.myDom.find('#print-over-action #goto-search').addClass('hidden');
		}

		that.cancelWriteOperation();

	};

	// To handle Goto StayCard
	this.clickedGotoStayCard = function() {
		gotoStayCard();
		that.hide(that.resetStyle);
	};
	// To handle Goto Search
	this.clickedGotoSearch = function() {
		gotoSearch();
		that.hide(that.resetStyle);
	};
	// To Re-setting style of Modal.
	this.resetStyle = function(e) {
		$("#modal-overlay").removeClass("locked");
	};
};
