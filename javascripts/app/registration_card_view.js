var RegistrationCardView = function(viewDom) {
	BaseView.call(this);
	var that = this;
	this.myDom = viewDom;
	this.reservation_id = getReservationId();
	this.url = "ui/checkinSuccess";
    this.reviewStatus = [];
    this.isAllBillsReviewed = false;
    this.isEarlyDepartureFlag = "false";
    sntapp.cardData = {};

    //Stores the card data to process while check-in
    sntapp.regCardData = {};
    
	this.pageinit = function() {
		this.setBillTabs();
		createVerticalScroll('#registration-content');

		var width = that.myDom.find("#signature-pad").width();
		
		that.myDom.find("#signature").jSignature({
			height : 130,
			width : width-20,
			lineWidth : 1
		});
		that.myDom.find("#signature canvas").addClass('pad');

		if (that.viewParams.clickedButton == "ViewBillButton" || that.viewParams.clickedButton == "TotalStayCost") {
			that.renderedFromViewBillButton();
		}
		
		// A dirty hack to allow "this" instance to be refered from sntapp
		sntapp.setViewInst('registrationCardView', function() {
			return that;
		});
		
		//Initializing review status list
		that.myDom.find("#bills-tabs-nav ul li").each(function(i) {
			var data = {};
			data.review_status = 0;
			data.bill_number = $(this).attr("data-bill-number");
			that.reviewStatus.push(data);
		});
		
		
		
		
	  };

	this.pageshow = function(){
		sntapp.cardSwipeCurrView = 'GuestBillView';
		
		var currentStatus= "";
		var shouldShowPaymentPopUp =  false;
        if(!($("#checkin-button").parent().parent().hasClass("hidden"))){
      		currentStatus = $("#registrationcard_main").attr("data-current-reservation-status");
      		if(currentStatus == "CHECKING_IN"){
      			shouldShowPaymentPopUp = true;
      		}
        }
        
      	if(shouldShowPaymentPopUp){
			that.addNewPaymentModal({}, {should_show_overlay: true});
		}
									
	};
	
    // To Display Guest Bill screen in detailed mode via ViewBillButton click.
	this.renderedFromViewBillButton =  function() {
		that.myDom.find("#bill1-total-fees .toggle:not(.signature-toggle)").addClass("active");
		that.myDom.find("#bill1-fees").removeClass("hidden");
		that.myDom.find("#signature-pad").addClass("hidden");
		that.myDom.find("#complete-checkout-button").addClass("hidden");
		that.myDom.find(".review").addClass("hidden");
		that.myDom.find("#terms-and-conditions").addClass("hidden");
	};
	
	this.executeLoadingAnimation = function() {
		if (!($('#loading').length)){
			sntapp.activityIndicator.showActivityIndicator("blocker");
		}
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
		that.myDom.unbind('click');
		that.myDom.on('click', that.myDomClickHandler);
		that.myDom.find("#signature").on('mouseover touchstart', function() {
			disableVerticalScroll('#registration-content');
		});
		that.myDom.find("#signature").on('mouseout touchend', function() {
			enableVerticalScroll('#registration-content');
		});
		
		that.myDom.find('.movetobill').on('change', that.moveToAnotherBill);
	};

	// function for closing the drawer if is open
	this.closeGuestCardDrawer = function(){
		if($('#guest-card').height() > '90') {
			$('#guest-card .ui-resizable-handle').trigger('click');
		}
	};

	// function to hanlde the click operation in the dom	
	this.myDomClickHandler = function (event) {
		that.closeGuestCardDrawer();
		sntapp.notification.hideMessage(that.myDom);
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
	    	sntapp.paymentTypeSwipe = false;
	    	//return that.clickedRemovePayment(event);
	    	return that.addNewPaymentModal(event);
	    }
	    if(getParentWithSelector(event, "#select-card-from-list")) {
	    	return that.showExistingPayments(event);
	    }
	    if(getParentWithSelector(event, "#add-new-payment")) {
			sntapp.paymentTypeSwipe = false;
	    	return that.addNewPaymentModal(event);
	    }
	    if(getParentWithSelector(event, "#bills-tabs-nav li")) {
	    	return that.clickedBillTab(event);
	    }
	    if(getParentWithSelector(event, "#agree")){
	    	event.preventDefault();
	    	event.stopImmediatePropagation();
	    	event.stopPropagation();
	    	return that.showTermsAndConditionsModal();
	    }
	    
	};
	this.showTermsAndConditionsModal = function(){
		var showTermsAndConditions = new showTermsAndConditionsModal();
    	showTermsAndConditions.initialize();
	};

     // function for closing the drawer if is open
	that.closeGuestCardDrawer = function(){
		if($('#guest-card').height() > '90') {
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
	this.setBillTabs = function() {
		$('#bills').tabs({
		 	beforeActivate: function(event, ui){
               // Refresh scrolls when siwtching between tabs
               refreshVerticalScroll('#registration-content', 0);                        
            },
			create : function(event, ui) {
				var $tab = ui.panel.attr('id'),
					$scrollable = $('#' + $tab).find('.wrapper')
					$itemsWidth = 0;

				// Set wrapper width for horizontal scroll and calculate width
				$("#" + $tab).find('.wrapper li').each(function() {
				    $itemsWidth += $(this).outerWidth(true);
				});
				$($scrollable).css('width', $itemsWidth + 5);
				createHorizontalScroll('#' + $tab + '-summary');
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
			"current-view" : "staycard",
			"clickedButton" : that.viewParams.clickedButton
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
		console.log("completeCheckinSuccess");

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
		sntapp.notification.showErrorMessage("Error: " + errorMessage, that.myDom);  
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
      	
      	// To update reservation card icon on reservation listing after : complete checkin -> keys -> goto staycard
      	if(e === undefined){
	      	var confirmation_num = getCurrentConfirmation();
	      	var reservation_status = $("#reservation-"+confirmation_num).attr("data-reservation-status");
      		var reservation_icon = "guest-status inhouse small-icon";
      		$(".reservations-tabs ul li[data-confirmation-num = "+confirmation_num+"] span.guest-status").removeClass().addClass(reservation_icon);
		}
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
		
		// Updating current review status.
		var current_bill_number = that.getActiveBillNumber();
		for(var i=0; i < that.reviewStatus.length ; i++){
			if(that.reviewStatus[i].bill_number == current_bill_number){
				that.reviewStatus[i].review_status = 1;
			}
		}
		
		that.findNextBillToReview();
		
	};
	// To find next tab which is not reviewed before.
	this.findNextBillToReview = function() {
		for(var i=0; i < that.reviewStatus.length ; i++){
			if(that.reviewStatus[i].review_status == 0){
				// when all bills reviewed and reached final bill
				if(that.reviewStatus.length == (i+1)) that.isAllBillsReviewed = true;
				
				next_tab = that.myDom.find("#bills-tabs-nav ul li[data-bill-number = "+that.reviewStatus[i].bill_number+"]");
				break;
			}
		}
		next_tab.find('a').trigger('click');
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
		
		//Instance does not exist - First Time invocation.
	  	if ( !sntapp.getViewInst('addNewPaymentModal') ) {
	      sntapp.setViewInst('addNewPaymentModal', function() {
	      	  return new AddNewPaymentModal(views.BILLCARD, domElement);
	      });
	      if(options && options.should_show_overlay){
	    	sntapp.getViewInst('addNewPaymentModal').should_show_overlay=true;
	      }
	      sntapp.getViewInst('addNewPaymentModal').initialize();
	      sntapp.getViewInst('addNewPaymentModal').params = 
	      				{ "bill_number" :that.getActiveBillNumber(),
	      				  "origin":views.BILLCARD};
	   
	    } else if (sntapp.getViewInst('addNewPaymentModal') && !$('#new-payment').length) {
	
	      // if addNewPaymentModal instance exist, but the dom is removed
	      sntapp.updateViewInst('addNewPaymentModal', function() {
	        return new AddNewPaymentModal(views.BILLCARD, domElement);
	      });
	      if(options && options.should_show_overlay){
	    	sntapp.getViewInst('addNewPaymentModal').should_show_overlay=true;
	      }
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
		
		that.findNextBillToReview();
		if(!that.isAllBillsReviewed){
			return;
		}
		
		// If reservation status in INHOUSE - show early checkout popup
		var reservationStatus = that.myDom.find("#complete-checkout-button").attr('data-reseravation-status');
		if(reservationStatus == "CHECKEDIN" && that.isEarlyDepartureFlag == "false"){
			var earlyDepartureModal = new EarlyDepartureModal(that.completeCheckout,that);
			earlyDepartureModal.initialize();
			return;
		}
		
		var required_signature_at = that.myDom.find("#complete-checkout-button").attr('data-required-signature');
		var email = $("#gc-email").val();
		var signature = JSON.stringify(that.myDom.find("#signature").jSignature("getData", "native"));
		var terms_and_conditions = that.myDom.find("#terms-and-conditions").hasClass("checked") ? 1 : 0;
		var errorMessage = "";

		if (signature == "[]" && required_signature_at == "CHECKOUT")
			errorMessage = "Signature is missing";
		else if (!terms_and_conditions)
			errorMessage = "Please check the box to accept the charges";

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
		var checkoutSuccessModal = new CheckoutSuccessModal(that.goToSearchScreen);
		checkoutSuccessModal.initialize();
		checkoutSuccessModal.params = {"message": data.data};
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
		var nextPage = 'page-main-second';
 		if($(".container div").hasClass('prev-page-current')){
 			nextPage = $(".container .prev-page-current").attr('id');
 			console.log(nextPage);
 		}
 		switchPage('main-page', 'search', '', nextPage, 'move-from-left');
		//switchPage('main-page', 'search', '', 'page-main-second', 'move-from-left');
		//Do not call 'initialize' method for this object. which results multiple event binding
		var searchView = new Search();
		searchView.clearResults();
	};
	// To get current active bill's bill-number
	this.getActiveBillNumber =  function() {
		
		return that.myDom.find("#bills-tabs-nav ul li.ui-tabs-active").attr('data-bill-number');
	};

	this.moveToAnotherBill = function(e) {

		var element = $(e.target);

		var current_bill_number = that.getActiveBillNumber();
		var to_bill_number = element.val();
		var reservation_id = getReservationId();
		var transaction_id = element.attr('data-transaction_id');

		var data = {
			"reservation_id" : reservation_id,
			"to_bill" : to_bill_number,
			"from_bill" : current_bill_number,
			"transaction_id" : transaction_id
		};

		var webservice = new WebServiceInterface();
		var options = {
			requestParameters : data,
			successCallBack : that.reloadBillCardPage
		};
		webservice.postJSON('/staff/bills/transfer_transaction', options);
	};
	// To handle bill tab click
	that.clickedBillTab = function(e){
		var elem = $(e.target);
		var billNo = elem.attr('data-bill-number');
		var activeTab = that.myDom.find("#bill"+billNo+"-summary li a.active");
		var activeTabExpandedId = activeTab.attr('href');
		
		if(that.myDom.find(activeTabExpandedId).hasClass('hidden')){
			that.myDom.find(activeTab).removeClass('active');
		}
	};
};

