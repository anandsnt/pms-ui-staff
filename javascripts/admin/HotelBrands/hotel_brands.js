var HotelBrandsView = function(domRef){
  
	BaseInlineView.call(this);  
	this.myDom = domRef;
	var that = this;
	this.pageinit = function(){
		    
	};
	this.updateApi = function(event){
		var brandName = $.trim(that.myDom.find("#brand-name").val());
		var brandID = that.myDom.find("#edit-brand-details").attr("data-brand-id");		
		if(typeof brandName === 'undefined' || brandName === ""){
			alert('Please enter a valid brand name');
			return false;
		}
		else if(typeof brandID === 'undefined' || brandID === ""){ // rare case
			sntapp.notificationMessage.showErrorMessage('Some thing went wrong, please refresh the page and try again');
			return false;
		}
		else{
			var webservice = new WebServiceInterface();
			var url = '#';
			
			if(typeof url === 'undefined' || url == "#" )
				return false;
			
			var data = {'id': brandID, 'name':brandName  };
		    var options = {
					   successCallBack: that.fetchCompletedOfUpdateApi,
					   requestParameters: data,
		    		   loader: 'normal',
			};
		    webservice.postJSON(url, options);				
		}
	};
	
	this.fetchCompletedOfUpdateApi = function(data){
		sntapp.notificationMessage.showSuccessMessage('Successfully updated');
		// update the view of listing the brand listing
		
	};
	
	this.saveNewApi = function(){
		var brandName = $.trim(that.myDom.find("#brand-name").val());
		var brandID = that.myDom.find("#edit-brand-details").attr("data-brand-id");		
		if(typeof brandName === 'undefined' || brandName === ""){
			alert('Please enter a valid brand name');
			return false;
		}
		else if(typeof brandID === 'undefined' || brandID === ""){ // rare case
			sntapp.notificationMessage.showErrorMessage('Some thing went wrong, please refresh the page and try again');
			return false;
		}
		else{
			var webservice = new WebServiceInterface();
			var url = '#';
			
			if(typeof url === 'undefined' || url == "#" )
				return false;
			
			var data = {'id': brandID, 'name':brandName  };
		    var options = {
					   successCallBack: that.fetchCompletedOfSaveNewApi,
					   requestParameters: data,
		    		   loader: 'normal',
			};
		    webservice.postJSON(url, options);				
		}		
	};
	this.fetchCompletedOfSaveNewApi = function(data){
		sntapp.notificationMessage.showSuccessMessage('Successfully updated');
		// update the view of listing the brand listing
		
	};	

};