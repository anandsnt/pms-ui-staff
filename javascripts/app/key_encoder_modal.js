var KeyEncoderModal = function(gotoStayCard, gotoSearch) {
	BaseModal.call(this);
	var that = this;
	var reservation_id = getReservationId();
	this.noOfErrorMethodCalled = 0;
	this.maxSecForErrorCalling = 10000;
	this.url = "/ui/show?haml_file=modals/keys/print_keys_common&json_input=keys/keys_encode.json&is_hash_map=true&is_partial=true";
	//this.url = "staff/reservations/" + reservation_id + "/get_key_on_email";
	
	this.delegateEvents = function() {
		that.myDom.find('#try-again').on('click', that.showDeviceConnectingMessge);
		that.myDom.find('#cancel').on('click', function(){that.hide()});
		that.myDom.find('#key1').on('click', that.key1Selected);
		that.myDom.find('#key2').on('click', that.key2Selected);//
		that.myDom.find('#create-key').on('click', that.keyCreateSelected);
		that.myDom.find('#goto-staycard').on('click', that.clickedGotoStayCard);
		that.myDom.find('#goto-search').on('click', that.clickedGotoSearch);

		if(that.params.origin == views.BILLCARD){
			that.myDom.find('#modal-close').remove();
			$("#modal-overlay").unbind("click");
			$("#modal-overlay").addClass("locked");
		}
	};

	this.modalDidShow = function() {

		that.showDeviceConnectingMessge();
		console.log(that.params.reservationStatus);

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

		if(that.params.origin == views.BILLCARD){
			that.myDom.find('#modal-close').remove();
			$("#modal-overlay").css("pointer-events","none");
			$("#modal-overlay").unbind( "click" );
		}

	};

	this.showDeviceConnectingMessge = function(){
		that.myDom.find('#room-status, #key-status').removeClass('not-connected').addClass('connecting');
		that.myDom.find('#key-status .status').removeClass('error').addClass('pending').text('Connecting to Key Card Reader ...');
		that.myDom.find('#key-action').hide();
		that.myDom.find('#change-page-action').hide();
		that.myDom.find('#print-keys').hide();

		var options = {
			'successCallBack': that.deviceConnected,
			'failureCallBack': that.deviceNotConnected			
		};

		sntapp.cardReader.checkDeviceConnected(options);
		setTimeout(function(){
			that.deviceConnected();
		}, 2000)
	};

	this.deviceNotConnected = function(){
		var secondsAfterCalled = 0;
		setTimeout(function(){
			that.noOfErrorMethodCalled++;
			secondsAfterCalled = that.noOfErrorMethodCalled * 1000;
			if(secondsAfterCalled >= that.maxSecForErrorCalling){ //10seconds
				return that.showDeviceConnectingMessge();
			}
		}, 1000);
		

		
		that.myDom.find('#room-status, #key-status').removeClass('connecting').addClass('not-connected');
		that.myDom.find('#key-status .status').removeClass('pending').addClass('error').text('Error connecting to Key Card Reader!');
		that.myDom.find('#print-keys').hide();
		that.myDom.find('#key-action').show();
		that.myDom.find('#change-page-action').hide();

	};

	this.deviceConnected = function(data){
		alert(data);
		that.myDom.find('#room-status, #key-status').removeClass('connecting').addClass('connected');
		that.myDom.find('#key-status .status').removeClass('pending').addClass('success').text('Connected to Key Card Reader!');		
		that.myDom.find('#key-action').hide();
		that.myDom.find('#change-page-action').hide();
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
		if(!that.keyFetched){
			that.callKeyFetchAPI();
			return true;
		}
	    	
		that.writeKey(that.keyData.key_info[1].t3, "key2");	
	};

	this.callKeyFetchAPI = function(){
		that.keyFetched = true;
	    var reservationId = getReservationId();
	    var postParams = {"reservation_id": reservationId, "key": that.numOfKeys, "is_additional": false};

	    var url = '/ui/show?format=json&json_input=keys/fetch_encode_key.json';
		var webservice = new WebServiceInterface();	
	  	/*var successCallBackParams = {
	  			'reservationId': reservationId,
	  			'roomNumberSelected': roomNumberSelected, 
	  	};*/	
	  	var options = {
	  			   requestParameters: postParams,
	  			   successCallBack: that.keyFetchSuccess,
	  			   //successCallBackParameters: requestParams,
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

		var options = {
			'successCallBack': function(data){
				console.log(that.numOfKeys);
				that.numOfKeys--;
				if(that.numOfKeys == 0){
					that.showKeyPrintSuccess();
					return true;
				}

				if(key == "key1"){
					that.myDom.find('#key1').closest('label').addClass('printed');
					that.myDom.find('#create-key').text('Print key 2');
				} else if (key == "key2"){
					that.myDom.find('#key2').closest('label').addClass('printed');
				}

			},
			'failureCallBack': function(){
				that.showKeyPrintFailure();

			},
			arguments: ['ABCD', keyWriteData , '7009', '']
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
		sntapp.notification.showErrorMessage("Some error occured: " + errorMessage, that.myDom);  
		that.showKeyPrintFailure();

	};

	this.showKeyPrintSuccess = function(){
		that.myDom.find('#room-status, #key-status').removeClass('connecting').addClass('connected completed');
		that.myDom.find('#key-status em').removeClass('pending success icon-key').addClass('info').text('Keys printed!');		
		that.myDom.find('#key-action').hide();
		that.myDom.find('#print-keys').hide();
		that.myDom.find('#room-status h1').addClass('icon-key');
		that.myDom.find('#change-page-action').show();

	};

	this.showKeyPrintFailure = function(){
		that.myDom.find('#room-status, #key-status').removeClass('connecting').addClass('connected completed');
		that.myDom.find('#key-status em').removeClass('pending success icon-key').addClass('info').text('Keys not printed!');		
		that.myDom.find('#key-action').hide();
		that.myDom.find('#print-keys').hide();
		that.myDom.find('#room-status h1').addClass('icon-key');
		that.myDom.find('#change-page-action').show();
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