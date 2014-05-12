var HouseKeepingSettingsView = function(domRef) {
	BaseView.call(this);
	this.myDom = domRef;
	this.currentView = $("body").attr("id");
	var that = this;
    this.fileContent = "";

	this.pageinit = function() {
	};

	this.delegateEvents = function() {
		// To unbind all events that happened - CICO-5474 fix
		that.myDom.on('load').unbind("click");
		that.myDom.find('#save').on('click', that.saveHouseKeepingSettings);
		that.myDom.find('#cancel, #go_back').on('click', that.goBackToPreviousView);

	};
	this.goBackToPreviousView = function() {
		sntadminapp.gotoPreviousPage(that.viewParams, that.myDom);
	};

	this.saveHouseKeepingSettings = function() {
		var extended_checkout = new Array();
		var postParams = {};
		use_pickup = "false";
		use_inspected = "false";
		checkin_inspected_only = "false"
		if (that.myDom.find("#div-use-pickup").hasClass("on")) {
			use_pickup = "true";
		}
		if (that.myDom.find("#div-use-inspected").hasClass("on")) {
			use_inspected = "true";
		}
		if (that.myDom.find("#div-checkin_inspected_only").is(":checked")) {
			checkin_inspected_only = "true";
		}
		
		postParams.use_pickup = use_pickup;
		postParams.use_inspected = use_inspected;
		postParams.checkin_inspected_only = checkin_inspected_only;

		var url = '/admin/house_keeping_settings.json';
		var webservice = new WebServiceInterface();
		var options = {
			requestParameters : postParams,
			successCallBack : that.fetchCompletedOfSave,
			failureCallBack : that.fetchFailedOfSave,
			loader : "BLOCKER"
		};
		webservice.postJSON(url, options);

	};
	// To handle success on save API
	this.fetchCompletedOfSave = function() {
		sntapp.notification.showSuccessMessage("Saved successfully", that.myDom);
	};
	// To handle failure on save API
	this.fetchFailedOfSave = function(errorMessage) {
		sntapp.notification.showErrorMessage(errorMessage, that.myDom);
	};
}; 