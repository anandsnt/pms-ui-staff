var HotelChainsView = function(domRef){
  
	BaseInlineView.call(this);  
	this.myDom = domRef;
	var that = this;
	this.pageinit = function(){
		    
	};
	this.updateApi = function(event){
		var chainName = $.trim(that.myDom.find("#chain-name").val());
		var chainID = that.myDom.find("#edit-chain-details").attr("data-chain-id");		
		if(typeof chainName === 'undefined' || chainName === ""){
			alert('Please enter a valid chain name');
			return false;
		}
		else if(typeof chainID === 'undefined' || chainID === ""){ // rare case
			sntapp.notificationMessage.showErrorMessage('Some thing went wrong, please refresh the page and try again');
			return false;
		}
		else{
			var webservice = new WebServiceInterface();
			var url = '#';
			
			if(typeof url === 'undefined' || url == "#" )
				return false;
			
			var data = {'id': chainID, 'name':chainName  };
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
		// update the view of listing the chain listing
		
	};
	
	this.saveNewApi = function(){
		var chainName = $.trim(that.myDom.find("#chain-name").val());
		var chainID = that.myDom.find("#edit-chain-details").attr("data-chain-id");		
		if(typeof chainName === 'undefined' || chainName === ""){
			alert('Please enter a valid chain name');
			return false;
		}
		else if(typeof chainID === 'undefined' || chainID === ""){ // rare case
			sntapp.notificationMessage.showErrorMessage('Some thing went wrong, please refresh the page and try again');
			return false;
		}
		else{
			var webservice = new WebServiceInterface();
			var url = '#';
			
			if(typeof url === 'undefined' || url == "#" )
				return false;
			
			var data = {'id': chainID, 'name':chainName  };
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
		// update the view of listing the chain listing
		
	};	

};