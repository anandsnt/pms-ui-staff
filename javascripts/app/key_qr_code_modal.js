// Modal to show QR Code
var KeyQrCodeModel = function(gotoStayCard,gotoSearch) {
	BaseModal.call(this);
	var that = this;
	this.reservation_id = getReservationId();
	//this.url = "staff/reservations/" + that.reservation_id + "/get_key_on_tablet";
	this.url = "/ui/show?haml_file=modals/keys/keyQrCodeModal&json_input=stay_card/key_qr_code.json&is_hash_map=true&is_partial=true";

	this.delegateEvents = function() {
		that.myDom.find('#goto-staycard').on('click', that.clickedGotoStayCard);
		that.myDom.find('#goto-search').on('click', that.clickedGotoSearch);
		
		if(that.params.origin == views.BILLCARD){
			that.myDom.find('#modal-close').remove();
			$("#modal-overlay").unbind("click");
			$("#modal-overlay").addClass("locked");
		}
	};
	
	this.modalDidShow = function() {
		
		// Setting style and attributes to the modal.
		$("#modal").addClass("ui-draggable");
		$("#modal").attr("data-position", "bottom-right");
		
		if(that.params.reservationStatus == "CHECKING_IN") {
			that.myDom.find('.modal-content').addClass('check-in');
			that.myDom.find('#room-status .message').text('Check in Complete');

		} else if(that.params.reservationStatus == "CHECKEDIN") {
			that.myDom.find('.modal-content').addClass('inhouse');
			that.myDom.find('#modal-close').addClass('blue');
			that.myDom.find('#room-status .message').text('In House');

		} else if(that.params.reservationStatus == "CHECKING_OUT") {
			that.myDom.find('.modal-content').addClass('check-out');
			that.myDom.find('#modal-close').addClass('red');
			that.myDom.find('#room-status .message').text('Checking Out');
			// TODO Late checkout
			var html = "Checking Out <br />2:30 PM";
		}

		if(that.params.origin == views.STAYCARD){
			that.myDom.find("#goto-staycard").hide();
			that.myDom.find("#goto-search").hide();
		}
	};
	
	// To handle Goto StayCard
	this.clickedGotoStayCard = function() {
		gotoStayCard();
		that.hide(that.resetStyle);
	};
	// To handle Goto Search
	this.clickedGotoSearch = function() {
		gotoSearch();
		that.hide(that.resetStyle);
	};
	// To Re-setting style and attributes of the modal.
	this.resetStyle = function(e) {
		$("#modal-overlay").removeClass("locked");
		$("#modal").removeClass("ui-draggable");
		$("#modal").removeAttr("data-position");
	};
}; 