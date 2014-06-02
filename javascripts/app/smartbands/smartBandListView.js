/**
* model class for smart band listing
*
*/

var SmartBandListView = function(domRef) {
	BaseView.call(this);
	this.myDom = domRef;	
	var that = this;	


	this.delegateEvents = function() {		
		that.myDom.find('#listing-area ul').on('click', that.clickedOnSmartband);
		that.myDom.find("#close-popup").on('click', that.parentController.hide);
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
	this.successCallbackOfGetDetails = function(data, successCallBackParameters){
		data.id = successCallBackParameters.id;
		that.parentController.getControllerObject('update-card-info').data = data;
		that.parentController.showPage('update-card-info');
	}

	/**
	* function to handle on each smarband click, which means on li
	*/
	this.clickedOnSmartband = function(event){	
		if(getParentWithSelector(event, "li")){
			var target = $(event.target);
			var id = target.data("id");
			var is_fixed = target.data("is-fixed");

			if(is_fixed){
				var webservice = new NewWebServiceInterface();
				
				var url = '/api/smartbands/' + id;
			    var options = { 
					successCallBack: that.successCallbackOfGetDetails,
					failureCallBack: that.failureCallbackOfGetDetails,
					successCallBackParameters:{ "id": id},
					loader: 'blocker',
					async: false
			    };
				// we prepared, we shooted!!	    			
			    webservice.getJSON(url, options);	
			}
			else{

			}
		}

	}

	this.addRow = function(rowToAppend){

		var html = "<li data-id = "+ rowToAppend.id + " data-is-fixed = " + rowToAppend.is_fixed+ ">";
		html += "<span class=smartband-icon></span>";
		html += "<span class=band-holder>" + rowToAppend.first_name + " " + rowToAppend.last_name  + "</span>";
		if(rowToAppend.is_fixed == true){
			html += "<span class=charge>" + that.myDom.find("#listing-area").data("currency-symbol") + " " + rowToAppend.amount + "</span>";
		}
		else{
			html += "<span class=charge> OPEN ROOM CHARGE </span>";
		}
		that.myDom.find("#listing-area ul").prepend(html);
		createVerticalScroll('#listing-area'); 
	}



};