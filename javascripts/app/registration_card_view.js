var RegistrationCardView = function(viewDom) {
	BaseView.call(this);
	var that = this;
	this.myDom = viewDom;
	this.reservation_id = getReservationId();
	this.url = "ui/checkinSuccess";

	this.pageinit = function() {

		this.createHorizontalScroll();

		setTimeout(function() {
			createViewScroll('#registration-content');
		}, 300);

		var width = that.myDom.find("#signature").width();
		that.myDom.find("#signature").jSignature({
			height : 130,
			width : width,
			lineWidth : 1
		});
		that.myDom.find("#signature canvas").addClass('pad');

		that.myDom.find("#signature").on('mouseover', function() {
			viewScroll.disable();
		});
		that.myDom.find("#signature").on('mouseout', function() {
			viewScroll.enable();
		});

		var reservation_status = that.myDom.find("#registration-content").attr("data-reservation-status");
		
		if (this.viewParams.clickedButton == "ViewBillButton") {
			// To Display Guest Bill screen in detailed mode via ViewBillButton click.
			that.myDom.find("#bill1-fees").removeClass("hidden");
			that.myDom.find("#signature-pad").addClass("hidden");
			that.myDom.find("#complete-checkout-button").addClass("hidden");
			that.myDom.find("#terms-and-conditions").addClass("hidden");
		}
		
		// A dirty hack to allow "this" instance to be refered from sntapp
		sntapp.setViewInst('registrationCardView', function() {
			return that;
		});
	};

	this.pageshow = function(){
		sntapp.cardSwipeCurrView = 'GuestBillView';
	};

	this.executeLoadingAnimation = function() {
		sntapp.activityIndicator.showActivityIndicator("blocker");
		if (this.viewParams === undefined)
			return;
		if (this.viewParams["showanimation"] === false)
			return;

		if (this.viewParams["from-view"] === views.STAYCARD)
			changeView("nested-view", "", "view-nested-first", "view-nested-third", "move-from-right", false);
		else if ((this.viewParams["from-view"] === views.ROOM_ASSIGNMENT) || (this.viewParams["from-view"] === views.ROOM_UPGRADES))
			changeView("nested-view", "", "view-nested-second", "view-nested-third", "move-from-right", false);

	};

	this.delegateEvents = function() {
		this.bill_number = that.myDom.find("#bills li.active").attr('data-bill-number');
		that.myDom.unbind('click');
		that.myDom.on('click', that.myDomClickHandler);
	};

	// function for closing the drawer if is open
	this.closeGuestCardDrawer = function(){
		if($("#guest-card").hasClass('open')) {
			$('#guest-card .ui-resizable-handle').trigger('click');
		}
	};

	// function to hanlde the click operation in the dom	
	this.myDomClickHandler = function (event) {
		that.closeGuestCardDrawer();
		// based on event's target elements we are calling the event operations
	    if(getParentWithSelector(event, "#checkin-button")) {
	    	return that.completeCheckin(event);
	    }
	    if(getParentWithSelector(event, "#clear-signature")) {
	    	return that.clearSignature(event);
	    }	    
	    if(getParentWithSelector(event, "#back-to-staycard")) {
	    	return that.gotoStayCard(event);
	    }
	    if(getParentWithSelector(event, "#complete-checkout-button")) {
	    	return that.clickedCompleteCheckout(event);
	    }
	    if(getParentWithSelector(event, "#pay-button")) {
	    	return that.payButtonClicked();
	    }
	    if(getParentWithSelector(event, "#add-new-button")) {
	    	return that.addNewButtonClicked();
	    }
	    if(getParentWithSelector(event, "#subscribe")) {
	    	return that.subscribeCheckboxClicked(event);
	    }	    	    
	};

     // function for closing the drawer if is open
	that.closeGuestCardDrawer = function(){
		if($("#guest-card").hasClass('open')) {
			$('#guest-card .ui-resizable-handle').trigger('click');
		}
	};
	
	this.subscribeCheckboxClicked = function(e) {
		var guest_email = $("#contact-info #email").val();

		// To popup email opt modal when guest email field is empty.
		if ((!$(e.target).parent().hasClass('checked')) && guest_email == "") {
			var validateOptEmailModal = new ValidateOptEmailModal();
			validateOptEmailModal.initialize();
		}

	};
	this.createHorizontalScroll = function() {
		$('#bills').tabs({
			create : function(event, ui) {
				var $tab = ui.panel.attr('id'), $tabWidth = ui.panel.width(), $scrollable = $('#' + $tab).find('.wrapper');

				var $itemsWidth = 0;
				// To find total item's width - single item width + 5 (margin)
				that.myDom.find(".wrapper li").each(function(i) {
					$itemsWidth = $itemsWidth + $(this).width() + 5;
				});

				if ($itemsWidth > $tabWidth) {
					$('#' + $tab + '-summary').css({
						'padding-top' : '10px'
					});
					$($scrollable).css({
						'width' : $itemsWidth + 'px'
					});
					if (horizontalScroll) {
						destroyHorizontalScroll();
					}
					setTimeout(function() {
						createHorizontalScroll('#' + $tab + '-summary');
						refreshHorizontalScroll();
					}, 600);
				}
			}
		});
	};
	this.reloadBillCardPage = function() {
		var viewURL = "staff/reservation/bill_card";
		var viewDom = $("#view-nested-third");
		var params = {
			"reservation_id" : that.reservation_id
		};
		var nextViewParams = {
			"showanimation" : false,
			"current-view" : "staycard"
		};
		sntapp.fetchAndRenderView(viewURL, viewDom, params, 'BLOCKER', nextViewParams);
	};



	this.goToRoomAssignmentView = function() {
		that.myDom.html("");
		if ($('#roomassignment_main').length) {
			sntapp.activityIndicator.showActivityIndicator("blocker");
			changeView("nested-view", "", "view-nested-third", "view-nested-second", "move-from-left", false);
		} else {
			var nextViewParams = {
				"next_view" : views.BILLCARD,
				"from_view" : views.BILLCARD
			};
			sntapp.activityIndicator.showActivityIndicator("blocker");
			var viewURL = "staff/preferences/room_assignment";
			var viewDom = $("#view-nested-second");
			var reservation_id = getReservationId();
			var params = {
				"reservation_id" : reservation_id
			};
			sntapp.fetchAndRenderView(viewURL, viewDom, params, 'NORMAL', nextViewParams);
		}
	};

	this.completeCheckin = function(e) {

		e.stopPropagation();
		e.preventDefault();
		e.stopImmediatePropagation();
		var roomStatus = $(e.target).attr('data-room-status');
		var foStatus = $(e.target).attr('data-fo-status');
		var required_signature_at = $(e.target).attr('data-required-signature');
		
		if (roomStatus != "READY" || foStatus != "VACANT") {
			that.goToRoomAssignmentView();
			return false;
		}

		var signature = JSON.stringify(that.myDom.find("#signature").jSignature("getData", "native"));
		var terms_and_conditions = that.myDom.find("#terms-and-conditions").hasClass("checked") ? 1 : 0;
		var is_promotions_and_email_set = that.myDom.find("#subscribe-via-email").hasClass("checked") ? 1 : 0;
		var guest_email = $("#contact-info #email").val();

		var errorMessage = "";

		if (signature == "[]" && required_signature_at == "CHECKIN")
			errorMessage = "Signature is missing";
		else if (!terms_and_conditions)
			errorMessage = "Please check agree to the Terms & Conditions";

		if (errorMessage != "") {
			that.showErrorMessage(errorMessage);
			return;
		}
		else if (is_promotions_and_email_set && guest_email == "") {
			// To show pop up to add email adress when EMAIL OPT is enabled and guest email is blank.
			var validateOptEmailModal = new ValidateOptEmailModal();
			validateOptEmailModal.initialize();
			return;
		}
		else {
			
			var data = {
				"is_promotions_and_email_set" : is_promotions_and_email_set,
				"signature" : signature,
				"reservation_id" : that.reservation_id
			};

			var webservice = new WebServiceInterface();

			var url = '/staff/checkin';
			var options = {
				requestParameters : data,
				successCallBack : that.completeCheckinSuccess,
				failureCallBack : that.completeCheckinFailed,
			};
			webservice.postJSON(url, options);
		}
	};
	this.completeCheckinSuccess = function(data) {

		var dataKeySettings = that.myDom.find("#checkin-button").attr("data-key-settings");
		var reservationStatus = that.myDom.find("#checkin-button").attr('data-reseravation-status');
		var is_promotions_and_email_set = that.myDom.find("#subscribe-via-email").hasClass("checked") ? 1 : 0;
		
		if(dataKeySettings == "email"){
			var addKeysModal = new AddKeysModal(that.goAndRefreshStayCard,that.goToSearchScreen);
			addKeysModal.initialize();
			addKeysModal.params = {
				"origin" : views.BILLCARD,
				"reservationStatus" : reservationStatus
			};
		}
		else if(dataKeySettings == "qr_code_tablet") {
			var qrCodeModel = new QrCodeModel(that.goAndRefreshStayCard,that.goToSearchScreen);
			qrCodeModel.initialize();
			qrCodeModel.params = {
				"origin" : views.BILLCARD,
				"reservationStatus" : reservationStatus
			};
		}
		else if(dataKeySettings == "encode"){
			
			
		}

		if (is_promotions_and_email_set) {
			//To enable EMAIL OPT IN check button in guest card
			$("#contact-info input#opt-in").prop("checked", true);
		}else {
			//To disable EMAIL OPT IN check button in guest card
			$("#contact-info input#opt-in").prop("checked", false);
		}
	};
	this.completeCheckinFailed = function(errorMessage) {
		sntapp.activityIndicator.hideActivityIndicator();
		sntapp.notification.showErrorMessage("Some error occured: " + errorMessage, that.myDom);  
	  };
	this.clearSignature = function(e) {
		that.myDom.find("#signature").jSignature("reset");
	};

	this.gotoStayCard = function(e) {
		sntapp.activityIndicator.showActivityIndicator('blocker');
      	changeView("nested-view", "", "view-nested-third", "view-nested-first", "move-from-left", false);  
	};
	
	this.goAndRefreshStayCard = function(e) {
		var staycardView = new StayCard($("#view-nested-first"));
      	staycardView.refreshReservationDetails(that.reservation_id, that.gotoStayCard);
	};
	
	this.goToRoomUpgradeView = function(e) {
		e.preventDefault();
		//goBackToView("", "view-nested-third", "move-from-left");
		var $loader = '<div id="loading"><div id="loading-spinner" /></div>';
		$($loader).prependTo('body').show();
		changeView("nested-view", "", "view-nested-third", "view-nested-second", "move-from-left", false);
	};
	//function on click complete checkout button - If email is null then popup comes to enter email
	this.clickedCompleteCheckout = function(e) {
		e.stopPropagation();
		e.preventDefault();
		e.stopImmediatePropagation();

		var email = $("#gc-email").val();
		if (email == "") {
			var validateCheckoutModal = new ValidateCheckoutModal(that.completeCheckout, e);
			validateCheckoutModal.initialize();
			validateCheckoutModal.params = {
				"type" : "NoEmail"
			};
		}
		else {
			that.completeCheckout(e);
		}

	};

	this.completeCheckout = function(e) {
		var required_signature_at = $(e.target).attr('data-required-signature');
		var balance_amount = that.myDom.find("#balance-amount").attr("data-balance-amount");
		if (balance_amount > 0) {
			// When balance amount is greater than 0 - perform payment action.
			that.payButtonClicked();
		}
		else {
			// When balance amount is 0 - perform complete check out action.
			var email = $("#gc-email").val();
			var signature = JSON.stringify(that.myDom.find("#signature").jSignature("getData", "native"));
			var terms_and_conditions = that.myDom.find("#terms-and-conditions").hasClass("checked") ? 1 : 0;
			var errorMessage = "";

			if (signature == "[]" && required_signature_at == "CHECKOUT")
				errorMessage = "Signature is missing";
			else if (!terms_and_conditions && required_signature_at == "CHECKOUT")
				errorMessage = "Please check agree to the Terms & Conditions";

			if (errorMessage != "") {
				that.showErrorMessage(errorMessage);
				return;
			}
			var url = '/staff/checkout';
			var webservice = new WebServiceInterface();
			var data = {
				"reservation_id" : that.reservation_id,
				"email" : email,
				"signature" : signature
			};
			var options = {
				requestParameters : data,
				successCallBack : that.fetchCompletedOfCompleteCheckout,
				failureCallBack : that.fetchFailedOfSave,
				loader : 'blocker'
			};
			webservice.postJSON(url, options);
		}
	};

	this.fetchCompletedOfCompleteCheckout = function(data) {
		that.showSuccessMessage(data.data, that.goToSearchScreen);
	};

	// To show payment modal
	this.payButtonClicked = function() {
		var billCardPaymentModal = new BillCardPaymentModal(that.reloadBillCardPage);
		var bill_number = that.myDom.find("#bills-tabs-nav li.ui-tabs-active").attr('data-bill-number');
		billCardPaymentModal.params = {
			"bill_number" : bill_number
		};

		// send swipedCardData to bill card payment modal
		if (that.swipedCardData) {
			billCardPaymentModal.params = {
				"swipedCardData" : that.swipedCardData
			};
		};

		billCardPaymentModal.initialize();
	};
	// To show post charge modal
	this.addNewButtonClicked = function() {
		var postChargeModel = new PostChargeModel(that.reloadBillCardPage);
		postChargeModel.initialize();
		var bill_number = that.myDom.find("#bills-tabs-nav li.ui-tabs-active").attr('data-bill-number');
		postChargeModel.params = {
			"origin" : views.BILLCARD,
			"bill_number" : bill_number
		};
	};

	// Goto search screen with empty search results
	this.goToSearchScreen = function() {
		console.log("goToSearchScreen");
		switchPage('main-page', 'search', '', 'page-main-second', 'move-from-left');
		//Do not call 'initialize' method for this object. which results multiple event binding
		var searchView = new Search();
		searchView.clearResults();
	};
	// To show QR code modal
	this.openQrCodeModal = function(e) {
		var qrCodeModel = new QrCodeModel(that.showCheckinSuccessModal);
		qrCodeModel.initialize();
	};
	// To show success message after check in
	this.showCheckinSuccessModal = function(e) {
		console.log("showCheckinSuccessModal");
		var room_no = that.myDom.find('#registration-content').attr('data-room-number');
		var message = $("#gc-firstname").val() + " " + $("#gc-lastname").val() + " IS CHECKED IN TO ROOM " + room_no;
		that.showSuccessMessage(message, that.goToSearchScreen);
	};

};

