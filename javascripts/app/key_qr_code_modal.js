// Modal to show QR Code
var KeyQrCodeModel = function(gotoStayCard,gotoSearch) {
	BaseModal.call(this);
	var that = this;
	this.reservation_id = getReservationId();
	//this.url = "staff/reservations/" + that.reservation_id + "/get_key_on_tablet";
	this.url = "/ui/show?haml_file=modals/keys/keyQrCodeModal&json_input=stay_card/key_qr_code.json&is_hash_map=true&is_partial=true";

	this.delegateEvents = function() {
		
		// Setting style and attributes to the modal.
		$("#modal").addClass("ui-draggable");
		$("#modal").attr("data-position", "bottom-right");
		
		that.myDom.find('#goto-staycard').on('click', that.clickedGotoStayCard);
		that.myDom.find('#goto-search').on('click', that.clickedGotoSearch);
		
		if(this.params.origin == views.BILLCARD){
			that.myDom.find('#modal-close').remove();
			$("#modal-overlay").css("pointer-events","none");
			$("#modal-overlay").unbind( "click" );
		}
		if(this.params.origin == views.STAYCARD){
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
	
	this.resetStyle = function(e) {
		// Re-Setting style and attributes to the modal.
		$("#modal").removeClass("ui-draggable");
		$("#modal").removeAttr("data-position");
	};
	
}; 