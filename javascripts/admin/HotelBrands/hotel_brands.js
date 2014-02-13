var HotelBrandsView = function(domRef){
  
	BaseInlineView.call(this);  
	this.myDom = domRef;
	var that = this;
    //Function to update API
	this.updateApi = function(event){
		var brandName = $.trim(that.myDom.find("#brand-name").val());
		var brandID = that.myDom.find("#edit-brand-details").attr("data-brand-id");		
		var hotelChainId = that.myDom.find("#hotel-chain").val(); 
		var webservice = new WebServiceInterface();
		var url = '/admin/hotel_brands/'+brandID;
		
		if(typeof url === 'undefined' || url == "#" )
			return false;
		
		var data = {'value': brandID, 'name':brandName, 'hotel_chain_id':  hotelChainId};
	    var options = {
				   successCallBack: that.fetchCompletedOfSave,
				   failureCallBack: that.fetchFailedOfSave,
				   requestParameters: data,
				   successCallBackParameters:{ "event": event},
	    		   loader: 'normal',
		};
	    webservice.putJSON(url, options);				
		
	};
	//Function to render with the updated screen
	this.fetchCompletedOfSave = function(data, requestParams){
		var url = "/admin/hotel_brands";
	   	viewParams = {};
	  	sntapp.fetchAndRenderView(url, that.myDom, {}, 'BLOCKER', viewParams, false);
		sntapp.notification.showSuccessMessage("Saved Successfully", that.myDom);		
		that.cancelFromAppendedDataInline(requestParams['event']);  
		
	};
	//Handling failure
   this.fetchFailedOfSave = function(errorMessage){
	 sntapp.activityIndicator.hideActivityIndicator();
	 sntapp.notification.showErrorMessage("Error: " + errorMessage, that.myDom);  
   };
	//Function save new brands
	this.saveNewApi = function(event){
		var brandName = $.trim(that.myDom.find("#brand-name").val());
		var webservice = new WebServiceInterface();
		var url = '/admin/hotel_brands';
		var hotelChainId = that.myDom.find("#hotel-chain").val(); 
		if(typeof url === 'undefined' || url == "#" )
			return false;
		
		var data = {'name':brandName  , 'hotel_chain_id':  hotelChainId};
	    var options = {
				   successCallBack: that.fetchCompletedOfSave,
				   requestParameters: data,
				   successCallBackParameters:{ "event": event},
	    		   loader: 'normal',
		};
	    webservice.postJSON(url, options);				
		
	};
};