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
    //that.myDom.find('#upgrade-back-button').on('click',that.upgradeBackButtonClicked);
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
    e.preventDefault();
  	var upsellAmountId = $(this).attr('data-value');
  	var roomNumberSelected = $(this).attr('data-room-number');
  	var reservationId = that.reservation_id;
  	var postParams = {"reservation_id": reservationId, "upsell_amount_id": upsellAmountId};
  	$('#reservation-'+reservationId+'-room-number').html("");
    var roomHtml = "<strong class='room-number ready'>"+roomNumberSelected+"</strong>";
    $('#reservation-'+reservationId+'-room-number').html(roomHtml);

    if(that.viewParams.next_view == "staycard"){
		that.gotoStayCard(); 
    }
    else if (that.viewParams.next_view == "registration"){
    	that.gotoBillCard(); 
    }
    
  	$.ajax({
        type:       'POST',
        url:        "/staff/reservations/upgrade_room",
        data: postParams,
        dataType:   'json',
        success: function(response){
          if(response.status == "success"){
          }else if(response.status == "failure"){
          }
        },
        error: function(){
        }
    });

    if(that.viewParams.next_view == "staycard"){
      that.gotoStayCard();
    }
    else if(that.viewParams.next_view =="registration"){
      that.gotoBillCard();
    }


  };

  this.noThanksButtonCicked = function(e){     
  	  e.preventDefault(); 
      that.gotoBillCard(); 
  };
  
  /*this.upgradeBackButtonClicked = function(e){  
  	  e.preventDefault();	
  	  that.gotoStayCard();  	
  };*/
  this.gotoStayCard = function(){
    goBackToView("", "view-nested-second", "move-from-left");
  };

  this.gotoBillCard = function(){
      //var viewURL = "ui/show?haml_file=staff/reservations/bill_card&json_input=registration_card/registration_card.json&is_hash_map=true&is_layout=false&reservation_id=4";
      var viewURL = "ui/show?haml_file=staff/reservations/bill_card&json_input=registration_card/registration_card.json&is_hash_map=true&is_layout=false";
      var viewDom = $("#view-nested-third");
      var params = {"reservation_id": that.reservation_id};
      var nextViewParams = {"showanimation": true, "from-view" : "room_upgrades_view"};
      sntapp.fetchAndRenderView(viewURL, viewDom, params, true, nextViewParams );
  };
};