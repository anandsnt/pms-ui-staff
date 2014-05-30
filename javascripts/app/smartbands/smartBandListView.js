/**
* model class for smart band listing
*
*/

var SmartBandListView = function(domRef) {
	BaseView.call(this);
	this.myDom = domRef;	
	var that = this;	


	this.delegateEvents = function() {		
		that.myDom.find('#listing-area ul li').on('click', that.clickedOnSmartband);
	};

	this.pageshow = function(){
		// Set scrolling
    	createVerticalScroll('#listing-area');   
    	that.parentController.hideButton('see-all-band-button');
    	that.parentController.showButton('add-new-button');
    };

    /**
	* function to handle the failure case of save API
	*/
	this.failureCallbackOfGetDetails = function(errorMessage){
		sntapp.notification.showErrorMessage(errorMessage, that.myDom);
	}

	/**
	* function to handle the success case of save API,  will be calling writing interface
	*/
	this.successCallbackOfGetDetails = function(data){	
		that.parentController.getControllerObject('update-card-info').data = data;
		that.parentController.showPage('update-card-info');
	}

	/**
	* function to handle on each smarband click, which means on li
	*/
	this.clickedOnSmartband = function(event){
		var target = $(event.target);
		var id = target.attr("data-id");

		var webservice = new NewWebServiceInterface();
		
		var url = '/api/smartbands/' + id;
	    var options = { 
			successCallBack: that.successCallbackOfGetDetails,
			failureCallBack: that.failureCallbackOfGetDetails,
			loader: 'blocker',
			async: false
	    };
		// we prepared, we shooted!!	    			
	    webservice.getJSON(url, options);	
		
	}

	this.addRow = function(rowToAppend){
		var html = "<li data-id = "+ rowToAppend.id + ">";
		html += "<span class=smartband-icon></span>";
		html += "<span class=band-holder>" + rowToAppend.first_name + " " + rowToAppend.last_name  + "</span>";
		if(rowToAppend.is_fixed == true){
			html += "<span class=charge>" + rowToAppend.amount + "</span>";
		}
		else{
			html += "<span class=charge> OPEN ROOM CHARGE </span>";
		}
	}



};