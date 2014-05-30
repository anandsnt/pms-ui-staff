/**
* model class for smart band adding
*
*/

var UpdateSmartBandBalanceView = function(domRef) {
	BaseView.call(this);
	this.myDom = domRef;
	var that = this;	
	this.smartBandId = '';

	this.delegateEvents = function(){
		that.myDom.find('#continue-button').on('click', that.continueButtonClicked);	
		that.myDom.find('#see-all-band-button').on('click', that.seeAllBandsClicked);	
	}

	/**
	* function to handle the failure case of save API
	*/
	this.failureCallbackOfSaveAction = function(errorMessage){
		sntapp.notification.showErrorMessage("Error: " + errorMessage, that.myDom);
	}

	/**
	* function to handle the success case of save API,  will be calling writing interface
	*/
	this.successCallbackOfSaveAction = function(data){		

	}


	/**
	* function to handle click on continue button	
	*/
	this.continueButtonClicked = function(){
		var webservice = new WebServiceInterface();
		//preparing the data to post
		var dataToPost = {};
		dataToPost.first_name = $.trim(that.myDom.find('#first-name').val());
		dataToPost.last_name = $.trim(that.myDom.find('#last-name').val());
		dataToPost.credit = $.trim(that.myDom.find('#credit-to-add').val());

		
		var url = '/api/smartbands/' + that.smartBandId;
	    var options = { 
			requestParameters: dataToPost,
			successCallBack: that.successCallbackOfSaveAction,
			failureCallBack: that.failureCallbackOfSaveAction,
			loader: 'blocker',
			async: false
	    };
		// we prepared, we shooted!!	    			
	    webservice.putJSON(url, options);		
	};

	/** 
	* function to goto see all bands screen
	*/
	this.seeAllBandsClicked = function(){
		var smartBandModal = new SmartBandModal(that.reservationID);
		smartBandModal.initialize();
	}
};