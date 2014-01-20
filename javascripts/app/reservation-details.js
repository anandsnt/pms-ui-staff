var reservationDetailsView = function(domRef){
  BaseView.call(this);
  var that = this;
  this.myDom = domRef;
  this.reservation_id = getReservationId();
  this.pageinit = function(){    

  };
  this.delegateEvents = function(){
  	that.myDom.find('#reservation_newspaper').on('change', that.setNewspaperPreferance);
  	that.myDom.find('#wakeup-time').on('click',that.setWakeUpCallModal);
  	that.myDom.find('#room-number').on('click',that.roomNumberClicked);
  	that.myDom.find('#reservation-card-room #add-keys').on('click',that.addKeysModal);	
  	that.myDom.find('#upgrade-btn').on('click',that.roomUpgradesClicked);
  	that.myDom.find('.reservation-actions #reservation-checkout').on('click', that.clickedCheckoutButton);
  	that.myDom.find('#reservation-view-bill').on('click',that.clickedViewBillButton);
    that.myDom.find('#stay-card-total-stay-cost').on('click',that.clickedTotalStayCost);
    that.myDom.find('#reservation-checkin').on('click', that.validateEmailAndPhone);  
    that.myDom.find('#nights-btn').on('click', that.gotToChangeDatesScreen);
  };
  this.initSubViews = function(partialViewRef){
  	
  	var reservationPaymentView = new ReservationPaymentView(that.myDom);
    reservationPaymentView.initialize();
    var reservationCardLoyaltyView = new ReservationCardLoyaltyView(that.myDom);
    reservationCardLoyaltyView.initialize();
    var reservationCardNotes = new reservationCardNotesView(that.myDom);
    reservationCardNotes.initialize();
  };

  this.gotToChangeDatesScreen = function(){
    sntapp.activityIndicator.showActivityIndicator("blocker");
    var viewURL = "/staff/change_stay_dates/"+getReservationId();
    var viewDom = $("#view-nested-second");
    var reservation_id = getReservationId();
    var nextViewParams = {"reservation_id": reservation_id};
    sntapp.fetchAndRenderView(viewURL, viewDom, {}, 'NORMAL', nextViewParams);
  };

   this.setNewspaperPreferance = function(e){  	
		var newspaperValue = that.myDom.find('#reservation_newspaper').val();
		var reservation_id = getReservationId();
		
		var data = {"reservation_id": reservation_id, "selected_newspaper" :newspaperValue };
		var webservice = new WebServiceInterface();
		var options = {
		  requestParameters: data
		};
  		webservice.postJSON('/reservation/add_newspaper_preference', options);
  };
  this.setWakeUpCallModal = function(e){
		if($(e.target).hasClass("feature-available")){	
			var setWakeUpCallModal = new SetWakeUpCallModal();
	    	setWakeUpCallModal.params = {"reservation_id" : that.reservation_id};
	    	setWakeUpCallModal.type ="POST";
	    	setWakeUpCallModal.initialize();
   		}
   		else{
   			that.showErrorMessage("Feature not available");
   		}
   	};

   this.roomNumberClicked = function(e){
    e.preventDefault();
    var nextViewParams = {"next_view": views.STAYCARD};
    that.goToRoomAssignmentView(nextViewParams);
  };
  
  this.goToRoomAssignmentView = function(nextViewParams){
    sntapp.activityIndicator.showActivityIndicator("blocker");
    var viewURL = "staff/preferences/room_assignment";
    var viewDom = $("#view-nested-second");
    var reservation_id = getReservationId();
    var params = {"reservation_id": reservation_id};
    sntapp.fetchAndRenderView(viewURL, viewDom, params, 'NORMAL', nextViewParams);
  };
  
  this.addKeysModal = function(e){
		var addKeysModal = new AddKeysModal();
    	addKeysModal.initialize();
    };
  this.roomUpgradesClicked = function(e){
  	
    e.preventDefault();
    var nextViewParams = {"showanimation": true, "next_view" : views.STAYCARD};
    that.goToRoomUpgradeView(nextViewParams);

  };
  this.goToRoomUpgradeView = function(nextViewParams){
    sntapp.activityIndicator.showActivityIndicator("blocker");
    var viewURL = "staff/reservations/room_upsell_options";
    var viewDom = $("#view-nested-second");
    var reservation_id = getReservationId();
    var params = {"reservation_id": reservation_id};
    sntapp.fetchAndRenderView(viewURL, viewDom, params, 'NORMAL', nextViewParams );
  };
   
    this.goToBillCardView = function (clickedButton){
        sntapp.activityIndicator.showActivityIndicator("blocker");
    	var viewURL = "staff/reservation/bill_card";
		//var viewURL = "ui/show?haml_file=staff/reservations/bill_card&json_input=registration_card/registration_card.json&is_hash_map=true&is_layout=false";
		var viewDom = $("#view-nested-third");
		var params = {"reservation_id": that.reservation_id};
		var nextViewParams = {"showanimation": true, "from-view" : views.STAYCARD, "clickedButton":clickedButton };
		sntapp.fetchAndRenderView(viewURL, viewDom, params, 'NORMAL', nextViewParams );
    };
    this.clickedCheckoutButton = function(){
	    that.goToBillCardView("CheckoutButton");
    };
    this.clickedViewBillButton = function(e){
    	sntapp.activityIndicator.showActivityIndicator("blocker");
      	that.goToBillCardView("ViewBillButton");
    };
    
    this.clickedTotalStayCost = function(){
    	that.goToBillCardView("TotalStayCost");
    };
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
    
    else if(($.trim(that.myDom.find('#room-number strong').text()) == "") || 
      (that.myDom.find('#room-number').attr('data-room-status') != "READY") ||
       (that.myDom.find('#room-number').attr('data-fo-status') != "VACANT")){
    
          var nextViewParams = {"next_view": views.BILLCARD};
          sntapp.activityIndicator.showActivityIndicator("blocker");
      	  that.goToRoomAssignmentView(nextViewParams);
    }
    else if((that.myDom.find('#reservation-checkin').attr('data-force-upsell') == "true")
      &&(that.myDom.find('#reservation-checkin').attr('data-upsell-available') == "true")){
      
          var nextViewParams = {"showanimation": true, "next_view" : views.BILLCARD };
            sntapp.activityIndicator.showActivityIndicator("blocker");
      		that.goToRoomUpgradeView(nextViewParams);
    }
    else{
    	    sntapp.activityIndicator.showActivityIndicator("blocker");
    		that.goToBillCardView("CheckinButton");
    }
  };

};


