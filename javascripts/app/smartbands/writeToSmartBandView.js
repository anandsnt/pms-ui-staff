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
		that.myDom.find('#cancel').on('click', that.parentController.hide);
		that.myDom.on('click', that.clickedOnMyDom);
	};

	/**
	* function to execute on clicking done button, will show the listing page with updated data
	*/
	that.clickedDoneButton = function(){
		that.parentController.getControllerObject('smartband-listing').addRow(that.data);
		that.data = {};
		that.parentController.showPage('smartband-listing');
	};

	/*
	* function to execute on clicking next band button, wil show add new band button page
	*/
	that.clickedNextBandButton = function(){	
		that.parentController.getControllerObject('smartband-listing').addRow(that.data);
		that.data = {};	
		that.parentController.showPage('add-new-smartband');
	};

	/**
	* function to handle the failure case of save API
	*/
	this.failureCallbackOfSaveAction = function(errorMessage){
		sntapp.notification.showErrorMessage(errorMessage, that.myDom);
	};

	/**
	* Set the selected band type - fixed room/open charge to the band
	*/
	this.writeBandType = function(){
		var args = [];
		var bandType = '00000002';
		if(that.data.is_fixed){
			bandType = '00000001';
		}
		args.push(bandType);
		args.push(that.data.account_number);
		args.push('19');//Block Address - hardcoded

		var options = {
			//Cordova write success callback
			'successCallBack': function(){
				sntapp.activityIndicator.hideActivityIndicator();
				that.myDom.find(".success").show();
				that.myDom.find("#button-area").show();	
				that.myDom.find("#not-ready-status").hide();
				that.myDom.find("#cancel").hide();			
				that.parentController.showButton('see-all-band-button');
				that.parentController.myDom.find('#see-all-band-button').unbind('click');
				that.parentController.myDom.find('#see-all-band-button').on('click', that.clickedOnSeeAllBands);
				
			},
			'failureCallBack': function(message){
				sntapp.activityIndicator.hideActivityIndicator();
				if(message == undefined || message == ''){
					message = 'Failed to write the band type';
				}
				that.failureCallbackOfSaveAction(message);
				
			},
			arguments: args
		};
		if(sntapp.cardSwipeDebug){
			sntapp.cardReader.setBandTypeDebug(options);
		}
		else{
			sntapp.cardReader.setBandType(options);
		}

	};

	/**
	* function to handle the success case of save API, will change our data
	*/
	this.successCallbackOfSaveAction = function(data){		
		that.data.id = data.id;
		that.writeBandType();	
	};

	/**
	* function to handle click on see all bands button, will do some action after that it will revert
	* it's binding to old.
	*/
	this.clickedOnSeeAllBands = function(event){
		that.clickedDoneButton();
		that.parentController.myDom.find('#see-all-band-button').unbind('click');
		that.parentController.myDom.find('#see-all-band-button').on('click', that.parentController.seeAllBandsClicked);
	};


	/**
	* function to execute for successful card reading, will do enabling outside click & call api
	*/
	this.fetchSuccessKeyRead = function(accountNumber){
		sntapp.activityIndicator.hideActivityIndicator();
		that.data.account_number = accountNumber;
		
		var url = '/api/reservations/' + that.parentController.reservationID + '/smartbands';
	    var options = { 
			requestParameters: JSON.stringify(that.data),
			successCallBack: that.successCallbackOfSaveAction,
			failureCallBack: that.failureCallbackOfSaveAction,
			loader: 'blocker',
			async: false
	    };

		var webservice = new NewWebServiceInterface();	    			
    	webservice.postJSON(url, options);	
	};

	/**
	* function to execute when card reading failed, will do enabling outside click & show error message
	*/
	this.fetchFailedKeyRead = function(){
		sntapp.activityIndicator.hideActivityIndicator();
		sntapp.notification.showErrorMessage('Failed to read from device', that.myDom);
	};


  	this.pageshow = function(){
		that.myDom.find("#not-ready-status").show();
		that.myDom.find("#cancel").show();	
		that.myDom.find(".success").hide();
		that.myDom.find("#button-area").hide();
		// a special case for see all bands button here, it appears only after the successful api call,
		// so it should perform when we press the Done button
		that.parentController.hideButton('see-all-band-button');

    	that.parentController.hideButton('add-new-button');
		sntapp.activityIndicator.showActivityIndicator('BLOCKER');
		//TODO: code for reading the cardid
		var options = {
			'successCallBack': that.fetchSuccessKeyRead,
			'failureCallBack': that.fetchFailedKeyRead			
		};	
		if(sntapp.cardSwipeDebug){
			sntapp.cardReader.retrieveUserIDDebug(options);
		}
		else{
			sntapp.cardReader.retrieveUserID(options);
		}

    };

    this.clickedOnMyDom = function(event){
		sntapp.notification.hideMessage(that.myDom);	
	};
};