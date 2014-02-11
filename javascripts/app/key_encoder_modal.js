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
	this.keyFetched = false;
	this.numOfKeys = 0;

	this.url = "/staff/reservations/" + reservation_id + "/get_key_setup_popup";

	//this.url = "/ui/show?haml_file=modals/keys/_key_encode_modal&json_input=keys/keys_encode.json&is_hash_map=true&is_partial=true";
	
	this.delegateEvents = function() {
		that.myDom.find('#try-again').on('click', that.showDeviceConnectingMessge);
		if(that.params.origin == views.BILLCARD){
			that.myDom.find('.cancel-key-popup').on('click', that.showKeyPrintFailure);
		}else{
			that.myDom.find('.cancel-key-popup').on('click', function(){
				that.cancelWriteOperation();
				that.hide();
			});
		}
		that.myDom.find('#key1').on('click', that.key1Selected);
		that.myDom.find('#key2').on('click', that.key2Selected);//
		that.myDom.find('#create-key').on('click', that.keyCreateSelected);
		that.myDom.find('#goto-staycard').on('click', that.clickedGotoStayCard);
		that.myDom.find('#goto-search').on('click', that.clickedGotoSearch);

	};

	/*
	* method for cancelling the write operation
	*/
	this.cancelWriteOperation = function(){
		var options = {
			 'successCallBack': that.successCallbackOfCancelWriteOperation,
			 'failureCallBack': that.failureCallbackOfCancelWriteOperation
		};
		sntapp.cardReader.cancelWriteOperation(options);
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
		else{
			sntapp.cardReader.checkDeviceConnected(options);
		}
		/*setTimeout(function(){
			that.deviceConnected();
		}, 2000)*/
	};

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
			that.myDom.find('#room-status, #key-status').removeClass('connecting').addClass('not-connected');
			that.myDom.find('#key-status .status').removeClass('pending').addClass('error').text('Error connecting to Key Card Reader!');
			that.myDom.find('#print-keys').hide();
			that.myDom.find('#key-action').show();
			that.myDom.find('#print-over-action').hide();
		}

	};

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

	this.key1Selected = function(event){
		var keyElem = $(event.target); 
		var createKeyBtn = that.myDom.find('#create-key');

		//Unselect key1
		if(keyElem.closest('label').hasClass('checked')){
			keyElem.closest('label').removeClass('checked');
			createKeyBtn.removeClass('green').addClass('grey');
			createKeyBtn.attr('disabled','disabled');
			that.numOfKeys = 0;

		//select key1
		}else{
			keyElem.closest('label').addClass('checked'); 
			createKeyBtn.removeClass('grey').addClass('green');
			createKeyBtn.removeAttr('disabled');
			that.numOfKeys = 1;

		}
		
	};

	this.key2Selected = function(event){
		var key2 = $(event.target); 
		var key1 = that.myDom.find('#key1');
		var createKeyBtn = that.myDom.find('#create-key');

		//Unselect key2 - only key1 is selected
		if(key2.closest('label').hasClass('checked')){
			key2.closest('label').removeClass('checked');
			key1.removeAttr('disabled');
			createKeyBtn.text('Print key');
			that.numOfKeys = 1;
		//select key2 - both keys are selected
		} else {
			key2.closest('label').addClass('checked');
			key1.closest('label').addClass('checked');
			createKeyBtn.removeClass('grey').addClass('green');
			createKeyBtn.removeAttr('disabled');
			key1.attr('disabled','disabled');
			createKeyBtn.text('Print key 1');
			that.numOfKeys = 2;
		}

	};

	this.keyCreateSelected = function(){
		that.myDom.find('#key1').attr('disabled','disabled');
		that.myDom.find('#key2').attr('disabled','disabled');

		//On selecting the key create button for the first time, get the keys form API.
		if(!that.keyFetched){
			that.callKeyFetchAPI();
			return true;
		}
	    if(!that.key1Printed){
			that.writeKey(that.keyData.key_info[0].t3, "key1");	
	    }else{
			that.writeKey(that.keyData.key_info[1].t3, "key2");	
	    }
	};

	this.callKeyFetchAPI = function(){
		that.keyFetched = true;
	    var reservationId = getReservationId();
	    var postParams = {"reservation_id": reservationId, "key": that.numOfKeys, "is_additional": false};
	    var url = '/staff/reservation/print_key'
	    //var url = '/ui/show?format=json&json_input=keys/fetch_encode_key.json';
		var webservice = new WebServiceInterface();	

	  	var options = {
	  			   requestParameters: postParams,
	  			   successCallBack: that.keyFetchSuccess,
	  			   failureCallBack: that.keyFetchFailed,
	  			   loader: "BLOCKER"
	  	};
		webservice.postJSON(url, options);

	};

	this.keyFetchSuccess = function(response, requestParams){
		that.keyData = response.data
		that.writeKey(that.keyData.key_info[0].t3, "key1");	

	};

	this.writeKey = function(keyWriteData, key){
		sntapp.activityIndicator.showActivityIndicator('BLOCKER');
		var options = {
			//Cordova write success callback. If write sucess for all the keys, show key success message
			//If keys left to print, call the cordova write key function
			'successCallBack': function(data){
				sntapp.activityIndicator.hideActivityIndicator();
				that.myDom.find('#key-status .status').removeClass('error').addClass('success').text('Connected to Key Card Reader!');

				that.numOfKeys--;
				if(that.numOfKeys == 0){
					that.showKeyPrintSuccess();
					return true;
				}
				if(key == "key1"){
					that.key1Printed = true;
					that.myDom.find('#key1').closest('label').addClass('printed');
					that.myDom.find('#create-key').text('Print key 2');
				} else if (key == "key2"){
					that.myDom.find('#key2').closest('label').addClass('printed');
				}

			},
			'failureCallBack': function(){
				sntapp.activityIndicator.hideActivityIndicator();
				if(that.numOfKeys > 0){
					that.myDom.find('#key-status .status').removeClass('success').addClass('error').text('Print key failed, Please try again');
				}
				else {
					that.showKeyPrintFailure();
				}

			},
			arguments: [keyWriteData, '' , '7009', '']
		};
		if(sntapp.cardSwipeDebug){
			sntapp.cardReader.writeKeyDataDebug(options);
		}
		else{
			sntapp.cardReader.writeKeyData(options);
		}

	};

	this.keyFetchFailed = function(errorMessage){
		sntapp.activityIndicator.hideActivityIndicator();
		sntapp.notification.showErrorMessage(errorMessage, that.myDom);  
		that.showKeyPrintFailure();

	};

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

	this.showKeyPrintFailure = function(){ 
		that.cancelWriteOperation();
		that.myDom.find('#room-status, #key-status').removeClass('connecting').addClass('not-connected completed');
		that.myDom.find('#key-status em').removeClass('pending success icon-key status').addClass('info').text('Keys not printed!');		
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