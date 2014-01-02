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
		return true;

	};

	this.toggleButtonClicked = function(element) {

		var hlpId = element.closest('tr').attr('hlp_id');
		setTimeout(function(){
			var toggleStatus = element.parent().hasClass('on') ? "true" : "false";
			var postParams = {
				"value" : hlpId,
				"set_active" : toggleStatus
			};
			var webservice = new WebServiceInterface();
			var options = {
				requestParameters : postParams,
				loader : "NONE"
			};
			//var url = '/staff/reservations/upgrade_room';
			//webservice.postJSON(url, options);
			return true;
		}, 100);
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

		var url = "/admin/hotel_loyalty_program/";
		viewParams = {};
		sntapp.fetchAndRenderView(url, that.myDom, {}, 'BLOCKER', viewParams);
		if (data.status == "success") {
			sntapp.notification.showSuccessMessage("Saved Successfully", that.myDom);
			that.cancelFromAppendedDataInline(requestParams['event']);
		} else {
			sntapp.notification.showErrorList(data.errors, that.myDom);
		}
	};
	this.updateApi = function(event) {
		var postData = {};
		postData.value = that.myDom.find("#edit-loyalty").attr("hlp_id");
		postData.name = that.myDom.find("#name").val();
		postData.code = that.myDom.find("#code").val();
		var levels = new Array();
		$("input[name=loyalty-levels]").each(function() {
			value = $(this).attr("data-id");
			name = $(this).val();
			dict = {
				'value' : value,
				'name' : name
			};
			if (name != "") {
				levels.push(dict);
			}
		});
		postData.levels = levels;
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
		var postData = {};
		postData.value = that.myDom.find("#edit-like").attr("hlp_id");
		postData.name = that.myDom.find("#name").val();
		postData.code = that.myDom.find("#code").val();
		var levels = new Array();
		$("input[name=loyalty-levels]").each(function() {
			value = $(this).attr("data-id");
			name = $(this).val();
			dict = {
				'value' : value,
				'name' : name
			};
			if (name != "") {
				levels.push(dict);
			}
		});
		postData.levels = levels;
		//console.log(JSON.stringify(postData));// DELETE once API Integration is complete

		var url = '/admin/hotel_loyalty_program/create';
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
};
