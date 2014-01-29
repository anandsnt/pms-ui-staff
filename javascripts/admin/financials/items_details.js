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
	//To save item
	this.saveNewItem = function(event) {
		var url = '/admin/items/save_item';
		var action = "ACTION_SAVE"
		that.makeAPICall(url, action, event);
	};
	//To edit item
	this.updateItem = function(event) {
		var url = '/admin/items/save_item';
		var action = "ACTION_EDIT"
		that.makeAPICall(url, action, event);
	};
	// API calls
	this.makeAPICall = function(url, action, event) {
		var postData = {};

		if (action == "ACTION_EDIT") {
			postData.value = that.myDom.find("form#edit-items").attr("item_id");
		}
		postData.is_favorite = that.myDom.find("#is_favorite").parent().hasClass('checked');
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
	};

	this.fetchfailedOfSave = function(errorMessage) {
		sntapp.activityIndicator.hideActivityIndicator();
		sntapp.notification.showErrorMessage(errorMessage, that.myDom);
	};

}; 