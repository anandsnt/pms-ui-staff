var reservationDetailsView = function(domRef) {
	BaseView.call(this);
	var that = this;
	this.myDom = domRef;
	this.reservation_id = getReservationId();
	this.pageinit = function() {

	};
	this.delegateEvents = function() {
		//this.is_show_qr_code = that.myDom.find("#reservation-card-room #add-keys").attr('data-qr-code');

		that.myDom.find('#reservation_newspaper').on('change', that.setNewspaperPreferance);
		//unbind the previous object's event binding (currently object is not destorying/event is not unbinding).
		that.myDom.unbind('click');
		that.myDom.on('click', that.domClickHandler);
	};
	// function for closing the drawer if is open
	that.closeGuestCardDrawer = function(){
		if($("#guest-card").hasClass('open')) {
			$('#guest-card .ui-resizable-handle').trigger('click');
		}
	};

	this.domClickHandler = function(event){
		var target = $(event.target);
		var target_id = target.attr("id");
		// if the click is on reservation card details and if the guest card drawer is open
		that.closeGuestCardDrawer();
		
		switch(target_id){
			case 'wakeup-time': {				
				return that.setWakeUpCallModal(event);
				break;
			}
			case 'room-number': {
				return that.roomNumberClicked(event);
				break;
			}
			case 'add-keys': {
				//TODO: check parent's id
				return that.addKeysModal(event);
				break;
			}
			case 'upgrade-btn': {
				return that.roomUpgradesClicked(event);
				break;
			}
			case 'reservation-checkout': {
				//TODO: check parent's class
				return that.clickedCheckoutButton();
				break;
			}
			case 'reservation-view-bill': {
				return that.clickedViewBillButton(event);
				break;
			}
			case 'post-charge': {
				return that.clickedPostChargeButton();
				break;
			}
			case 'stay-card-total-stay-cost': {
				return that.clickedTotalStayCost();
				break;
			}
			case 'reservation-checkin': {
				return that.validateEmailAndPhone(event);
				break;
			}	
			case 'nights-btn': {
				return that.gotToChangeDatesScreen(event);
				break;
			}
			//
			default: {

				break;
			}
		}
	};

		
	this.initSubViews = function(partialViewRef) {

		var reservationPaymentView = new ReservationPaymentView(that.myDom);
		reservationPaymentView.initialize();
		var reservationCardLoyaltyView = new ReservationCardLoyaltyView(that.myDom);
		reservationCardLoyaltyView.initialize();
		var reservationCardNotes = new reservationCardNotesView(that.myDom);
		reservationCardNotes.initialize();
	};

	this.gotToChangeDatesScreen = function() {
		sntapp.activityIndicator.showActivityIndicator("blocker");
		var viewURL = "/staff/change_stay_dates/"+getReservationId();
	    var viewDom = $("#view-nested-second");
	    var reservation_id = getReservationId();
	    var nextViewParams = {"reservation_id": reservation_id};
	    sntapp.fetchAndRenderView(viewURL, viewDom, {}, 'NORMAL', nextViewParams);
	};

	this.setNewspaperPreferance = function(e) {
		var newspaperValue = that.myDom.find('#reservation_newspaper').val();
		var reservation_id = getReservationId();

		var data = {
			"reservation_id" : reservation_id,
			"selected_newspaper" : newspaperValue
		};
		var webservice = new WebServiceInterface();
		var options = {
			requestParameters : data
		};
		webservice.postJSON('/reservation/add_newspaper_preference', options);
	};
	this.setWakeUpCallModal = function(e) {
		if ($(e.target).hasClass("feature-available")) {

			var setWakeUpCallModal = new SetWakeUpCallModal();
			setWakeUpCallModal.params = {
				"reservation_id" : that.reservation_id
			};
			setWakeUpCallModal.type = "POST";
			setWakeUpCallModal.initialize();
		} else {
			that.showErrorMessage("Feature not available");
		}
	};

	this.roomNumberClicked = function(e) {
		e.preventDefault();
		var nextViewParams = {
			"next_view" : views.STAYCARD
		};
		that.goToRoomAssignmentView(nextViewParams);
	};

	this.goToRoomAssignmentView = function(nextViewParams) {
		sntapp.activityIndicator.showActivityIndicator("blocker");
		var viewURL = "staff/preferences/room_assignment";
		var viewDom = $("#view-nested-second");
		var reservation_id = getReservationId();
		var params = {
			"reservation_id" : reservation_id
		};
		sntapp.fetchAndRenderView(viewURL, viewDom, params, 'NORMAL', nextViewParams);
	};

	this.addKeysModal = function(e) {
		// If QR Code status enabled - show QR Code Modal 
		// Else show key genaration Modal
		if ($(e.target).closest('a').attr("data-qr-code") == "true") {
			var qrCodeModel = new QrCodeModel();
			qrCodeModel.initialize();
		} 
		else{
			var addKeysModal = new AddKeysModal();
			addKeysModal.initialize();
		}
	};
	this.roomUpgradesClicked = function(e) {

		e.preventDefault();
		var nextViewParams = {
			"showanimation" : true,
			"next_view" : views.STAYCARD
		};
		that.goToRoomUpgradeView(nextViewParams);

	};
	this.goToRoomUpgradeView = function(nextViewParams) {
		sntapp.activityIndicator.showActivityIndicator("blocker");
		var viewURL = "staff/reservations/room_upsell_options";
		var viewDom = $("#view-nested-second");
		var reservation_id = getReservationId();
		var params = {
			"reservation_id" : reservation_id
		};
		sntapp.fetchAndRenderView(viewURL, viewDom, params, 'NORMAL', nextViewParams);
	};

	this.goToBillCardView = function(clickedButton) {
		sntapp.activityIndicator.showActivityIndicator("blocker");
		var viewURL = "staff/reservation/bill_card";
		//var viewURL = "ui/show?haml_file=staff/reservations/bill_card&json_input=registration_card/registration_card.json&is_hash_map=true&is_layout=false";
		var viewDom = $("#view-nested-third");
		var params = {
			"reservation_id" : that.reservation_id
		};
		var nextViewParams = {
			"showanimation" : true,
			"from-view" : views.STAYCARD,
			"clickedButton" : clickedButton
		};
		sntapp.fetchAndRenderView(viewURL, viewDom, params, 'NORMAL', nextViewParams);
	};
	this.clickedCheckoutButton = function() {
		that.goToBillCardView("CheckoutButton");
	};
	this.clickedViewBillButton = function(e) {
		sntapp.activityIndicator.showActivityIndicator("blocker");
		that.goToBillCardView("ViewBillButton");
	};
	this.clickedPostChargeButton = function(e) {
		var postChargeModel = new PostChargeModel();
		postChargeModel.initialize();

	};
	this.clickedTotalStayCost = function() {
		that.goToBillCardView("TotalStayCost");
	};
	this.validateEmailAndPhone = function(e) {
		var phone_num = $("#gc-phone").val();
		var email = $("#gc-email").val();

		if (phone_num == "" && email == "") {
			var validateCheckinModal = new ValidateCheckinModal();
			validateCheckinModal.initialize();
			validateCheckinModal.params = {
				"type" : "NoPhoneNoEmail"
			};
		} else if (phone_num == "") {
			var validateCheckinModal = new ValidateCheckinModal();
			validateCheckinModal.initialize();
			validateCheckinModal.params = {
				"type" : "NoPhone"
			};
		} else if (email == "") {
			var validateCheckinModal = new ValidateCheckinModal();
			validateCheckinModal.initialize();
			validateCheckinModal.params = {
				"type" : "NoEmail"
			};
		} else if (($.trim(that.myDom.find('#room-number strong').text()) == "") || (that.myDom.find('#room-number').attr('data-room-status') != "READY") || (that.myDom.find('#room-number').attr('data-fo-status') != "VACANT")) {

			var nextViewParams = {
				"next_view" : views.BILLCARD
			};
			sntapp.activityIndicator.showActivityIndicator("blocker");
			that.goToRoomAssignmentView(nextViewParams);
		} else if ((that.myDom.find('#reservation-checkin').attr('data-force-upsell') == "true") && (that.myDom.find('#reservation-checkin').attr('data-upsell-available') == "true")) {

			var nextViewParams = {
				"showanimation" : true,
				"next_view" : views.BILLCARD
			};
			sntapp.activityIndicator.showActivityIndicator("blocker");
			that.goToRoomUpgradeView(nextViewParams);
		} else {
			sntapp.activityIndicator.showActivityIndicator("blocker");
			that.goToBillCardView("CheckinButton");
		}
	};

};

