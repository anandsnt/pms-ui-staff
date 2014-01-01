var RoomTypesView = function(domRef){
  BaseInlineView.call(this);  
  this.myDom = domRef;
  var that = this;
  
  // to handle sub view events
  this.delegateSubviewEvents = function(){
  		that.myDom.on('change', that.viewChangeEventHandler);
  };
   
  this.viewChangeEventHandler = function(event){  
	   	var element = $(event.target);
	   	if(element.parent().hasClass('file-upload')) {return that.readURL(event.target);}
  };
   
  //to show preview of the image using file reader
  this.readURL = function(input) {
  	   $('#file-preview').attr('changed', "changed");
       if (input.files && input.files[0]) {
           var reader = new FileReader();
           reader.onload = function(e) {
           	   $('#file-preview').attr('src', e.target.result);
               that.fileContent = e.target.result;
           };
           reader.readAsDataURL(input.files[0]);
       }
  };

  //function to add new department
  this.saveNewApi = function(event){ 
  	 	
  	var postData = {};
  	postData.room_type_code = that.myDom.find("#room-type-code").val(); 
  	postData.room_type_name = that.myDom.find("#room-type-name").val(); 
  	postData.max_occupancy = that.myDom.find("#room-type-max-occupancy").val(); 
  	postData.snt_description = that.myDom.find("#room-type-description").val(); 
  	
  	// to handle is_pseudo_room_type checked or not
  	postData.is_pseudo_room_type = "false";
  	if($("#is-pseudo-room-type").parent("label:eq(0)").hasClass("checked")) {
	    postData.is_pseudo_room_type = "true";
	}
	
  	// to handle image uploaded or not
  	if(that.myDom.find("#file-preview").attr("changed") == "changed")
  		postData.image_of_room_type = that.myDom.find("#file-preview").attr("src");
  	else
  		postData.image_of_room_type = "";
  		
  	var url = '';
	var webservice = new WebServiceInterface();		
	var options = {
			   requestParameters: postData,
			   successCallBack: that.fetchCompletedOfSave,
			   successCallBackParameters:{ "event": event},
			   loader:"BLOCKER"
	};
	webservice.postJSON(url, options);	
  };
  //refreshing view with new data and showing message
  this.fetchCompletedOfSave = function(data, requestParams){
  	
  	var url = "";
   	viewParams = {};
  	sntapp.fetchAndRenderView(url, $("#replacing-div-first"), {}, 'BLOCKER', viewParams);
  	if(data.status == "success"){
		  sntapp.notification.showSuccessMessage("Saved Successfully", that.myDom);		
		  that.cancelFromAppendedDataInline(requestParams['event']);  
	  }	 
	  else{
		  sntapp.notification.showErrorList(data.errors, that.myDom);  
	  }
  };
  
  //function to update department
  this.updateApi = function(event){
  	
  	var postData = {};
  	postData.room_type_code = that.myDom.find("#room-type-code").val(); 
  	postData.room_type_name = that.myDom.find("#room-type-name").val(); 
  	postData.max_occupancy = that.myDom.find("#room-type-max-occupancy").val(); 
  	postData.snt_description = that.myDom.find("#room-type-description").val(); 
  	
  	// to handle is_pseudo_room_type checked or not
  	postData.is_pseudo_room_type = "false";
  	if($("#is-pseudo-room-type").parent("label:eq(0)").hasClass("checked")) {
	    postData.is_pseudo_room_type = "true";
	}
	
  	// to handle image uploaded or not
  	if(that.myDom.find("#file-preview").attr("changed") == "changed")
  		postData.image_of_room_type = that.myDom.find("#file-preview").attr("src");
  	else
  		postData.image_of_room_type = "";
  	
  	console.log(postData);
  	var url = '';
	var webservice = new WebServiceInterface();		
	var options = {
			   requestParameters: postData,
			   successCallBack: that.fetchCompletedOfSave,
			   successCallBackParameters:{ "event": event},
			   loader:"BLOCKER"
			   
	};
	webservice.putJSON(url, options);	
  };
  
};