var SetWakeUpCallModal = function() {

	BaseModal.call(this);
	var that = this;
	this.myDom = "#modal";
	this.url = "wakeup/wakeup_calls";
	this.reservationId = getReservationId();
	
	this.delegateEvents = function() {
		that.myDom.find('#set-wake-up-call #save-wakeup-call').on('click', that.saveWakeUpCall);
		that.myDom.find('.switch-button#wakeupDate').on('click', that.onOffSwitchWakeupDate);
		that.myDom.find('select.styled#wake-up-hour').on('change', that.changedWakeUpTime);
		that.myDom.find('#set-wake-up-call #delete-wakeup-call').on('click', that.deleteWakeUpCall);
	};

	this.modalInit = function() {

	};

	this.fetchCompletedOfSetWakeUpCall = function(data, requestParameters){
		if (data.status == "success") {
			that.hide();
			$("#reservation_card_wake_up_time").html(requestParameters['wakeUpTime']);
		}
		else{
			sntapp.notification.showErrorList(data.errors, that.myDom);
		}
	};
    //function to save wake up call
	this.saveWakeUpCall = function() {
		
		var wakeUpHour = that.myDom.find('#set-wake-up-call #wake-up-hour').val();
		var wakeUpMinute = that.myDom.find('#set-wake-up-call #wake-up-minute').val();
		var wakeUpPrimetime = that.myDom.find('#set-wake-up-call #wake-up-primetime').val();
		var wakeUpTime = wakeUpHour+":"+wakeUpMinute+" "+wakeUpPrimetime;
		
		var wakeUpDay = that.myDom.find('#set-wake-up-call #wakeup-day').text();
		var wakeUpDaySplit = wakeUpDay.split(" ");

		var data = {
			"reservation_id" : that.reservationId,
			"wake_up_time" : wakeUpTime,
			"day" : wakeUpDaySplit[0]
		};
		
		var webservice = new WebServiceInterface();
		
	    var url = 'wakeup/set_wakeup_calls'; 
	    var options = {
	    		requestParameters: data,
				successCallBack: that.fetchCompletedOfSetWakeUpCall,
				successCallBackParameters: {'wakeUpTime': wakeUpTime},
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
		var selectedOption = $(this).find('option:selected').val();

		if(selectedOption == ""){
			that.myDom.find("#save-wakeup-call").removeClass("green");
			that.myDom.find("#delete-wakeup-call").removeClass("red");
			that.myDom.find("#save-wakeup-call").attr("disabled", true);
			that.myDom.find("#delete-wakeup-call").attr("disabled", true);
		}
		else {
			that.myDom.find("#save-wakeup-call").addClass("green");
			that.myDom.find("#delete-wakeup-call").addClass("red");
			that.myDom.find("#save-wakeup-call").attr("disabled", false);
			that.myDom.find("#delete-wakeup-call").attr("disabled", false);
		}
		that.myDom.find("#set-wake-up-call #wakeup-time").html("");
		that.myDom.find("#set-wake-up-call #wakeup-time").html(selectedOption);
		that.myDom.find("#set-wake-up-call #wakeup-time").attr("value", selectedOption);
	};
	this.fetchCompletedOfDeleteWakeUpCall = function(data){
		if (data.status == "success") {
			that.hide();
			$("#reservation_card_wake_up_time").html("Not Set");
		}		
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
		};
	    webservice.postJSON(url, options);
    	
    };
};