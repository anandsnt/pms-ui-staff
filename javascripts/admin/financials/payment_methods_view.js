var PaymentMethodsView = function(domRef) {
	BaseInlineView.call(this);
	this.myDom = domRef;
	var that = this;

	this.pageshow = function() {

		// check if credit card is turned on or no
		// if its not, hide the credit card types
		var creditCard = that.myDom.find('tr[data-payment-id="1"]');
		var isOn = creditCard.find('.switch-button').hasClass('on');

		if (!isOn) {
			//$('#credit_cards_types').hide();
		};
	};
	
	//Event handler for on-off toggle button.
	this.toggleButtonClicked = function(element) {

		// check if we are process payment methods or credit card types
		// choose the id, url & callback accordingly
		var isPaymentType = element.closest('tr').attr('data-payment-id');
		var isCreditCardType = element.closest('tr').attr('data-credit-card-id');
		var id = isCreditCardType ? isCreditCardType : isPaymentType;
		var type = isCreditCardType ? "creditcard" : "payment";

		//timeout added as a workaround - hasClass 'on' takes time to be applied
		setTimeout(function() {
			var toggleStatus = element.parent().hasClass('on') ? "true" : "false";
			var postParams = {
				"id" : id,
				"set_active" : toggleStatus
			};
			
			if (id == "1" && type == "payment") {
				if (that.myDom.find("#available-cards").hasClass("hidden")) {
					that.myDom.find("#available-cards").removeClass("hidden");
				} else {
					that.myDom.find("#available-cards").addClass("hidden");
				}
			}

			var webservice = new WebServiceInterface();
			var options = {
				requestParameters : postParams,
				successCallBack : that.fetchCompletedOfAction,
				loader : "NONE"
			};

			var url = isCreditCardType ? '/admin/hotel_payment_types/activate_credit_card' : '/admin/hotel_payment_types';
			webservice.postJSON(url, options);
			return true;
		}, 100);

	};

	// success function of re-invite api call
	this.fetchCompletedOfAction = function(data, requestParameters) {
		sntapp.notification.showSuccessMessage("Saved succesfully.", that.myDom);
		return false;
	};
	//function to add new payment
	this.saveNewApi = function(event) {

		var postData = {};
		postData.description = that.myDom.find("#payment-description").val();
		postData.value = that.myDom.find("#payment-code").val();
		var url = '/admin/payment_types/save';
		var webservice = new WebServiceInterface();
		var options = {
			requestParameters : postData,
			successCallBack : that.fetchCompletedOfSave,
			successCallBackParameters : {
				"event" : event
			},
			loader : "BLOCKER"

		};
		webservice.postJSON(url, options);
	};
	//refreshing view with new data and showing message
	this.fetchCompletedOfSave = function(data, requestParams) {

		var url = "/admin/hotel_payment_types";
		viewParams = {};
		sntapp.fetchAndRenderView(url, that.myDom, {}, 'BLOCKER', viewParams, false);
		sntapp.notification.showSuccessMessage("Saved Successfully", that.myDom);
		that.cancelFromAppendedDataInline(requestParams['event']);
	};

	//function to update payment
	this.updateApi = function(event) {
		var postData = {};
		postData.id = that.myDom.find("#edit-payment").attr('payment_id');
		postData.description = that.myDom.find("#payment-description").val();
		postData.value = that.myDom.find("#payment-code").val();
		
		var url = '/admin/payment_types/save';
		var webservice = new WebServiceInterface();
		var options = {
			requestParameters : postData,
			successCallBack : that.fetchCompletedOfSave,
			successCallBackParameters : {
				"event" : event
			},
			loader : "BLOCKER"
		};
		webservice.putJSON(url, options);
	};
	//function to delete charge group
	this.deleteItem = function(event) {
		event.preventDefault();
		var postData = {};
		var selectedId = $(event.target).attr("id");
		if (selectedId == "delete") {
			selectedId = that.myDom.find("#edit-payment").attr('payment_id');
		}
		var url = '/admin/payment_types/' + selectedId;
		postData.id = selectedId;
		var webservice = new WebServiceInterface();
		var options = {
			requestParameters : postData,
			successCallBack : that.fetchCompletedOfDelete,
			failureCallBack : that.fetchFailedOfDelete,
			loader : "BLOCKER",
			successCallBackParameters : {
				"selectedId" : selectedId
			}
		};
		webservice.deleteJSON(url, options);
	};
	// Success response of deletion
	this.fetchCompletedOfDelete = function(data, successParams) {

		var url = "/admin/charge_groups";
		viewParams = {};
		sntapp.fetchAndRenderView(url, that.myDom, {}, 'BLOCKER', viewParams, false);
		sntapp.notification.showSuccessMessage("Deleted Successfully", that.myDom);

	};
	// Failure response of deletion
	this.fetchFailedOfDelete = function(errorMessage) {
		sntapp.notification.showErrorMessage(errorMessage, that.myDom);

	};

};
