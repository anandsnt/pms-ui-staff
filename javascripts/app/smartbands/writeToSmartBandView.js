/**
* class for Hold smartband until ready & write
*
*/
var WriteToSmartBandView = function(domRef){

	BaseView.call(this);
	this.myDom = domRef;

	var that = this;
	this.data = {};

	this.delegateEvents = function(){ 
		that.myDom.find('#done-button').on('click', that.clickedDoneButton);
		that.myDom.find('#next-band-button').on('click', that.clickedNextBandButton);
	};

	/**
	* function to execute on clicking done button, will show the listing page with updated data
	*/
	that.clickedDoneButton = function(){
		that.parentController.getControllerObject('smartband-listing').addRow(that.data);
		that.data = {};
		that.parentController.showPage('smartband-listing');
	}

	/*
	* function to execute on clicking next band button, wil show add new band button page
	*/
	that.clickedNextBandButton = function(){	
		that.parentController.getControllerObject('smartband-listing').addRow(that.data);
		that.data = {};	
		that.parentController.showPage('add-new-smartband');
	}

	/**
	* function to handle the failure case of save API
	*/
	this.failureCallbackOfSaveAction = function(errorMessage){
		sntapp.notification.showErrorMessage(errorMessage, that.myDom);
	}

	/**
	* function to handle the success case of save API, will change our data
	*/
	this.successCallbackOfSaveAction = function(data){		
		that.data.id = data.id;	
	}  

  	this.pageshow = function(){
		that.parentController.disableOutsideClickClosing();
		that.myDom.find("#not-ready-status").show();
		that.myDom.find("#cancel").show();	
		that.myDom.find(".success").hide();
		that.myDom.find("#button-area").hide();

		//TODO: code for reading the cardid

		setTimeout(function(){
			that.myDom.find(".success").show();
			that.myDom.find("#button-area").show();	
			that.myDom.find("#not-ready-status").hide();
			that.myDom.find("#cancel").hide();	
			that.parentController.enableOutsideClickClosing();
			that.data.account_number = "33365774"; // TODO: need to call the api to read from device
			var url = '/api/reservations/' + that.parentController.reservationID + '/smartbands';
		    var options = { 
				requestParameters: that.data,
				successCallBack: that.successCallbackOfSaveAction,
				failureCallBack: that.failureCallbackOfSaveAction,
				loader: 'blocker',
				async: false
		    };
			// we prepared, we shooted!!
			var webservice = new NewWebServiceInterface();	    			
	    	webservice.postJSON(url, options);			
			
		}, 4000);
    };
};