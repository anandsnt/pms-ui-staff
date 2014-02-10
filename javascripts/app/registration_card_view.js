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
			that.myDom.find(".review").addClass("hidden");
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
	    	return that.goAndRefreshStayCard(event);
	    	//return that.gotoStayCard(event);
	    }
	    if(getParentWithSelector(event, "#review-bill-button")) {
	    	return that.clickedReviewBill(event);
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
	    if(getParentWithSelector(event, "#update_card")) {
	    	//return that.clickedRemovePayment(event);
	    	return that.addNewPaymentModal(event);
	    }
	    if(getParentWithSelector(event, "#select-card-from-list")) {
	    	return that.showExistingPayments(event);
	    }
	    if(getParentWithSelector(event, "#add-new-payment")) {
	    	return that.addNewPaymentModal(event);
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
			sntapp.fetchAndRenderView(viewURL, viewDom, params, 'BLOCKER', nextViewParams);
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
				loader: "blocker"
			};
			webservice.postJSON(url, options);
		}
	};
	
	this.completeCheckinSuccess = function(data) {

		var keySettings = that.myDom.find("#checkin-button").attr("data-key-settings");
		var reservationStatus = that.myDom.find("#checkin-button").attr('data-reseravation-status');
		var is_promotions_and_email_set = that.myDom.find("#subscribe-via-email").hasClass("checked") ? 1 : 0;
		
		if(keySettings == "email"){
			var keyEmailModal = new KeyEmailModal(that.goAndRefreshStayCard,that.goToSearchScreen);
			keyEmailModal.initialize();
			keyEmailModal.params = {
				"origin" : views.BILLCARD,
				"reservationStatus" : reservationStatus
			};
		}
		else if(keySettings == "qr_code_tablet") {
			var keyQrCodeModel = new KeyQrCodeModel(that.goAndRefreshStayCard,that.goToSearchScreen);
			keyQrCodeModel.initialize();
			keyQrCodeModel.params = {
				"origin" : views.BILLCARD,
				"reservationStatus" : reservationStatus
			};
		}
		
		else if(keySettings == "encode"){
			var keyEncoderModal = new KeyEncoderModal(that.goAndRefreshStayCard, that.goToSearchScreen);
			keyEncoderModal.initialize();
			keyEncoderModal.params = {
				"origin" : views.BILLCARD,
				"reservationStatus" : reservationStatus
			};
			
		}

		if (is_promotions_and_email_set) {
			//To enable EMAIL OPT IN check button in guest card
			$("#contact-info input#opt-in").prop("checked", true);
		}
		else {
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
	//Review button clicks
	this.clickedReviewBill = function(e) {
		e.stopPropagation();
		e.preventDefault();
		e.stopImmediatePropagation();

		var element = $(e.target).closest('button');
		element.removeClass("red").addClass("grey");
		element.attr("disabled","disabled");
		
		// Switch to next bill which is not reviewed
		
		var current_tab = that.myDom.find("#bills-tabs-nav ul li.ui-tabs-active");
		var next_tab = that.myDom.find("#bills-tabs-nav ul li.ui-tabs-active").next();
		var current_bill_number = that.getActiveBillNumber();
		current_tab.addClass('reviewed');
		
		// To find next tab - whcih is not reviewed yet
		that.myDom.find("#bills-tabs-nav ul li").each(function() {
			var number = $(this).attr('data-bill-number');
			var is_found = false;
			if(number == current_bill_number){
				$(this).addClass('reviewed');
				is_found = true;
			}
			if(is_found){
				if(!$(this).next().hasClass('reviewed')){
					next_tab = $(this).next();
					is_found =false;
				}
			}
		});
		console.log(next_tab);
		
		next_tab.addClass('ui-tabs-active ui-state-active');
		current_tab.removeClass("ui-tabs-active ui-state-active");
		var next_bill_number = next_tab.attr('data-bill-number');
		console.log(next_bill_number);
		
		that.myDom.find("#bill"+next_bill_number).show();
		that.myDom.find("#bill"+current_bill_number).hide();
	};
	
	// To select credit card from bill
	this.showExistingPayments = function(e) {
		var domElement = $("#bill"+that.getActiveBillNumber());
		var showExistingPaymentModal = new ShowExistingPaymentModal(domElement);
    	showExistingPaymentModal.initialize();
    	showExistingPaymentModal.params = {"bill_number":that.getActiveBillNumber(),"origin":views.BILLCARD};
	};
	// To add new payment from bill card
	this.addNewPaymentModal = function(event, options){
		var domElement = $("#bill"+that.getActiveBillNumber());
	  	if ( !sntapp.getViewInst('addNewPaymentModal') ) {
	      sntapp.setViewInst('addNewPaymentModal', function() {
	        return new AddNewPaymentModal('staycard', domElement);
	      });
	      sntapp.getViewInst('addNewPaymentModal').initialize();
	      sntapp.getViewInst('addNewPaymentModal').params = { "bill_number" : that.getActiveBillNumber(),"origin":views.BILLCARD};
	    } else if (sntapp.getViewInst('addNewPaymentModal') && !$('#new-payment').length) {
	
	      // if addNewPaymentModal instance exist, but the dom is removed
	      sntapp.updateViewInst('addNewPaymentModal', function() {
	        return new AddNewPaymentModal('staycard', domElement);
	      });
	      sntapp.getViewInst('addNewPaymentModal').initialize();
	      sntapp.getViewInst('addNewPaymentModal').params = { "bill_number" : that.getActiveBillNumber(),"origin":views.BILLCARD};
	    }
  	};
	//function on click complete checkout button
	this.clickedCompleteCheckout = function(e) {
		e.stopPropagation();
		e.preventDefault();
		e.stopImmediatePropagation();

		var email = $("#gc-email").val();
		// If email is null then popup comes to enter email
		if (email == "") {
			var validateCheckoutModal = new ValidateCheckoutModal(that.completeCheckout,e);
			validateCheckoutModal.initialize();
			validateCheckoutModal.params = {
				"type" : "NoEmail"
			};
		}
		else {
			that.completeCheckout(e);
		}

	};
	// Complete checkout operation
	this.completeCheckout = function(e) {
		
		var required_signature_at = that.myDom.find("#complete-checkout-button").attr('data-required-signature');
		
		var email = $("#gc-email").val();
		var signature = JSON.stringify(that.myDom.find("#signature").jSignature("getData", "native"));
		var terms_and_conditions = that.myDom.find("#terms-and-conditions").hasClass("checked") ? 1 : 0;
		var errorMessage = "";

		if (signature == "[]" && required_signature_at == "CHECKOUT")
			errorMessage = "Signature is missing";
		else if (!terms_and_conditions)
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
			failureCallBack : that.fetchFailedOfCompleteCheckout,
			loader : 'blocker'
		};
		webservice.postJSON(url, options);
	};
	// Success of complete checkout
	this.fetchCompletedOfCompleteCheckout = function(data) {
		that.showSuccessMessage(data.data, that.goToSearchScreen);
	};
	// Failure of complete checkout
	this.fetchFailedOfCompleteCheckout = function(errorMessage) {
		sntapp.activityIndicator.hideActivityIndicator();
		sntapp.notification.showErrorMessage("Error: " + errorMessage, that.myDom);  
	};
	// To show post charge modal
	this.addNewButtonClicked = function() {
		var postChargeModel = new PostChargeModel(that.reloadBillCardPage);
		postChargeModel.initialize();
		var bill_number = that.getActiveBillNumber();
		postChargeModel.params = {
			"origin" : views.BILLCARD,
			"bill_number" : bill_number
		};
	};

	// Goto search screen with empty search results
	this.goToSearchScreen = function() {
		switchPage('main-page', 'search', '', 'page-main-second', 'move-from-left');
		//Do not call 'initialize' method for this object. which results multiple event binding
		var searchView = new Search();
		searchView.clearResults();
	};
	// To get current active bill's bill-number
	this.getActiveBillNumber =  function() {
		return that.myDom.find("#bills-tabs-nav ul li.ui-tabs-active").attr('data-bill-number');
	};

};

