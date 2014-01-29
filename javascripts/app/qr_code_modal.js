// Modal to show QR Code
var QrCodeModel = function(callBack) {
	BaseModal.call(this);
	var that = this;
	this.reservation_id = getReservationId();
	this.url = "staff/reservations/"+that.reservation_id+"/get_key_on_tablet";
	
	this.delegateEvents = function(){
		// Setting style and attributes to the modal.
		$("#modal").addClass("ui-draggable");
		$("#modal").attr("data-position","bottom-right");
		that.myDom.find('#modal-close').on('click', that.closeButtonClicked);
   };
   
   this.closeButtonClicked = function(e){
   		// To go back to search screen when close button clicked from registraion card.
	   	if(that.myDom.find('#modal-close').attr('data-reservation-status') == "CHECKING_IN"){
	   		callBack();
	   	}
   	
   };
};