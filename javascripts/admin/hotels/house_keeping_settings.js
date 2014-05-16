var HouseKeepingSettingsView = function(domRef) {
	BaseView.call(this);
	this.myDom = domRef;
	this.currentView = $("body").attr("id");
	var that = this;
	this.fileContent = "";

	this.pageinit = function() {
		that.use_pickup = "false";
		that.use_inspected = "false";
		that.checkin_inspected_only = "false";
		var div_checkin_inspected_only = that.myDom.find("#div-checkin_inspected_only");
		var is_use_inspected = that.myDom.find("#use_inpsected_room_status").is(":checked");
		if (is_use_inspected) {
			div_checkin_inspected_only.removeAttr("disabled");
		} else {
			div_checkin_inspected_only.attr("disabled", true);
		}

	};

	this.delegateEvents = function() {
		// To unbind all events that happened - CICO-5474 fix
		that.myDom.on('load').unbind("click");
		that.myDom.find('#save').on('click', that.saveHouseKeepingSettings);
		that.myDom.find('#div-use-inspected').on('click', that.disableCheckbox);
		that.myDom.find('#cancel, #go_back').on('click', that.goBackToPreviousView);

		// Initialize checkbox disabled by default.

	};
	this.goBackToPreviousView = function() {
		sntadminapp.gotoPreviousPage(that.viewParams, that.myDom);
	};

	this.disableCheckbox = function() {
		var div_checkin_inspected_only = that.myDom.find("#div-checkin_inspected_only");
		var is_checkbox_checked = div_checkin_inspected_only.is(":checked");
		var is_use_inspected = that.myDom.find("#use_inpsected_room_status").is(":checked");
		if (is_use_inspected) {
			if (is_checkbox_checked) {
				div_checkin_inspected_only.closest("label").find("span:eq(0)").addClass("checked");
				div_checkin_inspected_only.closest("label").addClass("checked");
			} else {
				div_checkin_inspected_only.attr('checked', false);
			}
			div_checkin_inspected_only.removeAttr("disabled");
		} else {
			div_checkin_inspected_only.closest("label").find("span:eq(0)").removeClass("checked");
			div_checkin_inspected_only.closest("label").removeClass("checked");
			div_checkin_inspected_only.attr("disabled", true);
		}

	};

	this.saveHouseKeepingSettings = function() {
		var extended_checkout = new Array();
		var postParams = {};
		var is_use_pickup_on = that.myDom.find("#div-use-pickup").hasClass("on");
		var is_inspected_on = that.myDom.find("#div-use-inspected").hasClass("on");
		var is_inspected_only_checked = that.myDom.find("#div-checkin_inspected_only").is(":checked");
		if (is_use_pickup_on) {
			that.use_pickup = "true";
		}
		if (is_inspected_on) {
			if (is_inspected_only_checked) {
				that.checkin_inspected_only = "true";
			}
			that.use_inspected = "true";

		} else {
			that.checkin_inspected_only = "false";
		}

		postParams.use_pickup = that.use_pickup;
		postParams.use_inspected = that.use_inspected;
		postParams.checkin_inspected_only = that.checkin_inspected_only;

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
		that.goBackToPreviousView();
	};
	// To handle failure on save API
	this.fetchFailedOfSave = function(errorMessage) {
		sntapp.notification.showErrorMessage(errorMessage, that.myDom);
	};
};
