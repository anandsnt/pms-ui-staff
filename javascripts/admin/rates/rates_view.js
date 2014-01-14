var RatesView = function(domRef) {
	BaseInlineView.call(this);
	this.myDom = domRef;
	var that = this;

	// to handle sub view events
	this.delegateSubviewEvents = function() {
		that.myDom.on('change', that.viewChangeEventHandler);
		that.myDom.on('click', that.viewClickEventHandler);
	};
	this.viewClickEventHandler = function(event) {
		var element = $(event.target);
		if (element.hasClass('import')) {
			return that.importRatesFromPMS(event);
		}
	};
	// To call import rates API
	this.importRatesFromPMS = function(event) {

		var postData = {};
		var url = '/admin/rates/import';
		var webservice = new WebServiceInterface();
		var options = {
			requestParameters : postData,
			successCallBack : that.fetchCompletedOfImport,
			successCallBackParameters : {
				"event" : event
			},
			failureCallBack : that.fetchFailedOfSave,
			loader : "BLOCKER"
		};
		webservice.getJSON(url, options);
	};

	//function to add new rate
	this.saveNewApi = function(event) {

		var postData = {};
		postData.name = that.myDom.find("#rate-name").val();
		postData.description = that.myDom.find("#rate-description").val();
		postData.begin_date = "";
		postData.end_date = "";
		
		var url = '/admin/rates';
		var webservice = new WebServiceInterface();
		var options = {
			requestParameters : postData,
			successCallBack : that.fetchCompletedOfSave,
			successCallBackParameters : {
				"event" : event
			},
			failureCallBack : that.fetchFailedOfSave,
			loader : "BLOCKER"
		};
		webservice.postJSON(url, options);
	};
	//refreshing view with new data and showing message
	this.fetchCompletedOfSave = function(data, requestParams) {

		var url = "/admin/rates";
		viewParams = {};
		sntapp.fetchAndRenderView(url, that.myDom, {}, 'BLOCKER', viewParams);
		sntapp.notification.showSuccessMessage("Saved Successfully", that.myDom);
		that.cancelFromAppendedDataInline(requestParams['event']);
	};

	//function to update rates
	this.updateApi = function(event) {

		var postData = {};
		var rate_id = that.myDom.find("#edit-rates").attr('rate_id');
		postData.name = that.myDom.find("#rate-name").val();
		postData.description = that.myDom.find("#rate-description").val();
		postData.begin_date = "";
		postData.end_date = "";
		
		var url = '/admin/rates/'+rate_id;
		var webservice = new WebServiceInterface();
		var options = {
			requestParameters : postData,
			successCallBack : that.fetchCompletedOfSave,
			successCallBackParameters : {
				"event" : event
			},
			failureCallBack : that.fetchFailedOfSave,
			loader : "BLOCKER"
		};
		webservice.putJSON(url, options);
	};
	// To handle failure on save API
	this.fetchFailedOfSave = function(errorMessage) {
		sntapp.notification.showErrorMessage(errorMessage, that.myDom);
	};
	//refreshing view with new data and showing message after import
	this.fetchCompletedOfImport = function(data, requestParams) {
		var url = "/admin/rates";
		viewParams = {};
		sntapp.fetchAndRenderView(url, that.myDom, {}, 'BLOCKER', viewParams);
		sntapp.notification.showSuccessMessage("Imported Successfully", that.myDom);
		that.cancelFromAppendedDataInline(requestParams['event']);
	};
}; 