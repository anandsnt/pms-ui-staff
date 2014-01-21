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
		}
		if (this.viewParams.clickedButton == "CheckoutButton" || reservation_status == "CHECKING_OUT") {
			// To show 'COMPLETE CHECK OUT' button when Reservation is DUE OUT,regardless of how it has been accessed.
			// Always show 'COMPLETE CHECK OUT' button when click "CheckoutButton" in stay card.
			that.myDom.find("#complete-checkout-button").removeClass("hidden");
		}
		// To add active class to the first bill tab
		that.myDom.find("#bills-tabs-nav li[bill_active='true']").addClass('active');

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
		///that.myDom.find(('.bill-tabs')).tabs();
		// ui tabs
		this.bill_number = that.myDom.find("#bills li.active").attr('data-bill-number');
		that.myDom.find('#checkin-button').on('click', that.completeCheckin);
		that.myDom.find('#clear-signature').on('click', that.clearSignature);
		that.myDom.find('#back-to-staycard').on('click', that.gotoStayCard);
		that.myDom.find('#complete-checkout-button').on('click', that.clickedCompleteCheckout);
		that.myDom.find('#pay-button').on('click', that.payButtonClicked);
		that.myDom.find('#add-new-button').on('click', that.addNewButtonClicked);
		that.myDom.find('#subscribe').on('click', that.subscribeCheckboxClicked);
	};
    this.subscribeCheckboxClicked = function(e){
    	var guest_email = $("#contact-info #email").val();
    	
    	// To popup email opt modal when guest email field is empty.
    	if((!$(e.target).parent().hasClass('checked')) && guest_email == ""){
			var validateOptEmailModal = new ValidateOptEmailModal();
			validateOptEmailModal.initialize();
    	}
    	
    };
	this.createHorizontalScroll = function() {
		$('#bills').tabs({
			create:  function( event, ui ) {
				var $tab = ui.panel.attr('id'),
					$tabWidth = ui.panel.width(),
					$scrollable = $('#' + $tab).find('.wrapper');
					
				var $itemsWidth = 0;
				// To find total item's width - single item width + 5 (margin)
				that.myDom.find(".wrapper li" ).each(function(i) {
		  			$itemsWidth = $itemsWidth + $(this).width() +5;
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
		sntapp.fetchAndRenderView(viewURL, viewDom, params, 'NONE', nextViewParams);
	};

	this.completeCheckin = function(e) {

		e.stopPropagation();
		e.preventDefault();
		e.stopImmediatePropagation();

		var signature = JSON.stringify($("#signature").jSignature("getData", "native"));
		var terms_and_conditions = that.myDom.find("#terms-and-conditions").hasClass("checked") ? 1 : 0;
		var errorMessage = "";

		if (signature == "[]")
			errorMessage = "Signature is missing";
		else if (!terms_and_conditions)
			errorMessage = "Please check agree to the Terms & Conditions";

		if (errorMessage != "") {
			that.showErrorMessage(errorMessage);
			return;
		} else {
			var is_promotions_and_email_set = that.myDom.find("#subscribe-via-email").hasClass("checked") ? 1 : 0;
			var data = {
				"is_promotions_and_email_set" : is_promotions_and_email_set,
				"signature" : signature,
				"reservation_id" : that.reservation_id
			};
			$.ajax({
				type : "POST",
				url : '/staff/checkin',
				data : data,
				success : function(data) {
					if (data.status == "success") {
						that.openAddKeysModal();
						if(data.is_promotions_and_email_set == "true"){
							//To enable EMAIL OPT IN check button in guest card
							$("#contact-info input#opt-in").prop("checked",true);
						}
						else{
							//To disable EMAIL OPT IN check button in guest card
    						$("#contact-info input#opt-in").prop("checked",false);
						}
					} 
					else if (data.status == "failure") {
						that.showErrorMessage(data.errors);
					}
				},
				error : function() {
				}
			});
		}
	};
	this.clearSignature = function() {
		that.myDom.find("#signature").jSignature("reset");
	};

	this.gotoStayCard = function(e) {
		e.preventDefault();
		//goBackToView("", "view-nested-third", "move-from-left");
		var $loader = '<div id="loading"><div id="loading-spinner" /></div>';
		$($loader).prependTo('body').show();

		changeView("nested-view", "", "view-nested-third", "view-nested-first", "move-from-left", false);
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
	  	 if(email == ""){
	  	       	 var validateCheckoutModal = new ValidateCheckoutModal(that.completeCheckout, e);
	  	       	 validateCheckoutModal.initialize();
	  	       	 validateCheckoutModal.params = {"type": "NoEmail"};
	  	 } else {
	  		that.completeCheckout(e);
	  	 }
		
	};
	
	this.completeCheckout =  function(e){
		var balance_amount = that.myDom.find("#balance-amount").attr("data-balance-amount");
		if (balance_amount != 0) {
			// When balance amount is not 0 - perform payment action.
			that.payButtonClicked();
		} else {
			// When balance amount is 0 - perform complete check out action.
			var email = $("#gc-email").val();
			var url = '/staff/checkout';
			var webservice = new WebServiceInterface();
			var data = {
				"reservation_id" : that.reservation_id,
				"email" : email
			};
			var options = {
				requestParameters : data,
				successCallBack : that.fetchCompletedOfCompleteCheckout,
				loader : 'blocker'
			};
			webservice.postJSON(url, options);
		}
	};

	this.fetchCompletedOfCompleteCheckout = function(data) {
		that.showErrorMessage(data.data, that.goToSearchScreen);
	};

	// To show payment modal
	this.payButtonClicked = function() {
		var billCardPaymentModal = new BillCardPaymentModal(that.reloadBillCardPage);
		billCardPaymentModal.initialize();
		billCardPaymentModal.params = {
			"bill_number" : that.bill_number
		};
	};
	// To show post charge modal
	this.addNewButtonClicked = function() {
		var postChargeModel = new PostChargeModel(that.reloadBillCardPage);
		postChargeModel.initialize();
		postChargeModel.params = {
			"origin":"bill_card",
			"bill_number" : that.bill_number
		};
	};
	
	// Goto search screen with empty search results
	this.goToSearchScreen = function() {
		switchPage('main-page', 'search', '', 'page-main-second', 'move-from-left');
		//Do not call 'initialize' method for this object. which results multiple event binding
		var searchView = new Search();
		searchView.clearResults();
	};
	// To show add keys modal
	this.openAddKeysModal = function(e) {
		var addKeysModal = new AddKeysModal(that.showCheckinSuccessModal);
		addKeysModal.initialize();
		addKeysModal.params = {
			"source_page" : views.BILLCARD
		};
	};
	// To show success message after check in
	this.showCheckinSuccessModal = function(e) {
		var room_no = that.myDom.find('#registration-content').attr('data-room-number');
		var message = $("#gc-firstname").val() + " " + $("#gc-lastname").val() + " IS CHECKED IN TO ROOM " + room_no;
		that.showSuccessMessage(message, that.goToSearchScreen);
	};

};

