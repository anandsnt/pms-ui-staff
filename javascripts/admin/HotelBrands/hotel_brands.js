var HotelBrandsView = function(domRef){
  
	BaseInlineView.call(this);  
	this.myDom = domRef;
	var that = this;
    //Function to update API
	this.updateApi = function(event){
		var brandName = $.trim(that.myDom.find("#brand-name").val());
		var brandID = that.myDom.find("#edit-brand-details").attr("data-brand-id");		
		
		var webservice = new WebServiceInterface();
		var url = '/admin/hotel_brands/'+brandID;
		
		if(typeof url === 'undefined' || url == "#" )
			return false;
		
		var data = {'value': brandID, 'name':brandName  };
	    var options = {
				   successCallBack: that.fetchCompletedOfUpdateApi,
				   requestParameters: data,
				   successCallBackParameters:{ "event": event},
	    		   loader: 'normal',
		};
	    webservice.postJSON(url, options);				
		
	};
	//Function to render with the updated screen
	this.fetchCompletedOfUpdateApi = function(data, requestParams){
		var url = "/admin/hotel_brands";
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
	//Function save new brands
	this.saveNewApi = function(event){
		var brandName = $.trim(that.myDom.find("#brand-name").val());
		var webservice = new WebServiceInterface();
		var url = '/admin/hotel_brands/create';
		
		if(typeof url === 'undefined' || url == "#" )
			return false;
		
		var data = {'name':brandName  };
	    var options = {
				   successCallBack: that.fetchCompletedOfSaveNewApi,
				   requestParameters: data,
				   successCallBackParameters:{ "event": event},
	    		   loader: 'normal',
		};
	    webservice.postJSON(url, options);				
		
	};
	//Function to render with the updated screen and success/error messages
	this.fetchCompletedOfSaveNewApi = function(data, requestParams){
		var url = "/admin/hotel_brands";
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

};