var CheckoutSuccessModal = function(callBack) {
	BaseModal.call(this);
	var that = this;
	this.url = "ui/checkoutSuccessModal";

	this.delegateEvents = function() {
		var message = this.params.message;
		that.myDom.find('.message').html(message);
		that.myDom.find('#modal-close,#ok').on('click',that.okButtonClicked);
		$('#modal-overlay').on('click', that.okButtonClicked);
	};
	
	this.okButtonClicked = function(){
		var checkinInspectedOnly = $("#headerDetails").attr('data-checkin-inspected-only');
		var roomNumber = $("#headerDetails").attr('data-room-number');
		var isReady = that.myDom.find(".switch-button").hasClass('on');
		
		if(isReady){
			/*
			 * "hkstatus_id": 1 for CLEAN
			 * "hkstatus_id": 2 for INSPECTED
			 */
			if(checkinInspectedOnly === "true"){
				var data  = { "hkstatus_id": 2, "room_no":roomNumber };
			}
			else{
				var data  = { "hkstatus_id": 1, "room_no":roomNumber };
			}
			// API call for make room as READY
			var webservice = new WebServiceInterface();
			var options = {
				requestParameters : data,
				successCallBack : that.hide(callBack)
			};
			webservice.postJSON('/staff_house_keeping/change_house_keeping_status', options);
		}
		else{
			that.hide(callBack);
		}
	};
};