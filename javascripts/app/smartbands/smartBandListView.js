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
		that.myDom.on('click', that.clickedOnMyDom);
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
		var reservationStatus = getReservationStatus();
		//In checked out reservations, we can not add edit smartbands
		//can only view them
		if(reservationStatus == 'CHECKEDOUT'){
			return false;
		}

		if(getParentWithSelector(event, "li")){
			var target = $(event.target);
			var id = target.data("id");
			var is_fixed = target.data("is-fixed");
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

	}

	this.addRow = function(rowToAppend){

		var html = "<li data-id = "+ rowToAppend.id + " data-is-fixed = " + rowToAppend.is_fixed+ ">";
		html += "<span class=smartband-icon></span>";
		html += "<span class=band-holder>" + rowToAppend.first_name + " " + rowToAppend.last_name  + "</span>";

		if(rowToAppend.is_fixed == true){
			var amount = parseFloat(rowToAppend.amount ).toFixed(2);
			html += "<span class=charge>" + that.myDom.find("#listing-area").data("currency-symbol") + " " + amount + "</span>";
		}
		else{
			html += "<span class=charge> OPEN ROOM CHARGE </span>";
		}
		var accountNum = rowToAppend.account_number.substr(rowToAppend.account_number.length - 4);
		html += "<span class=account-num>" + accountNum + "</span>";

		that.myDom.find("#listing-area ul").prepend(html);
		createVerticalScroll('#listing-area'); 
	};

	this.updateRow = function(rowToChange){
		var row = that.myDom.find("#listing-area ul li[data-id=" + rowToChange.id + "]");
		row.find('span.band-holder').html(rowToChange.first_name + " " + rowToChange.last_name);
		var accountNum = rowToChange.account_number.substr(rowToChange.account_number.length - 4);
		row.find('span.account-num').html(accountNum);
		var amount = parseFloat(rowToChange.amount).toFixed(2);
		row.find('span.charge').html(that.myDom.find("#listing-area").data("currency-symbol") + " " + amount);
	}
	this.clickedOnMyDom = function(event){
		sntapp.notification.hideMessage(that.myDom);	
	};



};