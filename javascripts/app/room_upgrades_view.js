var RoomUpgradesView = function(viewDom){
  BaseView.call(this);
  var that = this;
  this.myDom = viewDom;

  this.pageinit = function(){
  	this.createViewScroll();
  };

  this.delegateEvents = function(){
  	that.myDom.find('#upgrade-room-select').on('click',that.roomUpgradeSelected);
  };

  this.executeLoadingAnimation = function(){
  changeView("nested-view", "", "view-nested-first", "view-nested-second", "move-from-right", false); 

	};

	this.createViewScroll = function(){
	if (viewScroll) { destroyViewScroll(); }
	      setTimeout(function(){
	        if (that.myDom.find($('#room-upgrades')).length) { createViewScroll('#room-upgrades'); }
	      }, 300);
  };

  this.roomUpgradeSelected = function(e){
  	var upsellAmountId = $(this).attr('data-value');
  	var roomNumberSelected = $(this).attr('data-room-number');
  	var reservationId = getReservationId();
  	var postParams = {"reservation_id": reservationId, "upsell_amount_id": upsellAmountId};

  	$('#reservation-'+reservationId+'-room-number').html("");
    var roomHtml = "<strong class='room-number ready'>"+roomNumberSelected+"</strong>";
    $('#reservation-'+reservationId+'-room-number').html(roomHtml);
  	/*$.ajax({
        type:       'POST',
        url:        "/staff/reservation/modify_reservation",
        data: postParams,
        dataType:   'json',
        success: function(response){
          if(response.status == "success"){
            console.log("room successfully updated")
          }else if(response.status == "failure"){
            console.log(response.errors[0]);
          }
        },
        error: function(){
            console.log("error");
        }
    });*/

  };
}