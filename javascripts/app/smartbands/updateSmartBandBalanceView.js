/**
* controller class for smart band adding
*
*/

var UpdateSmartBandBalanceView = function(domRef) {
	BaseView.call(this);
	this.myDom = domRef;
	var that = this;	
	this.accountID = '';
	this.data = '';

	this.delegateEvents = function(){		
		that.myDom.find('#continue-button').on('click', that.continueButtonClicked);	
		that.myDom.find('#see-all-band-button').on('click', that.seeAllBandsClicked);
		that.myDom.find("#cancel-link").on('click', that.parentController.hide);	
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


	this.pageshow = function(){
		that.myDom.find("#first-name").val(that.data.first_name);
		that.myDom.find("#last-name").val(that.data.last_name);
		that.myDom.find('#smartband-id').html('#' + that.data.account_number);
		that.myDom.find('#credit-bal').append(that.data.amount);
		that.accountID = that.data.id;
	};

	/**
	* function to handle click on continue button	
	*/
	this.continueButtonClicked = function(){
		var webservice = new NewWebServiceInterface();
		//preparing the data to post
		var dataToPost = {};
		dataToPost.first_name = $.trim(that.myDom.find('#first-name').val());
		dataToPost.last_name = $.trim(that.myDom.find('#last-name').val());
		dataToPost.credit = $.trim(that.myDom.find('#credit-to-add').val());

		
		var url = '/api/smartbands/' + that.accountID;
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