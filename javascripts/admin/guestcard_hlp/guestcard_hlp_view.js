var GuestCardHLPView = function(domRef) {
	BaseInlineView.call(this);
	this.myDom = domRef;
	var that = this;
	var textOptionStart = 1;
	// to handle sub view events
	this.delegateSubviewEvents = function() {

		that.myDom.on('click', that.viewClickEventHandler);
		// to remove text if value is null
		that.myDom.on('keyup', that.viewKeyupEventHandler);
	};

	//to handle keyup events- text box show new textbox on key up
	this.viewKeyupEventHandler = function(event) {
		var element = $(event.target);
		if (element.hasClass('delete-option'))
			return that.deleteOption(element);
	};

	// To delete the textbox if value is null - Options values
	this.deleteOption = function(element) {
		if ($.trim(element.val()) == '') {
			element.parent('.entry').remove();
		}
	};
	//handle click events
	this.viewClickEventHandler = function(event) {
		var element = $(event.target);

		if (element.hasClass('add-new-option'))
			return that.addNewOption(element, event);
		if (element.hasClass('activate-inactivate-button'))
			return that.activateInactivateLoyalty(element, event);
		return true;

	};

	//activate/inactivate loyallty
	this.activateInactivateLoyalty = function(element, event) {
		//TODO set url.
		var url = '#';
		var postData = {};
		var selectedId = $(this).attr("ffp");
		// to get the current toggle ffp id
		if ($("#activate-inactivate-button_" + selectedId + " .switch-button").hasClass("on")) {
			postData.activity = "inactivate";
		} else {
			postData.activity = "activate";
		}
		postData.id = selectedId;
		var webservice = new WebServiceInterface();
		var options = {
			requestParameters : postData
		};
		webservice.postJSON(url, options);
	};
	this.addNewOption = function(element, event) {
		var type = element.attr('data-type');

		textOptionStart++;

		element.clone()// Clone element
		.val('')// Clear value
		.attr('id', type + '-option' + textOptionStart)// Increment ID value
		.insertAfter(element.parent('.entry'))// Insert after this one
		.wrap('<div class="entry" />');
		// Wrap to div

		// Set new class
		$('.add-new-option').unbind('click');
		element.removeClass('add-new-option').addClass('delete-option');

	};
	//refreshing view with new data and showing message
	this.fetchCompletedOfSave = function(data, requestParams) {

		var url = "/admin/departments";
		viewParams = {};
		sntapp.fetchAndRenderView(url, $("#replacing-div-first"), {}, 'BLOCKER', viewParams);
		if (data.status == "success") {
			sntapp.notification.showSuccessMessage("Saved Successfully", that.myDom);
			that.cancelFromAppendedDataInline(requestParams['event']);
		} else {
			sntapp.notification.showErrorList(data.errors, that.myDom);
		}
	};
	this.updateApi = function(event) {
		var postData = {};
		postData.id = that.myDom.find("#edit-like").attr("hlp_id");
		postData.name = that.myDom.find("#name").val();
		postData.code = that.myDom.find("#code").val();

		//console.log(JSON.stringify(postData));// DELETE once API Integration is complete

		var url = '/admin/hotel_loyalty_program/' + postData.id;
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
	this.saveNewApi = function(event) {
		var element = $(event.target);
		var type = element.attr('like-type');
		if (type == "common") {
			that.saveCommonLikes(element, event);
		}
	};
};
