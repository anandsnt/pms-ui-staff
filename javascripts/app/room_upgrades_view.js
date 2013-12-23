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
    if(that.viewParams.next_view == views.STAYCARD){
        that.myDom.find('#no-thanks').hide();
    }

  };

  this.delegateEvents = function(){  
  	that.myDom.find('#room-upgrades ul li #upgrade-room-select').on('click',that.roomUpgradeSelected);
    that.myDom.find('#no-thanks').on('click',that.noThanksButtonCicked);
    that.myDom.find('#upgrade-back-button').on('click',that.upgradeBackButtonClicked);
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


  this.fetchCompletedOfRoomUpgradeSelected = function(data){
      if(response.status == "success"){
    	  
      }else if(response.status == "failure"){
    	  
      }	  
  };
  
  this.roomUpgradeSelected = function(e){
    
    e.preventDefault();

    var upsellAmountId = $(this).attr('data-value');
    var roomNumberSelected = $(this).attr('data-room-number');
    var reservationId = that.reservation_id;
    var postParams = {"reservation_id": reservationId, "upsell_amount_id": upsellAmountId, "room_no": roomNumberSelected};

    var url = '/staff/reservations/upgrade_room';
	  var webservice = new WebServiceInterface();	
  	var successCallBackParams = {
  			'reservationId': reservationId,
  			'roomNumberSelected': roomNumberSelected, 
  	};	
  	var options = {
  			   requestParameters: postParams,
  			   successCallBack: that.upgradeSuccess,
  			   successCallBackParameters: successCallBackParams,
  			   loader: "BLOCKER"
  	};
	  webservice.postJSON(url, options);	

  };
	  
  this.upgradeSuccess = function(data, requestParams){

    var staycardView = new StayCard($("#view-nested-first"));
    currentReservation = requestParams['reservationId'];

    if(that.viewParams.next_view == views.STAYCARD){
      staycardView.refreshReservationDetails(currentReservation, that.gotoStayCard);
    }
    else if(that.viewParams.next_view == views.BILLCARD){
      staycardView.refreshReservationDetails(currentReservation, that.gotoBillCard);
    }

  };

  this.noThanksButtonCicked = function(e){     
  	  e.preventDefault(); 
      that.gotoBillCard(); 
  };
  
  this.upgradeBackButtonClicked = function(e){  
  	  e.preventDefault();	
  	  that.gotoStayCard();  	
  };

  this.gotoStayCard = function(){
    sntapp.activityIndicator.showActivityIndicator('blocker');
    changeView("nested-view", "", "view-nested-second", "view-nested-first", "move-from-left", false);  
  };

  this.gotoBillCard = function(){
    var viewURL = "staff/reservation/bill_card";
    var viewDom = $("#view-nested-third");
    var params = {"reservation_id": that.reservation_id};
    var nextViewParams = {"showanimation": true, "from-view" : views.ROOM_UPGRADES};
    sntapp.fetchAndRenderView(viewURL, viewDom, params, 'BLOCKER', nextViewParams );
  };
};