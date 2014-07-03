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
  };

  // Start listening to card swipes
  this.initCardSwipe = function() {
    sntapp.paymentTypeSwipe = false;
    var options = {
        successCallBack: function(data){
          sntapp.paymentTypeSwipe = true;
          // if this is not staycard do nothing
          // TODO: can't match page to '' as there could be pages with no data-page
          // TODO: support new pages when they are added
          var activeMenu = $('#main-menu').find('a.active').data('page');
          if ('dashboard' === activeMenu || 'search' === activeMenu) {
            return;
          };

          //For ksn, if the ETBKSN value(for infinea) is empty, use the track2KSN
          var ksn = data.RVCardReadTrack2KSN;
          if(data.RVCardReadETBKSN != ""){
            ksn = data.RVCardReadETBKSN;
          }

          var swipedCardData = {
            cardType: data.RVCardReadCardType || '',
            expiry: data.RVCardReadExpDate || '',
            cardHolderName: data.RVCardReadCardName || '',
            
            getTokenFrom: {
              'et2': data.RVCardReadTrack2,
              'ksn': ksn,
              'pan': data.RVCardReadMaskedPAN,
              'etb' : data.RVCardReadETB
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
    // start listening
    if(sntapp.cardSwipeDebug===true){sntapp.cardReader.startReaderDebug(options); }

    if(sntapp.cordovaLoaded){ sntapp.cardReader.startReader(options); }
  };

  // lets post the 'et2' and 'ksn' data
  // to get the token code from MLI
  this.postCardSwipData = function(swipedCardData) {
    var currentReservationDiv = getCurrentReservationDiv();
    var reservationStatus = $('#' +currentReservationDiv).data('reservation-status');
    
    // only respond for 'NOSHOW', 'CHECKEDOUT', 'CANCELED' reservations
    if(['NOSHOW', 'CHECKEDOUT', 'CANCELED'].indexOf(reservationStatus) >= 0){
      return;
    }

    var swipedCardData = swipedCardData;

    //Please delete the explicit implementation.
    var url = '/staff/payments/tokenize';
    
    /* Function for listening from swipe in staycard, guestcard, billcard */
    var respondToSwipe = function (fromPage, domElement, params){
      if ( !sntapp.getViewInst('addNewPaymentModal') ) {
         sntapp.setViewInst('addNewPaymentModal', function() {
           return new AddNewPaymentModal(fromPage, domElement, params);
        });
      } else if (sntapp.getViewInst('addNewPaymentModal') && !$('#new-payment').length) {
       // if addNewPaymentModal instance exist, but the dom is removed
         sntapp.updateViewInst('addNewPaymentModal', function() {
           return new AddNewPaymentModal(fromPage, domElement, params);
        });
      }
      sntapp.getViewInst('addNewPaymentModal').swipedCardData = swipedCardData;
      sntapp.getViewInst('addNewPaymentModal').initialize();
      if(typeof params != "undefined"){
        sntapp.getViewInst('addNewPaymentModal').params = params;
      }
      sntapp.getViewInst('addNewPaymentModal').dataUpdated();
    };
    

    var successCallBackHandler = function(token) {
      // add token to card data
      swipedCardData.token = token.data;

      // dirty trick to find the current page and react
      switch(sntapp.cardSwipeCurrView){
        // respond to StayCardView
        case 'StayCardView':
        var confirmationNum = getCurrentConfirmation();
        console.log("staycard")
          respondToSwipe("staycard", $("#reservation-"+confirmationNum), {});
          break;

        //respond to GuestBillView
        case 'GuestBillView':
         console.log("GuestBillView")
          //To get the current bill number we are re-using the bill card view object
          var regCardView = sntapp.getViewInst('registrationCardView');
          var domElement = $("#bill" + regCardView.getActiveBillNumber());
          
          var params = { 
          	"bill_number" : regCardView.getActiveBillNumber(), 
          	"origin":views.BILLCARD
          	};
          // $("#setOverlay").hide();
          respondToSwipe(views.BILLCARD, domElement, params);
          
          break;

        //respond to GuestCardView
        case 'GuestCardView':
          console.log("GuestCardView")
          respondToSwipe("guest", $("#cc-payment"), {});

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

    var webservice = new WebServiceInterface();
    webservice.postJSON(url, options);
  };

  this.delegateEvents = function(partialViewRef){  

    if(partialViewRef === undefined){
      partialViewRef = $("#confirm_no").val();
    };    
    
    /*that.myDom.find('#reservation-timeline li').on('click', that.reservationTimelineClicked);
    that.myDom.find('.reservations-tabs li').on('click', that.reservationListItemClicked);*/
    that.myDom.find($('.masked-input')).on('focusout', that.guestDetailsEdited);  
    that.myDom.find('#title').on('change', that.changeAvathar);
    // that.myDom.unbind('click');
    that.myDom.find("#reservation-card").on('click', that.reservationCardClickHandler);

  };
  
  // Handlers to load data if none exist in DOM
  this.reservationCardClickHandler = function(event){
    that.closeGuestCardDrawer();
    
    // Change timeline
    if(getParentWithSelector(event, "#reservation-timeline li")) {
        return that.reservationTimelineClicked(event);
    }

    // Change reservation
    if(getParentWithSelector(event, ".reservations-tabs li a")) {
        return that.reservationListItemClicked(event);
    }   
    
    // Click REMOVE FROM QUEUE or PUT IN QUEUE buttons 
	if(getParentWithSelector(event, "#reservation-queue")) {
        return that.reservationQueueHandler(event);
    }
  };

  // function for closing the drawer if is open
  this.closeGuestCardDrawer = function(){
    if($('#guest-card').height() > '90') {
      	$('#guest-card .ui-resizable-handle').trigger('click');
    }
  };

  // Change avatar
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

  // Change screen actions
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

  // Create scrolls on pageshow
  this.pageshow = function(){
    // Create scrollers for all timelines
    $(".reservations-tabs").each(function(index){
      createVerticalScroll("#" + $(this).attr('id'));
    });

    // Create scroller for the visible reservation
    var confirmNum = that.myDom.find($('#reservation_info')).attr('data-confirmation-num');
    if ($('#reservation-content-'+ confirmNum).length){
      createVerticalScroll('#reservation-content-'+ confirmNum);
    }
  };

  this.initSubViews = function(){
    partialViewRef = $("#confirm_no").val();
    setUpGuestcard(that.myDom);
    var guestContactView = new GuestContactView($("#contact-info"));
    guestContactView.pageinit();    
  };

  // Populate reservation details (if none exist in DOM for the selected timeline)
  this.reservationTimelineClicked = function(e){
    var currentTimeline = $(e.target).attr('aria-controls');    
    $('#reservation-card').attr('data-current-timeliine', currentTimeline); 
    
    if (!($("#" + currentTimeline).find('.reservation').length > 0)) { 
      var $firstReservation = $("#" + currentTimeline + ' .reservations-tabs li:first-child').find('a');
        
      // Load reservation details
      $firstReservation.trigger("click");
    }
  };

  // Load reservation details
  this.reservationListItemClicked = function(event){
    event.preventDefault();
    var target = $(event.target);
    var confirmationNumClicked = target.parents('li:eq(0)').attr('data-confirmation-num');
    var $href = target.attr('href');

    // get the current highlighted timeline (not more than 5 resevation should be kept in DOM in a timeline.)
    var currentTimeline = $('#reservation-timeline').find('.ui-state-active').attr('aria-controls');
    if ($('#' + currentTimeline + ' > div').length > 6 && !($($href).length > 0)) {
      $("#" + currentTimeline).find('div:nth-child(2)').remove();
    }

    // get the reservation id.
    var reservation = $href.split("-")[1];

    // if div not present in DOM, make ajax request 
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
    var webservice = new WebServiceInterface();       
    var url = "/staff/staycards/reservation_details?reservation=" + confirmationNum; 
    var successCallBackParameters = {
        'currentReservationDom': currentReservationDom,
        'sucessCallback': sucessCallback,
        'confirmationNum': confirmationNum,
        'currentTimeline': currentTimeline
    };
    var options = {
        loader: 'BLOCKER',
        successCallBack: that.fetchCompletedOfLoadReservationDetails,
        successCallBackParameters: successCallBackParameters
    };
    webservice.getHTML(url, options);        
  };

  // success function of LoadReservationDetails's ajax call
  this.fetchCompletedOfLoadReservationDetails = function(data, params){
    var confirmationNum = params['confirmationNum'];
    var currentTimeline = params['currentTimeline'];
    var sucessCallback = params['sucessCallback'];
    var currentReservationDom = params['currentReservationDom'];

    // Clear up space for new data
    if ($(currentReservationDom).length > 0) {
      $("#" +currentTimeline).find(currentReservationDom).remove();
    }

    // Append new data and set scroller for it
    $("#" + currentTimeline).append(data);      
    createVerticalScroll('#reservation-content-'+ confirmationNum);    

    var reservationDetails = new reservationDetailsView($("#reservation-"+confirmationNum));
    reservationDetails.initialize();
    if(sucessCallback != undefined){
      sucessCallback();
    }
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

    this.queueSaveFailed = function(errorMessage){
      sntapp.activityIndicator.hideActivityIndicator();
      sntapp.notification.showErrorMessage(errorMessage, that.myDom); 
    }
    // Success callback for queue
    this.queueSaveSuccess = function(data,params){
    	
      var myConfirmationNo = getCurrentConfirmation();
      
      if(that.myDom.find("#reservation-queue").hasClass('red-text')){
      	// Change button "Remove from Queue" to "Put in Queue"
      	that.myDom.find("#reservation-queue").removeClass('red-text').addClass('blue-text');
      	that.myDom.find("#reservation-queue").text("Put in Queue");
      	that.myDom.find("#reservation-queue-status").val("false");
      	
      	// Update on search results
		$("#search-results a" ).each(function() {
			if($(this).find('.confirmation').text() === myConfirmationNo ){
				$(this).find('.status').removeClass('queued');
			}
		});
      	
      }
      else if(that.myDom.find("#reservation-queue").hasClass('blue-text')){
      	// Change button "Put in Queue" to "Remove from Queue"
      	that.myDom.find("#reservation-queue").removeClass('blue-text').addClass('red-text');
      	that.myDom.find("#reservation-queue").text("Remove from Queue");
      	that.myDom.find("#reservation-queue-status").val("true");
      	
      	// Update on search results
      	$("#search-results a" ).each(function() {
			if($(this).find('.confirmation').text() === myConfirmationNo ){
				$(this).find('.status').addClass('queued');
			}
		});
      	
      }
    };
    
    //Update resevation with the selected room.
  	this.reservationQueueHandler = function(e){
    
      var reservation_id = $('#reservation_id').val();
      var is_queue_reservation = $('#reservation-queue-status').val() == "true" ? false : true;
      var postParams = {};
      postParams.status = is_queue_reservation;
      
	  var webservice = new WebServiceInterface();
	  var successCallBackParams = { 'reservationId': reservation_id };
    	
      var options = { requestParameters: postParams,
      				successCallBack : that.queueSaveSuccess,
      				successCallBackParameters: successCallBackParams,
      				failureCallBack: that.queueSaveFailed,
      				loader: 'blocker'
      };
      
      var url = '/api/reservations/'+reservation_id+'/queue';
      webservice.postJSON(url, options);
    };
    
};