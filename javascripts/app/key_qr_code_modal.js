// Modal to show QR Code
var KeyQrCodeModel = function(gotoStayCard,gotoSearch) {
	BaseModal.call(this);
	var that = this;
	this.reservation_id = getReservationId();
	this.url = "staff/reservations/" + that.reservation_id + "/get_key_on_tablet";

	this.delegateEvents = function() {
		that.myDom.find('#goto-staycard').on('click', that.clickedGotoStayCard);
		that.myDom.find('#goto-search').on('click', that.clickedGotoSearch);
		$("#modal-overlay , #modal-close").on('click', that.closeButtonClicked);
	};
	
	this.modalDidShow = function() {
		
		// Make it draggable
		$("#modal").draggable();
		// Setting style and attributes to the modal.
		$("#modal").attr("data-position", "bottom-right");
		
		if(that.params.reservationStatus == "CHECKING_IN") {
			that.myDom.find('.modal-content').addClass('check-in');
			that.myDom.find('#room-status .message#status').text('Check in Complete');
			if(that.params.origin == views.STAYCARD){
				that.myDom.find('#room-status .message#status').text('Checking In');
			}
			that.myDom.find('#modal-close').addClass('green');

		} else if(that.params.reservationStatus == "CHECKEDIN") {
			that.myDom.find('.modal-content').addClass('inhouse');
			that.myDom.find('#modal-close').addClass('blue');
			that.myDom.find('#room-status .message#status').text('In House');

		} else if(that.params.reservationStatus == "CHECKING_OUT") {
			that.myDom.find('.modal-content').addClass('check-out');
			that.myDom.find('#modal-close').addClass('red');
			that.myDom.find('#room-status .message#status').text('Checking Out');
		}

		if(that.params.origin == views.BILLCARD){
			that.myDom.find('#modal-close').remove();
			$("#modal-overlay").unbind("click");
			$("#modal-overlay").addClass("locked");
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
	// To handle modal close
	this.closeButtonClicked = function() {
		that.hide(that.resetStyle);
	};
	// To Re-setting style and attributes of the modal.
	this.resetStyle = function(e) {
		$('#modal, #modal-overlay').removeClass('modal-show'); 
        setTimeout(function() { 
            $('#modal, #modal-overlay').remove();
        }, 150);
	};
}; 