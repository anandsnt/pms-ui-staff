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
		that.myDom.find("#cancel-link").on('click', that.backToListing);	
		that.myDom.on('click', that.clickedOnMyDom);
	}

	this.clickedOnMyDom = function(event){
		sntapp.notification.hideMessage(that.myDom);	
	};
	/**
	* function to handle the failure case of save API
	*/
	this.failureCallbackOfSaveAction = function(errorMessage){
		sntapp.notification.showErrorMessage("Error: " + errorMessage, that.myDom);
	}

	this.backToListing = function(){
		that.parentController.showPage('smartband-listing');
	}
	/**
	* function to handle the success case of save API,  will be calling writing interface
	*/
	this.successCallbackOfSaveAction = function(data, successCallBackParameters){		
		var rowToChange = successCallBackParameters.data;
		rowToChange.amount = parseFloat(rowToChange.credit) + parseFloat(that.data.amount);
		rowToChange.id = that.data.id;
		that.parentController.getControllerObject('smartband-listing').updateRow(rowToChange);
		that.data = {};	
		that.parentController.showPage('smartband-listing');
	}


	this.pageshow = function(){
		that.myDom.find('#payment-type-div').hide();
		that.myDom.find('#credit-adding-div').show();
		that.myDom.find('#float-right').show();

		that.myDom.find("#first-name").val(that.data.first_name);
		that.myDom.find("#last-name").val(that.data.last_name);
		that.myDom.find('#smartband-id').html('#' + that.data.account_number);
		that.myDom.find('#credit-to-add').val('');
		that.myDom.find('#area-of-details').css("pointer-events", "auto").css("opacity", "1");
	
		if(!that.data.is_fixed){
			that.myDom.find('#area-of-details').css("pointer-events", "none").css("opacity", "0.5");
			that.myDom.find('#payment-type').prop('checked', false);
    		that.switchedPaymentType();
			that.myDom.find('#payment-type-div').show();
			that.myDom.find('#credit-adding-div').hide();
			that.myDom.find('#float-right').hide();
		}
		else{
			that.myDom.find('#credit-bal').html(that.myDom.data("currency-symbol") + " " + that.data.amount);
		}
		that.accountID = that.data.id;
	};

	/**
	* function to handle click on continue button	
	*/
	this.continueButtonClicked = function(){
		document.activeElement.blur();
		if(!that.data.is_fixed){
			return that.backToListing();
		}
		var webservice = new NewWebServiceInterface();
		//preparing the data to post
		var dataToPost = {};
		dataToPost.first_name = $.trim(that.myDom.find('#first-name').val());
		dataToPost.last_name = $.trim(that.myDom.find('#last-name').val());

		dataToPost.credit = parseFloat($.trim(that.myDom.find('#credit-to-add').val()));
		if(isNaN(dataToPost.credit)){
			dataToPost.credit = 0.00;
		}
		var url = '/api/smartbands/' + that.accountID;
	    var options = { 
			requestParameters: JSON.stringify(dataToPost),
			successCallBack: that.successCallbackOfSaveAction,
			successCallBackParameters: { 'data': dataToPost},
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
	/** 
	* function to handle ui changes on payment type switching
	*/
	this.switchedPaymentType = function(){
		var value = that.myDom.find('#payment-type').is(":checked");
		if(value) {
			that.myDom.find('#fixed-amound').parents("div").eq(0).show();
		}
		else{
			that.myDom.find('#fixed-amound').parents("div").eq(0).hide();
		}
		onOffSwitch();
	};	
};