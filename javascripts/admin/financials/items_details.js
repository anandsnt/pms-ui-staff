var ItemsDetailsView = function(domRef) {
	BaseView.call(this);
	this.myDom = domRef;

	var that = this;

	this.pageinit = function() {

	};
	this.delegateEvents = function() {
		that.myDom.find('#save').on('click', that.saveNewItem);
		that.myDom.find('#go_back, #cancel').on('click', that.gotoPreviousPage);
		that.myDom.find('#update').on('click', that.updateItem);

	};
	//go to previous page withount any update in view
	this.gotoPreviousPage = function() {
		sntadminapp.gotoPreviousPage(that.viewParams, that.myDom);
	};

	this.saveNewItem = function(event) {
		var url = '/admin/items/save_item';
		var action = "ACTION_SAVE"
		that.makeAPICall(url, action, event);
	};

	this.updateItem = function(event) {
		var hlpId = that.myDom.find("form#edit-items").attr("item_id");
		var url = '/admin/items/save_item';
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
		webservice.postJSON(url, options);
	}
	//refreshing view with new data and showing message
	this.fetchCompletedOfSave = function(data, requestParams) {

		var url = "/admin/items/get_items";
		viewParams = {};

		sntapp.fetchAndRenderView(url, that.myDom, {}, 'BLOCKER', viewParams);
		sntapp.notification.showSuccessMessage("Saved Successfully", that.myDom);
		that.cancelFromAppendedDataInline(requestParams['event']);
	};

	this.fetchfailedOfSave = function(errorMessage) {
		sntapp.notification.showErrorList(errorMessage, that.myDom);
	};

}; 