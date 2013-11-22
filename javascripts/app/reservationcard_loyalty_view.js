var ReservationCardLoyaltyView = function(domRef){
  BaseView.call(this);
  var that = this;
  this.myDom = domRef;

  this.pageinit = function(){
    bindLoyaltyUtilFunctions();
  }
  this.delegateEvents = function(){
  	that.myDom.find('.add-new-button').on('click', that.adddNewLoyaltyModal);
  	that.myDom.find('select.styled#loyalty').on('change', that.changedLoyaltyProgram);				
  }
  this.adddNewLoyaltyModal = function(){
  	var adddNewLoyaltyModal = new AdddNewLoyaltyModal();
    adddNewLoyaltyModal.initialize();
  }
  this.changedLoyaltyProgram = function(){
	var selectedOption = $(this).find('option:selected');
    var id = $(this).find('option:selected').attr('id');
    var reservation_id = getReservationId();
    
    if(id==""){
      clearSelectionUI();
    }
    else{
      resetSelectionUI();
    }
    $.ajax({
	    type: "POST",
	    url: 'staff/user_memberships/link_to_reservation',
	    data : {
	        "reservation_id": reservation_id,
	        "membership_id": id
	    },
	    success: function(data) {
	    },
	    error: function(){
		}
	});
  }
};


