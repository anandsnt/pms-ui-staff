var ItemsView = function(domRef) {
	BaseInlineView.call(this);
	this.myDom = domRef;
	var that = this;

	this.delegateSubviewEvents = function() {
		that.myDom.find('#items').tablesorter();
		that.myDom.on('click', that.viewClickEventHandler);
	};

	// To handle active/inactive ffps.
	this.toggleButtonClicked = function(element) {
		var itemId = element.closest('tr').attr('item-id');
		setTimeout(function() {
			var toggleStatus = element.parent().hasClass('on') ? "true" : "false";
			var postParams = {
				"id" : itemId,
				"set_active" : toggleStatus
			};
			console.log(JSON.stringify(postParams));
			var webservice = new WebServiceInterface();
			var options = {
				requestParameters : postParams,
				successCallBack : that.fetchCompletedOfSave,
				failureCallBack : that.fetchFailedOfSave,
				loader : "NONE"
			};
			var url = '';
			webservice.postJSON(url, options);
			return true;
		}, 100);
	};

	this.saveNewApi = function(event) {

		var url = '';
		var action = "ACTION_SAVE"
		that.makeAPICall(url, action, event);

	};

	this.updateApi = function(event) {

		var hlpId = that.myDom.find("form#edit-items").attr("item_id");
		var url = '';
		var action = "ACTION_EDIT"
		that.makeAPICall(url, action, event);

	};

	this.makeAPICall = function(url, action, event) {
		var postData = {};
		if (action == "ACTION_EDIT") {
			postData.value = that.myDom.find("form#edit-items").attr("item_id");
		}
		if (action == "ACTION_SAVE") {
			postData.is_favorite = that.myDom.find("#is_favorite").val();
		}
		postData.item_description = that.myDom.find("#item_desc").val();
		postData.unit_price = that.myDom.find("#unit_price").val();
		postData.charge_code = that.myDom.find("#charge_code").val();

		console.log(JSON.stringify(postData));

		var webservice = new WebServiceInterface();
		var options = {
			requestParameters : postData,
			successCallBack : that.fetchCompletedOfSave,
			failureCallBack : that.fetchfailedOfSave,
			successCallBackParameters : {
				"event" : event
			},
			loader : "BLOCKER"

		};
		if (action == "ACTION_EDIT") {
			webservice.putJSON(url, options);
		} else if (action == "ACTION_SAVE") {
			webservice.postJSON(url, options);
		}

	}
	//refreshing view with new data and showing message
	this.fetchCompletedOfSave = function(data, requestParams) {

		var url = "";
		viewParams = {};

		sntapp.fetchAndRenderView(url, that.myDom, {}, 'BLOCKER', viewParams);
		sntapp.notification.showSuccessMessage("Saved Successfully", that.myDom);
		that.cancelFromAppendedDataInline(requestParams['event']);
	};

	this.fetchfailedOfSave = function(errorMessage) {
		sntapp.notification.showErrorList(errorMessage, that.myDom);
	};
};
