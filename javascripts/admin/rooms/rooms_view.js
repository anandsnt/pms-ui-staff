var RoomsView = function(domRef) {
	BaseInlineView.call(this);
	this.myDom = domRef;
	var that = this;

	// to handle sub view events
	this.delegateSubviewEvents = function() {
		that.myDom.on('change', that.viewChangeEventHandler);
		that.myDom.on('click', that.viewClickEventHandler);
	};

	this.viewChangeEventHandler = function(event) {
		var element = $(event.target);
		if (element.parent().hasClass('file-upload')) {
			return that.readURL(event.target);
		}
	};
	
	this.viewClickEventHandler = function(event){  
	   	var element = $(event.target);
	   	if(element.hasClass('back')) {return that.goBackToPreviousView();}
 	};
	// To go back to rooms
  	this.goBackToPreviousView = function() {
 		sntadminapp.gotoPreviousPage(that.viewParams);
  	};
	//to show preview of the image using file reader
	this.readURL = function(input) {
		that.myDom.find('#file-preview').attr('changed', "changed");
		if (input.files && input.files[0]) {
			var reader = new FileReader();
			reader.onload = function(e) {
				that.myDom.find('#file-preview').attr('src', e.target.result);
				that.fileContent = e.target.result;
			};
			reader.readAsDataURL(input.files[0]);
		}
	};

	//function to add new room type
	this.saveNewApi = function(event) {

		var postData = {};
		postData.room_number = that.myDom.find("#room-number").val();
		postData.room_type_id = that.myDom.find("#room-type").val();
		postData.active_room_features = [];
		postData.active_room_likes = [];
		// to get active features
		that.myDom.find('#room-features label.checkbox').each(function () {
			if(that.myDom.find(this).hasClass("checked")){
				var value = $(this).find("input").attr('name');
				postData.active_room_features.push(value);
			}
		});
		// to get active likes
		that.myDom.find('#room-likes label.checkbox').each(function () {
			if(that.myDom.find(this).hasClass("checked")){
				var value = $(this).find("input").attr('name');
				postData.active_room_likes.push(value);
			}
		});
		
		// to handle image uploaded or not
		if (that.myDom.find("#file-preview").attr("changed") == "changed")
			postData.room_image = that.myDom.find("#file-preview").attr("src");
		else
			postData.room_image = "";

		var url = '/admin/hotel_rooms/';
		var webservice = new WebServiceInterface();
		var options = {
			requestParameters : postData,
			successCallBack : that.fetchCompletedOfSave,
			failureCallBack : that.fetchFailedOfSave,
			successCallBackParameters : {
				"event" : event
			},
			failureCallBack : that.fetchFailedOfSave,
			loader : "BLOCKER"
		};
		webservice.postJSON(url, options);
	};
	//refreshing view with new data and showing message
	this.fetchCompletedOfSave = function(data,requestParams) {
		
		var url = "/admin/hotel_rooms";
		viewParams = {};
		sntapp.fetchAndRenderView(url, that.myDom, {}, 'BLOCKER', viewParams);
		sntapp.notification.showSuccessMessage("Saved Successfully", that.myDom);
		that.cancelFromAppendedDataInline(requestParams['event']);
	};

	//function to update department
	this.updateApi = function(event) {

		var postData = {};
		postData.room_id = that.myDom.find("#edit-room").attr('data-room-id');
		postData.room_number = that.myDom.find("#room-number").val();
		postData.room_type_id = that.myDom.find("#room-type").val();
		postData.active_room_features = [];
		postData.active_room_likes = [];
		// to get active features
		that.myDom.find('#room-features label.checkbox').each(function () {
			if(that.myDom.find(this).hasClass("checked")){
				var value = $(this).find("input").attr('name');
				postData.active_room_features.push(value);
			}
		});
		// to get active likes
		that.myDom.find('#room-likes label.checkbox').each(function () {
			if(that.myDom.find(this).hasClass("checked")){
				var value = $(this).find("input").attr('name');
				postData.active_room_likes.push(value);
			}
		});
		// to handle image uploaded or not
		if (that.myDom.find("#file-preview").attr("changed") == "changed")
			postData.room_image = that.myDom.find("#file-preview").attr("src");
		else
			postData.room_image = "";

		var url = '/admin/hotel_rooms'+postData.room_type_id;
		var webservice = new WebServiceInterface();
		var options = {
			requestParameters : postData,
			successCallBack : that.fetchCompletedOfSave,
			failureCallBack : that.fetchFailedOfSave,
			successCallBackParameters : {
				"event" : event
			},
			failureCallBack : that.fetchFailedOfSave,
			loader : "BLOCKER"
		};
		webservice.putJSON(url, options);
	};
	// To handle failure on save API
	this.fetchFailedOfSave = function(errorMessage) {
		sntapp.notification.showErrorMessage(errorMessage, that.myDom);
	};

}; 