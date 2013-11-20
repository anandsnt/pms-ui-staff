var RoomUpgradesView = function(viewDom){
  BaseView.call(this);
  var that = this;
  this.myDom = viewDom;

  this.pageinit = function(){

  	this.createViewScroll();
  	//$('#roomupgrades_main').attr('data-next-view', this.viewParams.next_view);
  	console.log(this.viewParams);
  };

  this.delegateEvents = function(){
  	that.myDom.find('#upgrade-room-select').on('click',that.roomUpgradeSelected);
  };

  this.executeLoadingAnimation = function(){
  changeView("nested-view", "", "view-nested-first", "view-nested-second", "move-from-right", false); 

	};

	this.createViewScroll = function(){
	  // We need to calculate width of the horizontal list based on number of items
  var $containerWidth = $('#room-upgrades').width(),
    $scrollable = $('#room-upgrades').find('.wrapper'),
    $items = $('#room-upgrades').find('.wrapper > li').size(),
    $itemsWidth = ($items * 460) + 10; // * 460 is single item width, + 10 is padding

  if ($itemsWidth > $containerWidth)
  {
    $($scrollable).css({ 'width' : $itemsWidth + 'px' });
    
    if (horizontalScroll) { destroyHorizontalScroll(); }
      setTimeout(function(){
        createHorizontalScroll('#room-upgrades');
        refreshHorizontalScroll();
      }, 300);
  }
  };


  this.roomUpgradeSelected = function(e){
  	var upsellAmountId = $(this).attr('data-value');
  	var roomNumberSelected = $(this).attr('data-room-number');
  	var reservationId = getReservationId();
  	var postParams = {"reservation_id": reservationId, "upsell_amount_id": upsellAmountId};
  	$('#reservation-'+reservationId+'-room-number').html("");
    var roomHtml = "<strong class='room-number ready'>"+roomNumberSelected+"</strong>";
    $('#reservation-'+reservationId+'-room-number').html(roomHtml);

    if(that.viewParams.next_view == "staycard"){

    	//TODO: got to staycard
    }else if (that.viewParams.next_view == "registration"){
    	e.preventDefault();
    	//TODO: got to registarion 
    }
    console.log(postParams);
  	$.ajax({
        type:       'POST',
        url:        "/staff/reservations/upgrade_room",
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
    });

  };
};