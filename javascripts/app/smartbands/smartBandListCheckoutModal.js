/**
* model class for smart band listing for checkout screen
*
*/

var SmartBandListForCheckoutModal = function(domRef) {
	BaseModal.call(this);
	this.myDom = domRef;	
	this.url = "/ui/show?haml_file=modals/smartbands/smartband_list_checkoutscreen&json_input=smartbands/smartband_list_for_checkoutscreen.json&is_hash_map=true&is_partial=true";
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
		var amount = that.myDom.find('#listing-area').data("balance-amount");
		var dataToPost = {};
		
		
		var url = '/api/reservations/35956/smartbands';
	    var options = { 
			requestParameters: dataToPost,
			successCallBack: that.successCallbackOfKeepCredit,
			loader: 'blocker',
			async: false
	    };	    
		// we prepared, we shooted!!	    			
		var webservice = new NewWebServiceInterface();
	   	webservice.getJSON(url, options);
	};

	this.successCallbackOfCreditToRoom = function(data){
		that.hide();
	};
	this.creditToRoom = function(){
		var amount = that.myDom.find('#listing-area').data("balance-amount");
		var dataToPost = {};
		
		var url = '/api/reservations/35956/smartbands';
	    var options = { 
			requestParameters: dataToPost,
			successCallBack: that.successCallbackOfCreditToRoom,
			loader: 'blocker',
			async: false
	    };	    
		// we prepared, we shooted!!	    			
		var webservice = new NewWebServiceInterface();
	    webservice.getJSON(url, options);
	};

	this.hide = function(){
    	that.unbindCancelEvent();
    	that.unbindEvents();
        $('#modal, #modal-overlay').removeClass('modal-show'); 
        setTimeout(function() { 
            $('#modal').empty();
        	if(typeof that.callBack === "function") that.callBack(that.callBackParams[0]);
        }, 150);
	}



};