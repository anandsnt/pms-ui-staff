var ICareServicesView = function(domRef){
	BaseView.call(this);  
  	this.myDom = domRef;
  	var that = this;	


	this.delegateEvents = function() {		
		that.myDom.find('#save_icare_service').on('click', that.saveICareService);
		
	};

	this.saveICareService = function(){
		var dataToPost = {};
		var webservice = new NewWebServiceInterface();
		var url = '/';
	    var options = { 
			requestParameters: dataToPost,
			successCallBack: that.successCallbackOfSaveAction,
			failureCallBack: that.failureCallbackOfSaveAction,
			loader: 'blocker',
			async: false
	    };
		// we prepared, we shooted!!	    			
	    webservice.putJSON(url, options);	
	}
};