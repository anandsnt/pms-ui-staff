var RoomTypesView = function(domRef){
  BaseInlineView.call(this);  
  this.myDom = domRef;
  var that = this;
  
  // to handle sub view events
  this.delegateSubviewEvents = function(){
      that.myDom.find('#room-types').tablesorter();
  		that.myDom.on('change', that.viewChangeEventHandler);
  		that.myDom.on('click', that.viewClickEventHandler);
  };

  // pause/unpause sorting
  this.pauseSorting = function(pause) {
    var dataTableHeaders = that.myDom.find('#room-types thead th');

    if (pause) {
      dataTableHeaders.hide();
    } else {
      dataTableHeaders.show();
    };
  };
   
  this.viewChangeEventHandler = function(event){  
	   	var element = $(event.target);
	   	if(element.parent().hasClass('file-upload')) {return that.readURL(event.target);}
  };
  
  this.viewClickEventHandler = function(event){ 
	   	var element = $(event.target);
	   	if(element.hasClass('import')) {return that.importRooms(event);}
  };
  // To call import rooms API
  this.importRooms = function(event) {
  	var postData = {};
  	var url = '/admin/rooms/import';
  	var webservice = new WebServiceInterface();		
  	var options = {
  			   requestParameters: postData,
  			   successCallBack: that.fetchCompletedOfImport,
  			   successCallBackParameters:{ "event": event},
  			   failureCallBack: that.fetchFailedOfSave,
  			   loader:"BLOCKER"
  	};
  	webservice.getJSON(url, options);

    sntapp.notification.showMessageDuringLoading('Collecting rooms data from PMS and adding to Rover...', that.myDom);
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
  this.saveNewApi = function(event){ 
  	 	
  	var postData = {};
  	postData.room_type_code = that.myDom.find("#room-type-code").val(); 
  	postData.room_type_name = that.myDom.find("#room-type-name").val(); 
  	postData.max_occupancy = that.myDom.find("#room-type-max-occupancy").val(); 
  	postData.snt_description = that.myDom.find("#room-type-description").val(); 
  	
  	// to handle is_pseudo_room_type checked or not
  	postData.is_pseudo_room_type = "false";
  	if(that.myDom.find("#is-pseudo-room-type").parent("label:eq(0)").hasClass("checked")) {
	    postData.is_pseudo_room_type = "true";
	}
    postData.is_suite = "false";
    if(that.myDom.find("#is-suite").parent("label:eq(0)").hasClass("checked")) {
      postData.is_suite = "true";
  }
	
  	// to handle image uploaded or not
  	if(that.myDom.find("#file-preview").attr("changed") == "changed")
  		postData.image_of_room_type = that.myDom.find("#file-preview").attr("src");
  	else
  		postData.image_of_room_type = "";
  		
  	var url = '/admin/room_types';
	var webservice = new WebServiceInterface();		
	var options = {
			   requestParameters: postData,
			   successCallBack: that.fetchCompletedOfSave,
			   successCallBackParameters:{ "event": event},
			   failureCallBack: that.fetchFailedOfSave,
			   loader:"BLOCKER"
	};
	webservice.postJSON(url, options);	
  };
  //refreshing view with new data and showing message
  this.fetchCompletedOfSave = function(data,requestParams){
  	
  	var url = "/admin/room_types";
   	viewParams = {};
  	sntapp.fetchAndRenderView(url, that.myDom, {}, 'BLOCKER', viewParams, false);
  	sntapp.notification.showSuccessMessage("Saved Successfully", that.myDom);		
  	that.cancelFromAppendedDataInline(requestParams['event']);  
  };
  
  //function to update department
  this.updateApi = function(event){
  	
  	var postData = {};
  	postData.room_type_id = that.myDom.find("#edit-room-type").attr('room_type_id'); 
  	postData.room_type_code = that.myDom.find("#room-type-code").val(); 
  	postData.room_type_name = that.myDom.find("#room-type-name").val(); 
  	postData.max_occupancy = that.myDom.find("#room-type-max-occupancy").val(); 
  	postData.snt_description = that.myDom.find("#room-type-description").val(); 
  	
  	// to handle is_pseudo_room_type checked or not
  	postData.is_pseudo_room_type = "false";
  	if(that.myDom.find("#is-pseudo-room-type").parent("label:eq(0)").hasClass("checked")) {
	    postData.is_pseudo_room_type = "true";
	}
    postData.is_suite = "false";
    if(that.myDom.find("#is-suite").parent("label:eq(0)").hasClass("checked")) {
      postData.is_suite = "true";
  }
	
  	// to handle image uploaded or not
  	if(that.myDom.find("#file-preview").attr("changed") == "changed")
  		postData.image_of_room_type = that.myDom.find("#file-preview").attr("src");
  	else
  		postData.image_of_room_type = "";
  	
  	var url = '/admin/room_types/'+postData.room_type_id;
	var webservice = new WebServiceInterface();		
	var options = {
			   requestParameters: postData,
			   successCallBack: that.fetchCompletedOfSave,
			   successCallBackParameters:{ "event": event},
			   failureCallBack: that.fetchFailedOfSave,
			   loader:"BLOCKER"
	};
	webservice.putJSON(url, options);	
  };
  // To handle failure on save API
  this.fetchFailedOfSave = function(errorMessage){
  	sntapp.notification.showErrorMessage(errorMessage, that.myDom);
  };

  //refreshing view with new data and showing message after import
  this.fetchCompletedOfImport = function(data,requestParams){
  	var url = "/admin/room_types";

    var params = {
      callback: function() {
        sntapp.notification.msgDuringLoading = false;
        sntapp.notification.hideMessage(that.myDom, 700);
      }
    }

   	viewParams = {};
  	sntapp.fetchAndRenderView(url, that.myDom, params, 'BLOCKER', viewParams, false);
  	that.cancelFromAppendedDataInline(requestParams['event']);  

    sntapp.notification.showMessageDuringLoading('Completed!', that.myDom);
  };
  
};