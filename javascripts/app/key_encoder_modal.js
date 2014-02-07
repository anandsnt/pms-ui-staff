var KeyEncoderModal = function(gotoStayCard, gotoSearch) {
	BaseModal.call(this);
	var that = this;
	var reservation_id = getReservationId();
	//this.url = "staff/reservations/" + reservation_id + "/get_key_setup";
	this.url = "/ui/show?haml_file=modals/keys/print_keys_common&json_input=stay_card/key_email.json&is_hash_map=true&is_partial=true";
	
	this.delegateEvents = function() {
		that.myDom.find('#try-again').on('click', that.showDeviceConnectingMessge);
		that.myDom.find('#cancel').on('click', function(){ that.hide();});
		
		/*if(this.params.origin == views.BILLCARD){
			that.myDom.find('#modal-close').remove();
			$("#modal-overlay").css("pointer-events","none");
			$("#modal-overlay").unbind( "click" );
		}
		if(this.params.origin == views.STAYCARD){
			that.myDom.find("#goto-staycard").hide();
			that.myDom.find("#goto-search").hide();
		}*/
	};

	this.modalDidShow = function() {

		that.showDeviceConnectingMessge();

		if(that.params.reservationStatus == "CHECKING_IN") {
			that.myDom.find('#print-key').addClass('check-in');
			that.myDom.find('#room-status .message').text('Check in Complete');

		} else if(that.params.reservationStatus == "CHECKEDIN") {
			that.myDom.find('#print-key').addClass('inhouse');
			that.myDom.find('#modal-close').addClass('blue');
			that.myDom.find('#room-status .message').text('In House');

		} else if(that.params.reservationStatus == "CHECKING_OUT") {
			that.myDom.find('#print-key.modal').addClass('check-out');
			that.myDom.find('#modal-close').addClass('red');
			that.myDom.find('#room-status .message').text('Checking Out')
		}

		if(that.params.origin == views.BILLCARD){
			that.myDom.find('#modal-close').remove();
			$("#modal-overlay").css("pointer-events","none");
			$("#modal-overlay").unbind( "click" );
		}

	};

	this.showDeviceConnectingMessge = function(){
		that.myDom.find('#room-status, #key-status').removeClass('not-connected').addClass('connecting');
		that.myDom.find('#key-status .status').removeClass('error').addClass('pending').text('Connecting to Key Card Reader ...');
		that.myDom.find('#key-action').hide();
		setTimeout(function(){
			that.deviceNotConnected();
		}, 7000)
	};

	this.deviceConnected = function(){
		
	};

	this.deviceNotConnected = function(){
		that.myDom.find('#room-status, #key-status').removeClass('connecting').addClass('not-connected');
		that.myDom.find('#key-status .status').removeClass('pending').addClass('error').text('Error connecting to Key Card Reader!');
		that.myDom.find('#key-action').show()
	};
	// To handle Goto StayCard
	this.clickedGotoStayCard = function() {
		gotoStayCard();
		that.hide();
	};
	// To handle Goto Search
	this.clickedGotoSearch = function() {
		gotoSearch();
		that.hide();
	};
}; 