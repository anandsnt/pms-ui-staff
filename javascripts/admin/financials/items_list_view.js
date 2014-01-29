var ItemsListView = function(domRef) {
	BaseView.call(this);
	this.myDom = domRef;
	var that = this;

	this.pageinit = function() {

	};

	this.delegateEvents = function() {
		that.myDom.find('#add-new-button,.edit-data').on('click', sntadminapp.gotoNextPage);
		that.myDom.find(".switch-button").on('click', that.toggleButtonClicked);
		that.myDom.find(".icon-delete").on('click', that.deleteItem);
		that.myDom.find('#items').tablesorter({
			headers : {
				2 : {
					sorter : false
				},
				3 : {
					sorter : false
				},
				4 : {
					sorter : false
				}
			}
		});
	};

	this.goBackToPreviousView = function() {
		sntadminapp.gotoPreviousPage(that.viewParams, that.myDom);
	};

	// To handle active/inactive items favorites.
	this.toggleButtonClicked = function(e) {
		var element = $(e.target);
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

	//function to delete items
	this.deleteItem = function(event) {
		event.preventDefault();
		var postData = {};
		var selectedId = $(event.target).attr("id");
		var url = "/admin/items/" + selectedId + "/delete_item";
		postData.id = selectedId;
		var webservice = new WebServiceInterface();
		var options = {
			requestParameters : postData,
			successCallBack : that.fetchCompletedOfDelete,
			loader : "BLOCKER",
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
};
