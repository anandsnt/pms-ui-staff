/**
* model class for smart band listing for checkout screen
*
*/

var SmartBandListForCheckoutModal = function(reservationID) {
	BaseModal.call(this);
	this.reservationID = reservationID;
	//this.url = "/ui/show?haml_file=modals/smartbands/smartband_list_checkoutscreen&json_input=smartbands/smartband_list_for_checkoutscreen.json&is_hash_map=true&is_partial=true";
	this.url = "/api/reservations/" + this.reservationID + "/smartbands/with_balance.haml";
	this.balKeepMode = ''; //variable used to selected monitor balance mode, without setting this, wont be able to close the modal
	var that = this;	
	this.callBack = '';
	this.callBackParams = [];

	this.delegateEvents = function() {		
		that.myDom.on('click', that.clickedOnMyDom);
	};

	this.modalDidShow = function(){
		// Set scrolling
    	createVerticalScroll('#listing-area');   
    };

	this.clickedOnMyDom = function(event){
		sntapp.notification.hideMessage(that.myDom);
		if(getParentWithSelector(event, "#keep-credit")){
			that.keepCredit();
		}
		else if(getParentWithSelector(event, "#credit-room")){
			that.creditToRoom();
		}
	};

	this.successCallbackOfKeepCredit = function(data){
		that.hide();
	};

	this.keepCredit = function(){
		that.balKeepMode = 'KEEPCREDIT';
		that.hide();
	};

	this.successCallbackOfCreditToRoom = function(data){
		that.balKeepMode = 'CREDIT_TO_ROOM';
		that.hide();
	};
	this.creditToRoom = function(){
		var dataToPost = {};
		
		var url = '/api/reservations/' + that.reservationID + '/smartbands/cash_out';
	    var options = { 
			requestParameters: dataToPost,
			successCallBack: that.successCallbackOfCreditToRoom,
			loader: 'blocker',
			async: false
	    };	    
		// we prepared, we shooted!!	    			
		var webservice = new NewWebServiceInterface();
	    webservice.postJSON(url, options);
	};

	this.hide = function(){
    	that.unbindCancelEvent();
    	that.unbindEvents();
        $('#modal, #modal-overlay').removeClass('modal-show'); 
        setTimeout(function() { 
            $('#modal').empty();
            if(that.balKeepMode !== ""){
        		if(typeof that.callBack === "function") that.callBack(that.callBackParams[0]);
        	}
        }, 150);
	}



};