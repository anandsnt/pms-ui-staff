var StayCard = function(viewDom){
  BaseView.call(this);
  var that = this;
  this.myDom = viewDom;
  
  this.pageinit = function(){

    setUpStaycard(that.myDom);
    var currentConfirmNumber = $("#confirm_no").val();    
    var reservationDetails = new reservationDetailsView($("#reservation-"+currentConfirmNumber));
    reservationDetails.initialize();

    // ok we just entered staycard page
    sntapp.cardSwipeCurrView = 'StayCardView';

    // Start listening to card swipes
    this.initCardSwipe();

    // DEBUG
    // if ( $('#reservation-card').find('#current:visible').length ) {
    //   window.trigger = that.postCardSwipData;
    //   var swipedCardData = {
    //     cardType: 'VA',
    //     expiry: '1812',
    //     cardHolderName: 'vijay',
    //     getTokenFrom: {
    //       'et2': 'dwadwadwadawdawd',
    //       'ksn': 'dwa awd wadawdaw d wa'
    //     }
    //   }
    // };
  };

  // Start listening to card swipes
  this.initCardSwipe = function() {
    
      var options = {
          successCallBack: function(data){
            console.log("Success call back from swipe in staycard");

            // if this is not staycard do nothing
            // TODO: can't match page to '' as there could be pages with no data-page
            // TODO: support new pages when they are added
            var activeMenu = $('#main-menu').find('a.active').data('page');
            if ('dashboard' === activeMenu || 'search' === activeMenu) {
              return;
            };

            var swipedCardData = {
              cardType: data.RVCardReadCardType || '',
              expiry: data.RVCardReadExpDate || '',
              cardHolderName: data.RVCardReadCardName || '',
              getTokenFrom: {
                'et2': data.RVCardReadTrack2,
                'ksn': data.RVCardReadTrack2KSN
              }
            };
            that.postCardSwipData(swipedCardData);
          },
          failureCallBack: function(errorObject){

            // if this is not staycard do nothing
            // TODO: can't match page to '' as there could be pages with no data-page
            // TODO: support new pages when they are added
            var activeMenu = $('#main-menu').find('a.active').data('page');
            if ('dashboard' === activeMenu || 'search' === activeMenu) {
              return;
            };
            
            sntapp.notification.showErrorMessage('Could not read the card properly. Please try again.');
          }
      };
  console.log("SC PAYMENT INIT######");
  console.log(JSON.stringify(sntapp));
  console.log(sntapp.cardSwipeDebug);
      // start listening
      if(sntapp.cardSwipeDebug===true){ console.log("SC PAYMENT DB######"); sntapp.cardReader.startReaderDebug(options); }

      if(sntapp.cordovaLoaded){ sntapp.cardReader.startReader(options); }
  };


  // lets post the 'et2' and 'ksn' data
  // to get the token code from MLI
  this.postCardSwipData = function(swipedCardData) {

    // only respond for current reservations
    var $currResCard = $('#reservation-card > .reservation-tabs-nav li[aria-controls="current"]');
    if ( 'true' != $currResCard.attr('aria-selected') ) {
      return;
    };

    var swipedCardData = swipedCardData;

//Please delete the explicit implementation.
    var url = '/staff/payments/tokenize';

    // respond to StayCardView
    var stayCardViewResponse = function() {
      // if addNewPaymentModal instance doen't exist, create it
      // else if addNewPaymentModal instance exist, but the dom is removed
      if ( !sntapp.getViewInst('addNewPaymentModal') ) {
        sntapp.setViewInst('addNewPaymentModal', function() {
          return new AddNewPaymentModal('staycard', that.myDom);
        });
      } else if (sntapp.getViewInst('addNewPaymentModal') && !$('#new-payment').length) {
        sntapp.updateViewInst('addNewPaymentModal', function() {
          return new AddNewPaymentModal('staycard', that.myDom);
        });
      }

      sntapp.getViewInst('addNewPaymentModal').swipedCardData = swipedCardData;
      sntapp.getViewInst('addNewPaymentModal').initialize();
    };

    // respond to GuestBillView
    var guestBillViewResponse = function() {
      var currentCardToken = $('#select-card-from-list').data('token');

      // if the guest uses a registered card, show bill payment modal
      if (currentCardToken === swipedCardData.token.slice(-4)) {
        sntapp.getViewInst('registrationCardView').swipedCardData = swipedCardData;
        sntapp.getViewInst('registrationCardView').payButtonClicked();
      } else {

        // show modal for adding a new card
        stayCardViewResponse();
      }
    };

    // respond to GuestCardView
    var guestCardView = function() {
      // if addNewPaymentModal instance doen't exist, create it
      // else if addNewPaymentModal instance exist, but the dom is removed
      if ( !sntapp.getViewInst('addNewPaymentModal') ) {
        sntapp.setViewInst('addNewPaymentModal', function() {
          return new AddNewPaymentModal('guest', that.myDom);
        });
      } else if (sntapp.getViewInst('addNewPaymentModal') && !$('#new-payment').length) {
        sntapp.updateViewInst('addNewPaymentModal', function() {
          return new AddNewPaymentModal('guest', that.myDom);
        });
      }

      sntapp.getViewInst('addNewPaymentModal').swipedCardData = swipedCardData;
      sntapp.getViewInst('addNewPaymentModal').initialize();
    };

    var successCallBackHandler = function(token) {
      // add token to card data
      swipedCardData.token = token.data;

      
      // dirty trick to find the current page and react
      switch(sntapp.cardSwipeCurrView){
        // respond to StayCardView
        case 'StayCardView':
          stayCardViewResponse();
          break;

        //respond to GuestBillView
        case 'GuestBillView':
          guestBillViewResponse();
          break;

        //respond to GuestCardView
        case 'GuestCardView':
          guestCardView();
          break;

        // do nothing
        default:
          break;
      }
    };

    var options = {
      loader: 'BLOCKER',
      requestParameters: swipedCardData.getTokenFrom,
      successCallBack: successCallBackHandler,
      failureCallBack: function(error) {
        sntapp.notification.showErrorMessage('Sorry we could not get a response from server. Please try again.');
      }
    };

   // // DEBUG
  /* if (sntapp.cardSwipeDebug === true) { 
    /*var token = {
      'data' : "123456789312321321321"
    }
    console.log(JSON.stringify(swipedCardData));
    successCallBackHandler(swipedCardData); 
    return;
  }*/

    var webservice = new WebServiceInterface();
    webservice.postJSON(url, options);

    
  };

  this.delegateEvents = function(partialViewRef){  

   	if(partialViewRef === undefined){
   		partialViewRef = $("#confirm_no").val();
   	};   	
  	
    //that.myDom.find('#reservation-timeline li').on('click', that.reservationTimelineClicked);
    //that.myDom.find('#reservation-listing li').on('click', that.reservationListItemClicked);
    that.myDom.find($('.masked-input')).on('focusout', that.guestDetailsEdited);  
    that.myDom.find('#title').on('change', that.changeAvathar);
    // that.myDom.unbind('click');
	that.myDom.find("#reservation-card *").on('click', that.reservationCardClickHandler);

  };
  
  this.reservationCardClickHandler = function(event){
  	  	
    var target = $(event.target);
		var target_id = target.attr("id");
		if(!target.is("#guest-card-content *"))
		{
			that.closeGuestCardDrawer();
			switch(target_id){
				case 'reservation-timeline li': {				
					return that.reservationTimelineClicked(event);
					break;
				}
				case 'reservation-listing li': {
					return that.reservationListItemClicked(event);
					break;
				}
			}
		}
	};
  // function for closing the drawer if is open
	that.closeGuestCardDrawer = function(){
		if($("#guest-card").hasClass('open')) {
			$('#guest-card .ui-resizable-handle').trigger('click');
		}
	};

  this.changeAvathar = function(e){
	  var imgSrc = that.myDom.find('#guest-image').attr('src');
    var imageName = imgSrc.split('/')[imgSrc.split('/').length-1];

    for (var key in avatharImgs) {
      if((avatharImgs[key]) == imageName){
        $("#guest-card-header .guest-image img").attr("src", getAvatharUrl($(this).val()));  
        return false;
      }
    }
  };

  
 this.executeLoadingAnimation = function(){
  	if (this.viewParams === undefined) return;
  	if (this.viewParams["showanimation"] === false) return;
	
	if (this.viewParams["current-view"] === "bill_card_view")
  		changeView("nested-view", "", "view-nested-third", "view-nested-first", "move-from-left", false);
  	else if (this.viewParams["current-view"] === "room_upgrades_view"){

  		changeView("nested-view", "", "view-nested-second", "view-nested-first", "move-from-left", false);
  	} else if (this.viewParams["current-view"] === "search_view"){
      changeInnerPage('inner-page', undefined, undefined, 'page-inner-first', 'move-from-right', false);
    }
  		

  };

this
  .pageshow = function(){
    that.createScroll();
  };

  //Create the scroll views for staycard
  this.createScroll = function(){

    var confirmNum = that.myDom.find($('#reservation_info')).attr('data-confirmation-num');
    $("div[id='reservation-listing']").each(function(index){
      createViewScroll("#"+ $(this).parent().attr('id')+" #"+ $(this).attr('id'));
    });
    if ($('#reservation-content-'+ confirmNum).length){
      createViewScroll('#reservation-content-'+ confirmNum);
    }

  };

  this.initSubViews = function(){
  	 
  	partialViewRef = $("#confirm_no").val();
  	setUpGuestcard(that.myDom);
  	var guestContactView = new GuestContactView($("#contact-info"));
  	guestContactView.pageinit();  	
  };

 
  //workaround for populating the reservation details,
  //when user clicks on other timeline tabs
  this.reservationTimelineClicked = function(e){
    var currentTimeline = $(this).attr('aria-controls');
    //No reservation details are added to the DOM
    if (!($("#" + currentTimeline).find('.reservation').length > 0)) {
    	
      $("#" + currentTimeline + ' #reservation-listing ul li').first().trigger("click");
    }
  };

  // Load reservation details
  this.reservationListItemClicked = function(e){
    var confirmationNumClicked = $(this).attr('data-confirmation-num');
    var $href = $(this).find('a').attr('href');

    //get the current highlighted timeline
    //Not more than 5 resevation should be kept in DOM in a timeline.
    var currentTimeline = $('#reservation-timeline').find('.ui-state-active').attr('aria-controls');
    if ($('#' + currentTimeline + ' > div').length > 6 && !($($href).length > 0)) {
      $("#" + currentTimeline).find('div:nth-child(2)').remove();
    }
    //get the reservation id.
    var reservation = $href.split("-")[1];


    //if div not present in DOM, make ajax request 
    if (!($($href).length > 0)) {
      that.loadReservationDetails($href);
    } 
  };

  this.refreshReservationDetails = function(reservationId, sucessCallback){
    var currentReservationDom = that.myDom.find("[data-reservation-id='" + reservationId + "']").attr('id');
    that.loadReservationDetails("#" + currentReservationDom, sucessCallback);

  };

  this.loadReservationDetails = function(currentReservationDom, sucessCallback){
    var confirmationNum = currentReservationDom.split("-")[1];
    var currentTimeline = $('#reservation-timeline').find('.ui-state-active').attr('aria-controls');
      //show loading indicator
      sntapp.activityIndicator.showActivityIndicator("blocker");
      $.ajax({
        type : 'GET',
        url : "staff/staycards/reservation_details?reservation=" + confirmationNum,
        dataType : 'html',
        //async:false,

        success : function(data) {  
          sntapp.activityIndicator.hideActivityIndicator(); 
            if ($(currentReservationDom).length > 0) {
              $("#" +currentTimeline).find(currentReservationDom).remove();
            }
            $("#" + currentTimeline).append(data);         
            createViewScroll("#reservation-content-"+confirmationNum);       
            var reservationDetails = new reservationDetailsView($("#reservation-"+confirmationNum));
            reservationDetails.initialize();
            if(sucessCallback != undefined){
              sucessCallback();
            }
        },
        error : function(jqxhr, status, error){
          //checking whether a user is logged in
          if (jqxhr.status == "401") { sntapp.logout(); return;}
          //TODO: handle error display
        }
      });
  };

  
  this.fetchCompletedUpdateGuestDetails = function(data){
	  if(data.status == 'success'){
          $("#guest_firstname").val($guestFirstName);
          $("#guest_lastname").val($guestLastName);
          $("#city").val($guestCity);
          $("#state").val($guestState);
          $("#phone").val($guestPhone);
          $("#email").val($guestEmail);  
	  }
	  else{
		sntapp.activityIndicator.hideActivityIndicator();
		sntapp.notification.showErrorList(data.errors, that.myDom); 		  
	  }
  };
  this.fetchFailedUpdateGuestDetails = function(errorMessage){
	sntapp.activityIndicator.hideActivityIndicator();
	sntapp.notification.showErrorMessage(errorMessage, that.myDom); 	  
  };
  
  this.updateGuestDetails = function(update_val, type){
    var userId = $("#user_id").val();
    $guestCardJsonObj = {};
    $guestCardJsonObj['guest_id'] = $("#guest_id").val();
    $guestFirstName = $guestCardJsonObj['first_name'] = $("#gc-firstname").val();
    $guestLastName = $guestCardJsonObj['last_name'] = $("#gc-lastname").val();
    $guestCity = $guestCardJsonObj['city'] = ($("#gc-city").val());
    $guestState = $guestCardJsonObj['state'] = ($("#gc-state").val());
    $guestPhone = $guestCardJsonObj['phone'] = $("#gc-phone").val();
    $guestEmail = $guestCardJsonObj['email'] = $("#gc-email").val();
    
    var url = 'staff/guest_cards/' + userId;
    var webservice = new WebServiceInterface();
    var options = {
		   requestParameters: $guestCardJsonObj,
		   successCallBack: that.fetchCompletedUpdateGuestDetails,
		   failureCallBack: that.fetchFailedUpdateGuestDetails,		   
    };
    webservice.putJSON(url, options);

   };

    this.guestDetailsEdited = function(e){
      //send an update request to the third party system
      that.updateGuestDetails($(this).val(), $(this).attr('data-val'));
    };
};