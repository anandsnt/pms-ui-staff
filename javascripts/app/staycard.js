var StayCard = function(viewDom){
  BaseView.call(this);
  var that = this;
  this.myDom = viewDom;
  
  this.pageinit = function(){
    setUpStaycard(that.myDom);
    var currentConfirmNumber = $("#confirm_no").val();    
    var reservationDetails = new reservationDetailsView($("#reservation-"+currentConfirmNumber));
	reservationDetails.initialize();
   
  };
   this.delegateEvents = function(partialViewRef){  
   	if(partialViewRef === undefined){
   		partialViewRef = $("#confirm_no").val();
   	}   	
  	
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
  	}
  		
  	 
  };


  this.pageshow = function(){
    that.createScroll();
  };

  //Create the scroll views for staycard
  this.createScroll = function(){

    var confirmNum = that.myDom.find($('#reservation_info')).attr('data-confirmation-num');
    $("div[id='reservation-listing']").each(function(index){
      createViewScroll("#"+ $(this).parent().attr('id')+" #"+ $(this).attr('id'));
    });
    createViewScroll('#reservation-content-'+ confirmNum);

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
    //var currentTimeline = $(this).parents().find(".reservation-list:eq(0)").attr('id');
    //$('#'+currentTimeline).append("<div id= 'reservation-"+confirmationNumClicked+"'>test div</div>");
    that.displayReservationDetails($(this).find('a').attr('href'));
  };

  //Add the reservation details to the DOM.
  this.displayReservationDetails = function($href){
  	 
  	$("#view-nested-first #reservation_info").removeClass("current");
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
      sntapp.activityIndicator.showActivityIndicator("blocker");
      $.ajax({
        type : 'GET',
        url : "staff/staycards/reservation_details?reservation=" + reservation,
        dataType : 'html',
        //async:false,

        success : function(data) {  
          sntapp.activityIndicator.hideActivityIndicator(); 
          //To avoid multiple ajax content fetches appended to DOM.
          if (!($($href).length > 0)) {
            $("#" + currentTimeline).append(data);         
            createViewScroll("#reservation-content-"+reservation);       
            var reservationDetails = new reservationDetailsView($("#reservation-"+reservation));
            reservationDetails.initialize();
            
          } 	
          
        },
        error : function() {
          //TODO: handle error display
        }
      });
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
    $guestCity = $guestCardJsonObj['city'] = ($("#gc-location").val()).split(",")[0];
    $guestState = $guestCardJsonObj['state'] = ($("#gc-location").val()).split(",")[1];
    $guestPhone = $guestCardJsonObj['phone'] = $("#gc-phone").val();
    $guestEmail = $guestCardJsonObj['email'] = $("#gc-email").val();
    
    var url = 'staff/guest_cards/' + userId;
    var webservice = new WebServiceInterface();
    var options = {
		   requestParameters: JSON.stringify($guestCardJsonObj),
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