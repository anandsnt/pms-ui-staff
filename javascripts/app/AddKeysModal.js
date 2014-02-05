var AddKeysModal = function(gotoStayCard,gotoSearch) {
	BaseModal.call(this);
	var that = this;
	var reservation_id = getReservationId();
	this.url = "staff/reservations/" + reservation_id + "/get_key_setup";
	this.delegateEvents = function() {
		
		that.myDom.find('#goto-staycard').on('click', that.clickedGotoStayCard);
		that.myDom.find('#goto-search').on('click', that.clickedGotoSearch);
		
	};
	this.modalInit = function() {

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