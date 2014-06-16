var ICareServicesView = function(domRef){
	BaseView.call(this);  
  	this.myDom = domRef;
  	var that = this;	


	this.delegateEvents = function() {		
		that.myDom.find('#save_icare_service').on('click', that.saveICareService);
		that.myDom.find('#cancel').on('click', that.goBackToPreviousView);
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
		dataToPost.icare.debit_charge_code_id = that.myDom.find('#debit-charge-group').val();
		dataToPost.icare.credit_charge_code_id = that.myDom.find('#credit-charge-group').val();
		var webservice = new NewWebServiceInterface();
		var url = '/api/hotel_settings/change_settings';
	    var options = { 
			requestParameters: dataToPost,
			successCallBack: that.successCallbackOfSaveAction,
			loader: 'blocker',
			async: false
	    };
		// we prepared, we shooted!!	    			
	    webservice.postJSON(url, options);	
	}
};