var StayCard = function(viewDom){
  BaseView.call(this);
  var that = this;
  this.myDom = viewDom;
  
  this.pageinit = function(){
    setUpStaycard(that.myDom);
    var currentConfirmNumber = $("#confirm_no").val();    
    var reservationDetails = new reservationDetailsView($("#reservation-"+currentConfirmNumber));
	reservationDetails.initialize();

    if(sntapp.cordovaLoaded){
      var options = {
          successCallBack: function(data){
            var cardData = {
              cardType: data.RVCardReadCardType || '',
              expiry: data.RVCardReadExpDate || '',
              cardHolderName: data.RVCardReadCardName || '',
              getTokenFrom: {
                'et2': data.RVCardReadTrack2,
                'ksn': data.RVCardReadTrack2KSN
              }
            }

            that.postCardSwipData(cardData);
            $("#add-new-payment").trigger('click');
          },
          failureCallBack: function(errorObject){
            sntapp.notification.showErrorMessage('not visible from failure');
          }
      };
      sntapp.cardReader.startReader(options);
    } 
  };

  // lets post the 'et2' and 'ksn' data
  // to get the token code from MLI
  this.postCardSwipData = function(cardData) {
    var url = 'http://pms-dev.stayntouch.com/staff/payments/tokenize';
    var options = {
      requestParameters: cardData.getTokenFrom,
      successCallBack: function(data) {
        window.injectSwipeCardData = function(cardData) {
          $('#payment-type').val( 'CC' );
          $('#payment-credit-type').val( cardData.cardType );
          $('#card-number-set1').val('xxxx-xxxx-xxxx-' + data.slice(-4));
          $('#expiry-month').val( cardData.expiry.substring(0, 2) );
          $('#expiry-year').val( cardData.expiry.slice(-2) );
          $('#name-on-card').val( cardData.cardHolderName );

          // inject the token as hidden field into form
          // TODO: Fix Security Issue associated with input[type="hidden"]!
          $('#new-payment').append('<input type="hidden" id="card-token" value="' + data + '">')
        }
      },
      failureCallBack: function(error) {
        sntapp.notification.showErrorMessage('failed on postCardSwipData ' + error);
      }
    }

    var webservice = new WebServiceInterface();
    webservice.postJSON(url, options);
  };


   this.delegateEvents = function(partialViewRef){  
   	if(partialViewRef === undefined){
   		partialViewRef = $("#confirm_no").val();
   	};   	
  	
    that.myDom.find('#reservation-timeline li').on('click', that.reservationTimelineClicked);
    that.myDom.find('#reservation-listing li').on('click', that.reservationListItemClicked);
    that.myDom.find($('.masked-input')).on('focusout', that.guestDetailsEdited);  
    that.myDom.find('#title').on('change', that.changeAvathar);
  };
  
  this.changeAvathar = function(e){
	  var img_src = getAvatharUrl($(this).val());
	  $("#guest-card-header .guest-image img").attr("src", img_src);  
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


  }

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
        error : function() {
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