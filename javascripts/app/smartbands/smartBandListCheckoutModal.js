/**
* model class for smart band listing for checkout screen
*
*/

var SmartBandListForCheckoutModal = function(domRef) {
	BaseModal.call(this);
	this.myDom = domRef;	
	this.url = "/ui/show?haml_file=modals/smartbands/smartband_list_checkoutscreen&json_input=smartbands/smartband_list_for_checkoutscreen.json&is_hash_map=true&is_partial=true";
	var that = this;	


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

	};

	this.keepCredit = function(){
		var amount = that.myDom.find('#listing-area').data("balance-amount");
		console.log(amount);
		var dataToPost = {};
		
		
		var url = '/url';
	    var options = { 
			requestParameters: dataToPost,
			successCallBack: that.successCallbackOfKeepCredit,
			loader: 'blocker',
			async: false
	    };	    
		// we prepared, we shooted!!	    			
		var webservice = new NewWebServiceInterface();
	    //webservice.postJSON(url, options);
	};

	this.successCallbackOfCreditToRoom = function(data){

	};
	this.creditToRoom = function(){
		var amount = that.myDom.find('#listing-area').data("balance-amount");
		console.log(amount);
		var dataToPost = {};
		
		
		var url = '/url';
	    var options = { 
			requestParameters: dataToPost,
			successCallBack: that.successCallbackOfCreditToRoom,
			loader: 'blocker',
			async: false
	    };	    
		// we prepared, we shooted!!	    			
		var webservice = new NewWebServiceInterface();
	    //webservice.postJSON(url, options);
	};



};