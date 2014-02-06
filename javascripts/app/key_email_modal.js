var KeyEmailModal = function(gotoStayCard,gotoSearch) {
	BaseModal.call(this);
	var that = this;
	var reservation_id = getReservationId();
	
	//this.url = "staff/reservations/" + reservation_id + "/get_key_setup";
	this.url = "/ui/show?haml_file=modals/keys/keyEmailModal&json_input=stay_card/key_email.json&is_hash_map=true&is_partial=true";
	
	this.delegateEvents = function() {
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
		that.hide();
	};
	// To handle Goto Search
	this.clickedGotoSearch = function() {
		gotoSearch();
		that.hide();
	};
}; 