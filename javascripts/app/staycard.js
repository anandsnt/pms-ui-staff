var StayCard = function(viewDom){
  BaseView.call(this);
  var that = this;
  this.myDom = viewDom;
  this.reservation_id = getReservationId();
  this.pageinit = function(){
    setUpStaycard(that.myDom);
    
    //Bind staycard events

    that.myDom.find($('#reservation-timeline li')).on('click', that.reservationTimelineClicked);
    that.myDom.find($('#reservation-listing li a')).on('click', that.reservationListItemClicked);
    that.myDom.find($('.masked-input')).on('focusout', that.guestDetailsEdited);
    that.myDom.find($('#reservation_newspaper')).on('change', that.setNewspaperPreferance);
    that.myDom.find($('#reservation-checkin')).on('click', that.validateEmailAndPhone);
	that.myDom.find('#stay-card-loyalty #wakeup-time').on('click',that.setWakeUpCallModal);
    that.myDom.find('#reservation-card-room #add-keys').on('click',that.addKeysModal);
  };

  this.pageshow = function(){
    //Create the scroll views for staycard
    var confirmNum = that.myDom.find($('#reservation_info')).attr('data-confirmation-num');
    createViewScroll('#reservation-listing');
    createViewScroll('#reservation-content-'+ confirmNum);
  };

  this.initSubViews = function(){
    var reservationPaymentView = new ReservationPaymentView($("#reservation-card-payment"));
    reservationPaymentView.initialize();
    var reservationCardLoyaltyView = new ReservationCardLoyaltyView($("#reservationcard-loyalty"));
    reservationCardLoyaltyView.initialize();
    setUpGuestcard(that.myDom);
    var guestContactView = new GuestContactView($("#contact-info"));
    guestContactView.pageinit();
    var reservationCardNotes = new reservationCardNotesView($("#reservation-notes"));
    reservationCardNotes.initialize();
  }

  this.validateEmailAndPhone = function(e){
  	
  	var phone_num = $("#gc-phone").val();
  	var email = $("#gc-email").val();
  	
  	if(phone_num == "" && email == ""){
  	       	var validateCheckinModal = new ValidateCheckinModal();
  	       	validateCheckinModal.initialize();
  	       	validateCheckinModal.params = {"type": "NoPhoneNoEmail"};
  	}
  	else if(phone_num == ""){
  	       	var validateCheckinModal = new ValidateCheckinModal();
  	       	validateCheckinModal.initialize();
  	       	validateCheckinModal.params = {"type": "NoPhone"};
  	}
  	else if(email == ""){
  	       	var validateCheckinModal = new ValidateCheckinModal();
  	       	validateCheckinModal.initialize();
  	       	validateCheckinModal.params = {"type": "NoEmail"};
  	}
    else{
    	
    	//Page transition to Registration card view.
   		$(this).attr('data-page',"search");
   		$(this).attr('data-transition',"nested-view");
   		$(this).attr('href',"staff/reservation/bill_card?reservation_id="+that.reservation_id);
   		//$(this).attr('href',"ui/registration?"+that.reservation_id);
    }
  }


  this.initSubViews = function(){
  	var reservationPaymentView = new ReservationPaymentView($("#reservation-card-payment"));
    reservationPaymentView.initialize();
    var reservationCardLoyaltyView = new ReservationCardLoyaltyView($("#reservationcard-loyalty"));
    reservationCardLoyaltyView.initialize();
    setUpGuestcard(that.myDom);
    var guestContactView = new GuestContactView($("#contact-info"));
    guestContactView.pageinit();
    var reservationCardNotes = new reservationCardNotesView($("#reservation-notes"));
    reservationCardNotes.initialize();
  }


  this.setNewspaperPreferance = function(e){  	
  	var newspaperValue = $('#reservation_newspaper').val();
  	$.ajax({
      	type : 'POST',
      	url : "reservation/add_newspaper_preference",
      	data : {"reservation_id": that.reservation_id, "selected_newspaper" :newspaperValue } ,
      	success : function(data) {
          	if(data.status == "success"){
          	    console.log("Succesfully set newspaper preferance");
          	}
          	else{
          	    console.log("Something is wrong!");
          	}
      	},
      	error : function() {
      	    console.log("There is an error!!");
      	}
  	});
  }

  
  //workaround for populating the reservation details,
  //when user clicks on other timeline tabs
  this.reservationTimelineClicked = function(e){
    var currentTimeline = $(this).attr('aria-controls');
    //No reservation details are added to the DOM
    if (!($("#" + currentTimeline).find('.reservation').length > 0)) {
      $("#" + currentTimeline + ' #reservation-listing ul li').first().find('a').trigger("click");
    }
  }

  // Load reservation details
  this.reservationListItemClicked = function(e){
    that.displayReservationDetails($(this).attr('href'));
  }

  //Add the reservation details to the DOM.
  this.displayReservationDetails = function($href){
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
      $.ajax({
        type : 'GET',
        url : "staff/staycards/reservation_details?reservation=" + reservation,
        dataType : 'html',
        success : function(data) {
          $("#" + currentTimeline).append(data);
        },
        error : function() {
        }
      });
    }
  }


  this.updateGuestDetails = function(update_val, type){
    var userId = $("#user_id").val();
    $guestCardJsonObj = {};
    $guestCardJsonObj['guest_id'] = $("#guest_id").val();
    $guestFirstName = $guestCardJsonObj['first_name'] = $("#gc-firstname").val();
    $guestLastName = $guestCardJsonObj['last_name'] = $("#gc-lastname").val();
    $guestCity = $guestCardJsonObj['city'] = ($("#gc-location").val()).split(",")[0];
    $guestState = $guestCardJsonObj['state'] = ($("#gc-location").val()).split(",")[1];
    $guestPhone = $guestCardJsonObj['phone'] = $("#gc-phone").val();
    $guestEmail = $guestCardJsonObj['email'] = $("#gc-email").val();

    $.ajax({
      type : 'PUT',
      url : 'staff/guest_cards/' + userId,
      data : JSON.stringify($guestCardJsonObj),

      dataType : 'json',
      contentType : 'application/json',
      success : function(data) {
        //TODO: handle success state
        if (!$guestCardClickTime) {
          $("#guest_firstname").val($guestFirstName);
          $("#guest_lastname").val($guestLastName);
          $("#city").val($guestCity);
          $("#state").val($guestState);
          $("#phone").val($guestPhone);
          $("#email").val($guestEmail);
        }
      },
      error : function(e) {
        //TODO: hande error cases
        console.log(e);
      }
    });

    }


    this.guestDetailsEdited = function(e){

      //send an update request to the third party system
      that.updateGuestDetails($(this).val(), $(this).attr('data-val'));
    }
    
	this.setWakeUpCallModal = function(e){
		var setWakeUpCallModal = new SetWakeUpCallModal();
    	setWakeUpCallModal.params = {"reservation_id" : that.reservation_id};
    	setWakeUpCallModal.type ="POST";
    	setWakeUpCallModal.initialize();
    }
    this.addKeysModal = function(e){
		var addKeysModal = new AddKeysModal();
    	addKeysModal.initialize();
    }
}


/*function getParentBookingDetailes(clickedElement) {
  alert(clickedElement);
  var reservationDetails = {};
  var parentReservationElement = $('#' + clickedElement).closest('div[id^="reservation-content"]').attr('id');
  alert(parentReservationElement);
}*/
