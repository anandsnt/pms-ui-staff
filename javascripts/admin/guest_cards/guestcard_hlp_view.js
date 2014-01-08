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

	//handle view click events
	this.viewClickEventHandler = function(event) {
		var element = $(event.target);

		if (element.hasClass('add-new-option'))
			return that.addNewOption(element, event);
		return true;

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


	this.toggleButtonClicked = function(element) {

		var hlpId = element.closest('tr').attr('hlp_id');
		setTimeout(function(){
			var toggleStatus = element.parent().hasClass('on') ? "true" : "false";
			var postData = {
				"value" : hlpId,
				"set_active" : toggleStatus
			};
		//console.log(JSON.stringify(postData));// DELETE once API Integration is complete

			var webservice = new WebServiceInterface();
			var options = {
				requestParameters : postData,
				loader : "NONE"
			};
			var url = "/admin/hotel/toggle_hlp_activation/";
			webservice.postJSON(url, options);
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
			.wrap('<div class="entry" />');// Wrap to div

		// Set new class
		$('.add-new-option').unbind('click');
		element.removeClass('add-new-option').addClass('delete-option');

	};

	//refreshing view with new data and showing message
	this.fetchCompletedOfSave = function(data, requestParams) {

		var url = "/admin/hotel/list_hlps/";
		viewParams = {};
		
		if (data.status == "success") {
			sntapp.fetchAndRenderView(url, that.myDom, {}, 'BLOCKER', viewParams);
			sntapp.notification.showSuccessMessage("Saved Successfully", that.myDom);
			that.cancelFromAppendedDataInline(requestParams['event']);
		} else {
			sntapp.notification.showErrorList(data.errors, that.myDom);
		}
	};

	this.updateApi = function(event) {

		var hlpId = that.myDom.find("form#edit-loyalty").attr("hlp_id");
		var url = '/admin/hotel/update_hlp/' ;
		var action = "ACTION_EDIT"
		that.makeAPICall(url , action, event);

	};

	this.saveNewApi = function(event) {

		var url = '/admin/hotel/save_hlp';
		var action = "ACTION_SAVE"
		that.makeAPICall(url, action, event);


	};

	this.makeAPICall = function(url, action, event){
		var postData = {};
		if(action == "ACTION_EDIT"){
			postData.value = that.myDom.find("form#edit-loyalty").attr("hlp_id");
		}
		postData.name = that.myDom.find("#name").val();
		postData.code = that.myDom.find("#code").val();
		var levels = [];
		$("input[name=loyalty-levels]").each(function() {
			
			var name = $(this).val();
			if (name != "") {
				var dict = {};
				if(action == "ACTION_EDIT"){
					dict.value = $(this).attr("data-id");
				}
				dict.name = name;
				levels.push(dict);
			}
		});
		postData.levels = levels;
		console.log(JSON.stringify(postData));
		var webservice = new WebServiceInterface();
		var options = {
			requestParameters : postData,
			successCallBack : that.fetchCompletedOfSave,
			successCallBackParameters : { "event" : event },
			loader : "BLOCKER"

		};
		if(action == "ACTION_EDIT"){
			webservice.putJSON(url, options);
		}else if(action == "ACTION_SAVE"){
			webservice.postJSON(url, options);
		}
		

	}
};
