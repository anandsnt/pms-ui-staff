var SetWakeUpCallModal = function() {

	BaseModal.call(this);
	var that = this;
	this.myDom = "#modal";
	this.url = "wakeup/wakeup_calls";
	this.reservationId = getReservationId();
	
	this.delegateEvents = function() {
		that.myDom.find('#set-wake-up-call #save-wakeup-call').on('click', that.saveWakeUpCall);
		that.myDom.find('.switch-button#wakeupDate').on('click', that.onOffSwitchWakeupDate);
		that.myDom.find('select.styled#wake-up').on('change', that.changedWakeUpTime);
		that.myDom.find('#set-wake-up-call #delete-wakeup-call').on('click', that.deleteWakeUpCall);
	};

	this.modalInit = function() {

	};

	this.saveWakeUpCall = function() {

		var wakeUpTime = that.myDom.find('#set-wake-up-call #wakeup-time').attr('value');
		var wakeUpDay = that.myDom.find('#set-wake-up-call #wakeup-day').text();
		var wakeUpDaySplit = wakeUpDay.split(" ");

		var data = {
			"reservation_id" : that.reservationId,
			"wake_up_time" : wakeUpTime,
			"day" : wakeUpDaySplit[0]
		};
		
		$.ajax({
			type : "POST",
			url : 'wakeup/set_wakeup_calls',
			data : data,
			success : function(data) {
				if (data.status == "success") {
					that.hide();
					$("#reservation_card_wake_up_time").html(wakeUpTime);
				}
			},
			error : function() {
				alert("Sorry, not there yet!");
			}
		});

	};

	this.onOffSwitchWakeupDate = function() {
		var onOffSwitch = '.switch-button#wakeupDate';
		$(onOffSwitch).each(function() {
			var onOff = $(this), onOffChecked = 'on', onOffDisabled = 'disabled', onOffInput = 'input[type="checkbox"]', text = '.value', textOn = onOff.attr('data-on'), textOff = onOff.attr('data-off');

			if (onOff.children(onOffInput).length) {
				onOff.removeClass(onOffChecked);
				onOff.find(text).text(textOff);

				onOff.children(onOffInput + ':checked').each(function() {
					onOff.addClass(onOffChecked);
					onOff.find(text).text(textOn);
				});

				onOff.children(onOffInput + ':disabled').each(function() {
					onOff.addClass.addClass(onOffDisabled);
					onOff.find(text).text('');
				});
			}
		});

	};

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
	
    this.deleteWakeUpCall = function() {
    	
    	var data = {
			"reservation_id" : that.reservationId,
		};
		$.ajax({
			type : "POST",
			url : 'wakeup/set_wakeup_calls',
			data : data,
			success : function(data) {
				if (data.status == "success") {
					that.hide();
					$("#reservation_card_wake_up_time").html("Not Set");
				}
			},
			error : function() {
				alert("Sorry, not there yet!");
			}
		});
    	
    };
};