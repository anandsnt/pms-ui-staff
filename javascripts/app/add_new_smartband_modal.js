/**
* class for smart band adding (modal screen)
*
*/

var AddNewSmartBandModal = function(reservationID) {	
	BaseModal.call(this);
	var that = this;
	this.reservationID = reservationID;
	this.url = "/ui/show?haml_file=modals/smartbands/addNewSmartBand&json_input=smartbands/smart_band_list.json&is_hash_map=true&is_partial=true";
	
	this.delegateEvents = function(){
		that.myDom.find('#continue-button').on('click', that.continueButtonClicked);	
		that.myDom.find('#payment-type').on('click', that.switchedPaymentType);
		that.myDom.find('#see-all-band-button').on('click', that.seeAllBandsClicked);
	}

	/**
	* event executed when shown the ui
	*/
	this.modalDidShow = function(){
		that.switchedPaymentType();
	}

	/**
	* function to handle the failure case of save API
	*/
	this.failureCallbackOfSaveAction = function(errorMessage){
		sntapp.notification.showErrorMessage(errorMessage, that.myDom);
	}

	/**
	* function to handle the success case of save API,  will be calling writing interface
	*/
	this.successCallbackOfSaveAction = function(data){		
		var id = data.id;
		// we have to close this & need to call the writing interface
		var params = {}; //TODO:
		var writeToSmartBandModal = new WriteToSmartBandModal(params);
		writeToSmartBandModal.initialize();
	}


	/**
	* function to handle click on continue button
	* in this operation we are saving the info, on success we are redirecting writing interface
	*/
	this.continueButtonClicked = function(){
		var webservice = new NewWebServiceInterface();
		//preparing the data to post
		var dataToPost = {};
		dataToPost.first_name = $.trim(that.myDom.find('#first-name').val());
		dataToPost.last_name = $.trim(that.myDom.find('#last-name').val());
		dataToPost.account_number = "33365774"; // TODO: need to call the api to read from device
		var payment_mode = that.myDom.find('#payment-type').is(":checked");
		dataToPost.is_fixed = payment_mode;
		if(payment_mode){ //means fixed, then only we need to add this attribute
			dataToPost.amount = $.trim(that.myDom.find('#fixed-amound').val());
		}
		
		var url = '/api/reservations/' + that.reservationID + '/smartbands';
	    var options = { 
			requestParameters: dataToPost,
			successCallBack: that.successCallbackOfSaveAction,
			failureCallBack: that.failureCallbackOfSaveAction,
			loader: 'blocker',
			async: false
	    };
		// we prepared, we shooted!!	    			
	    webservice.postJSON(url, options);		
	};

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
	};

	/** 
	* function to goto see all bands screen
	*/
	this.seeAllBandsClicked = function(){
		var smartBandModal = new SmartBandModal(that.reservationID);
		smartBandModal.initialize();
	}
};