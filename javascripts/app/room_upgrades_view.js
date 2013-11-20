var RoomUpgradesView = function(viewDom){
  BaseView.call(this);
  var that = this;
  this.myDom = viewDom;
  this.reservation_id = getReservationId();
  this.pageinit = function(){

  	this.createViewScroll();
    /*If the room upgrades is not rendered through the check-in process 
    (navigated to upsell screen by pressing the upgrade button), 
    do not show the no-thanks button
    */
    if(that.viewParams.next_view == "staycard"){
        that.myDom.find('#no-thanks').hide();
    }

  };

  this.delegateEvents = function(){  
  	that.myDom.find('#upgrade-room-select').on('click',that.roomUpgradeSelected);
    that.myDom.find('#no-thanks').on('click',that.noThanksButtonCicked);
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
  	var reservationId = that.reservation_id;
  	var postParams = {"reservation_id": reservationId, "upsell_amount_id": upsellAmountId};
  	$('#reservation-'+reservationId+'-room-number').html("");
    var roomHtml = "<strong class='room-number ready'>"+roomNumberSelected+"</strong>";
    $('#reservation-'+reservationId+'-room-number').html(roomHtml);

    if(that.viewParams.next_view == "staycard"){
		e.preventDefault();
	   	var viewURL = "staff/staycards/staycard";
	   	var viewDom = $("#view-nested-second");
	   	var params = {"id": that.reservation_id};
	   	sntapp.fetchAndRenderView(viewURL, viewDom, params, false);
    }
    else if (that.viewParams.next_view == "registration"){
    	e.preventDefault();    	 
	   	var viewURL = "staff/reservation/bill_card";
	   	var viewDom = $("#view-nested-first");
	   	var params = {"reservation_id": that.reservation_id};
	   	sntapp.fetchAndRenderView(viewURL, viewDom, params, false);

    }
    
  	$.ajax({
        type:       'POST',
        url:        "/staff/reservations/upgrade_room",
        data: postParams,
        dataType:   'json',
        success: function(response){
          if(response.status == "success"){
            console.log("room successfully updated");
          }else if(response.status == "failure"){
            console.log(response.errors[0]);
          }
        },
        error: function(){
            console.log("error");
        }
    });

  };

  this.noThanksButtonCicked = function(e){
    e.preventDefault();      
      var viewURL = "staff/reservation/bill_card";
      var viewDom = $("#view-nested-first");
      var params = {"reservation_id": that.reservation_id};
      sntapp.fetchAndRenderView(viewURL, viewDom, params, false);
  };
};