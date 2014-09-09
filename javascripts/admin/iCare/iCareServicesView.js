var ICareServicesView = function(domRef){
	BaseView.call(this);  
  	this.myDom = domRef;
  	var that = this;	


	this.delegateEvents = function() {		
		that.myDom.find('#save_icare_service').on('click', that.saveICareService);
		that.myDom.find('#cancel, #go_back').on('click', that.goBackToPreviousView);
	};

	this.goBackToPreviousView = function() {
 	  sntadminapp.gotoPreviousPage(that.viewParams, that.myDom);
  	};

  	this.successCallbackOfSaveAction = function(data){
  		that.goBackToPreviousView();
  	}

	this.saveICareService = function(){
		var dataToPost = {};
		dataToPost.icare = {};
		dataToPost.icare.enabled = that.myDom.find('#icare-service-toggle').is(":checked");
		dataToPost.icare.save_customer_info = that.myDom.find('#icare-service-toggle-customer').is(":checked");
		dataToPost.icare.debit_charge_code_id = that.myDom.find('#debit-charge-group').val();
		dataToPost.icare.credit_charge_code_id = that.myDom.find('#credit-charge-group').val();
		dataToPost.icare.url = that.myDom.find('#access-url').val();
		dataToPost.icare.username = that.myDom.find('#icare-username').val();
		dataToPost.icare.password = that.myDom.find('#icare-password').val();
		dataToPost.icare.account_preamble = that.myDom.find('#account-prefix').val();
		dataToPost.icare.account_length = that.myDom.find('#account-length').val();
		dataToPost.icare.pms_alert_code = that.myDom.find('#pms-alert-code').val();
		var webservice = new NewWebServiceInterface();
		var url = '/api/hotel_settings/change_settings';
	    var options = { 
			requestParameters: JSON.stringify(dataToPost),
			successCallBack: that.successCallbackOfSaveAction,
			loader: 'blocker',
			async: false
	    };
		// we prepared, we shooted!!	    			
	    webservice.postJSON(url, options);	
	}
};