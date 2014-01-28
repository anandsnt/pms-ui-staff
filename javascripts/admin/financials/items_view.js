var ItemsView = function(domRef) {
	BaseInlineView.call(this);
	this.myDom = domRef;
	var that = this;

	this.delegateSubviewEvents = function() {
		that.myDom.find('#items').tablesorter({
			headers : {
				3 : {
					sorter : false
				},
				4 : {
					sorter : false
				}
			}
		});
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
			var webservice = new WebServiceInterface();
			var options = {
				requestParameters : postParams,
				loader : "NONE"
			};
			var url = '/admin/items/toggle_favorite';
			webservice.postJSON(url, options);
			return true;
		}, 100);
	};

	this.saveNewApi = function(event) {
		var url = '/admin/items/save_item';
		var action = "ACTION_SAVE"
		that.makeAPICall(url, action, event);
	};

	this.updateApi = function(event) {

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
	//function to delete items
	this.deleteItem = function(event) {
		event.preventDefault();
		var postData = {};
		var selectedId = $(event.target).attr("id");
		if (selectedId == "delete") {
			selectedId = that.myDom.find("#edit-items").attr("item_id");
		}
		var url = "/admin/items/" + selectedId + "/delete_item";
		postData.id = selectedId;
		var webservice = new WebServiceInterface();
		var options = {
			requestParameters : postData,
			successCallBack : that.fetchCompletedOfDelete,
			loader : "BLOCKER",
			shouldShowSuccessMessage : "true",
			successCallBackParameters : {
				"selectedId" : selectedId
			}
		};
		webservice.getJSON(url, options);
	};
	//to remove deleted row and show message
	this.fetchCompletedOfDelete = function(data, successParams) {
		sntapp.notification.showSuccessMessage("Deleted Successfully", that.myDom);
		that.myDom.find("#item_row_" + successParams['selectedId']).remove();
	};
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
