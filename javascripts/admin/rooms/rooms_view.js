var RoomsView = function(domRef) {
	BaseView.call(this);
	this.myDom = domRef;
	var that = this;
	
	this.delegateEvents = function() {
		that.myDom.find('#rooms').tablesorter();
		that.myDom.find('#add-new-button,.edit-data').on('click', sntadminapp.gotoNextPage);
		that.myDom.find('#go_back,#cancel').on('click', that.goBackToPreviousView);
		that.myDom.find('#room-picture').on('change', function(){
  			that.readURL(this);
  		});
		that.myDom.find('#save').on('click', that.addNewRoom);
		that.myDom.find('#update').on('click', that.updateRoom);
	};
	
	//go to previous page withount any update in view
	this.gotoPreviousPage = function() {
		that.myDom.html("");
		sntadminapp.gotoPreviousPage(that.viewParams);
		that.myDom.html("");
		
	}; 
  
	// To go back to rooms
  	this.goBackToPreviousView = function() {
  		that.myDom.html("");
 		sntadminapp.gotoPreviousPage(that.viewParams, that.myDom);
		that.myDom.html("");

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
	this.addNewRoom = function(event) {

		var postData = {};
		postData.room_number = that.myDom.find("#room-number").val();
		postData.room_type_id = that.myDom.find("#room-type").val();
		postData.active_room_features = [];
		postData.active_room_likes = [];
		// to get active features
		that.myDom.find('#room-features label.checkbox').each(function() {
			if (that.myDom.find(this).hasClass("checked")) {
				var value = $(this).find("input").attr('name');
				postData.active_room_features.push(value);
			}
		});
		// to get active likes
		that.myDom.find('#room-likes label.checkbox').each(function() {
			if (that.myDom.find(this).hasClass("checked")) {
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

	//update room details
	this.updateRoom = function() {
		var postData = {};
		postData.room_id = that.myDom.find("#edit-room").attr('data-room-id');
		postData.room_number = that.myDom.find("#room-number").val();
		postData.room_type_id = that.myDom.find("#room-type").val();
		postData.active_room_features = [];
		postData.active_room_likes = [];
		// to get active features
		that.myDom.find('#room-features label.checkbox').each(function() {
			if (that.myDom.find(this).hasClass("checked")) {
				var value = $(this).find("input").attr('name');
				postData.active_room_features.push(value);
			}
		});
		// to get active likes
		that.myDom.find('#room-likes label.checkbox').each(function() {
			if (that.myDom.find(this).hasClass("checked")) {
				var value = $(this).find("input").attr('name');
				postData.active_room_likes.push(value);
			}
		});

		// to handle image uploaded or not
		if (that.myDom.find("#file-preview").attr("changed") == "changed")
			postData.room_image = that.myDom.find("#file-preview").attr("src");
		else
			postData.room_image = "";

		var url = '/admin/hotel_rooms/'+postData.room_id;
		var webservice = new WebServiceInterface();
		var options = {
			   requestParameters: postData,
			   successCallBack: that.fetchCompletedOfSave,
			   failureCallBack: that.fetchFailedOfSave,
			   loader:"BLOCKER"
			   
	};
		webservice.putJSON(url, options);
	};

	//refreshing view with new data and showing message
	this.fetchCompletedOfSave = function(data, requestParams) {

		var url = "/admin/hotel_rooms";
		viewParams = {};
		sntapp.fetchAndRenderView(url, that.viewParams.backDom, {}, 'BLOCKER', viewParams, false);
		sntapp.notification.showSuccessMessage("Saved Successfully", that.viewParams.backDom);
		that.goBackToPreviousView();
	};
	
	// To handle failure on save API
	this.fetchFailedOfSave = function(errorMessage) {
		sntapp.activityIndicator.hideActivityIndicator();
		sntapp.notification.showErrorMessage("Some error occured: " + errorMessage, that.myDom); 
	};

};
