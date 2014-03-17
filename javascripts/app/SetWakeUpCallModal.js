var SetWakeUpCallModal = function() {

	BaseModal.call(this);
	var that = this;
	this.myDom = "#modal";
	this.url = "wakeup/wakeup_calls";
	this.reservationId = getReservationId();

	this.delegateEvents = function() {
		that.myDom.find('#set-wake-up-call #save-wakeup-call').on('click', that.saveWakeUpCall);
		that.myDom.find('.switch-button#wakeupDate').on('click', that.onOffSwitchWakeupDate);
		that.myDom.find('#set-wake-up-call #wake-up-hour, #set-wake-up-call #wake-up-minute, #set-wake-up-call #wake-up-primetime')	
														.on('change', that.changedWakeUpTime);
		that.myDom.find('#set-wake-up-call #delete-wakeup-call').on('click', that.deleteWakeUpCall);
		
	};

	this.modalInit = function() {

	};

	this.fetchCompletedOfSetWakeUpCall = function(data, requestParameters){
		that.hide();
		that.backDom.find("#reservation_card_wake_up_time").html(requestParameters['wakeUpTime']);
	};
	this.fetchFailedOfSave = function(errorMessage){
	 	sntapp.notification.showErrorMessage("Error: " + errorMessage, that.myDom);  
	};
	
    //function to save wake up call
	this.saveWakeUpCall = function() {
		
		var wakeUpHour = that.myDom.find('#set-wake-up-call #wake-up-hour').val();
		var wakeUpMinute = that.myDom.find('#set-wake-up-call #wake-up-minute').val();
		var wakeUpPrimetime = that.myDom.find('#set-wake-up-call #wake-up-primetime').val();
		var wakeUpTime = wakeUpHour+":"+wakeUpMinute+" "+wakeUpPrimetime;
		var wakeUpday = that.myDom.find('#set-wake-up-call #wakeupDate').hasClass('on') ? "Tomorrow":"Today";

		var data = {
			"reservation_id" : that.reservationId,
			"wake_up_time" : wakeUpTime,
			"day" : wakeUpday
		};

		var webservice = new WebServiceInterface();
		
	    var url = 'wakeup/set_wakeup_calls'; 
	    var options = {
	    		requestParameters: data,
				successCallBack: that.fetchCompletedOfSetWakeUpCall,
				failureCallBack: that.fetchFailedOfSave,
				successCallBackParameters: {'wakeUpTime': wakeUpTime},				
				loader : "BLOCKER"
		};
	    webservice.postJSON(url, options);

	};
    
	this.onOffSwitchWakeupDate = function() {
		var onOffSwitch = '.switch-button#wakeupDate';

		$(onOffSwitch).each(function(){
	        var onOff = $(this),
	            onOffChecked = 'on',
	            onOffDisabled = 'disabled',
	            onOffInput = 'input[type="checkbox"]';

	        if (onOff.children(onOffInput).length) {
	            onOff.removeClass(onOffChecked);

	            onOff.children(onOffInput + ':checked').each(function(){
	                onOff.addClass(onOffChecked);
	            });

	            onOff.children(onOffInput + ':disabled').each(function(){
	                onOff.addClass.addClass(onOffDisabled);
	            });
	        }
	    });
	};
    // Function to enable/disable buttons
	this.changedWakeUpTime = function() {

		var wakeUpHour = that.myDom.find('#set-wake-up-call #wake-up-hour option:selected').val();
		var wakeUpMinute = that.myDom.find('#set-wake-up-call #wake-up-minute option:selected').val();
		var wakeUpPrimetime = that.myDom.find('#set-wake-up-call #wake-up-primetime option:selected').val();
		var is_disable_delete = that.myDom.find('#delete-wakeup-call').attr("data-disabled-delete");
		if((wakeUpHour == "")||(wakeUpMinute == "")||(wakeUpPrimetime == "")){
			that.myDom.find("#save-wakeup-call").parent().addClass('is-disabled');
			that.myDom.find("#save-wakeup-call").attr("disabled", true);
			//that.myDom.find("#delete-wakeup-call").attr("disabled", true);
		}
		else if(is_disable_delete == "true"){
			that.myDom.find("#save-wakeup-call").attr("disabled", false);
			//that.myDom.find("#delete-wakeup-call").attr("disabled", false);
		}
		else{
			that.myDom.find("#save-wakeup-call").attr("disabled", false);
			//that.myDom.find("#delete-wakeup-call").attr("disabled", false);
		}

	};

	this.fetchCompletedOfDeleteWakeUpCall = function(data){
		that.hide();
		that.backDom.find("#reservation_card_wake_up_time").html("Not Set");
		sntapp.notification.showSuccessMessage("Deleted Successfully", that.myDom);
	};
	// function to delete wake up call
    this.deleteWakeUpCall = function() {
    	
    	var data = {
			"reservation_id" : that.reservationId,
		};
		var webservice = new WebServiceInterface();
		
	    var url = 'wakeup/set_wakeup_calls'; 
	    var options = {
	    		requestParameters: data,
				successCallBack: that.fetchCompletedOfDeleteWakeUpCall,
				failureCallBack: that.fetchFailedOfSave,
				loader : "BLOCKER"
		};
	    webservice.postJSON(url, options);
    	
    };
};