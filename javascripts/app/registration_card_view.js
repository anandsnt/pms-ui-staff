var RegistrationCardView = function(viewDom){
  BaseView.call(this);
  var that = this;
  this.myDom = viewDom;
  this.reservation_id = getReservationId();
  this.url = "ui/checkinSuccess";
  
  this.pageinit = function(){
    
    setTimeout(function(){
        createViewScroll('#registration-content');
  	}, 300);
  	
  	var width = that.myDom.find("#signature").width();
  	that.myDom.find("#signature").jSignature({height:130, width:width, lineWidth :1});
	that.myDom.find("#signature canvas").addClass('pad');
	 
	that.myDom.find("#signature").on('mouseover',function(){
		viewScroll.disable();
	});	
	that.myDom.find("#signature").on('mouseout',function(){
		viewScroll.enable();
	});
	
	var reservation_status = that.myDom.find("#registration-content").attr("data-reservation-status");
	
	if(this.viewParams.clickedButton == "ViewBillButton"){
		// To Display Guest Bill screen in detailed mode via ViewBillButton click.
      	that.myDom.find("#bill1-fees").removeClass("hidden");
	}
	if(this.viewParams.clickedButton == "CheckoutButton" || reservation_status == "CHECKING_OUT"){
		// To show 'COMPLETE CHECK OUT' button when Reservation is DUE OUT,regardless of how it has been accessed.
		// Always show 'COMPLETE CHECK OUT' button when click "CheckoutButton" in stay card.
      	that.myDom.find("#complete-checkout-button").removeClass("hidden");
	}
	// To add active class to the first bill tab
	that.myDom.find("#bills-tabs-nav li[bill_active='true']").addClass('active');
	
  };
  
  this.executeLoadingAnimation = function(){
  	
  	if (this.viewParams === undefined) return;
  	if (this.viewParams["showanimation"] === false) return;
	
	  if (this.viewParams["from-view"] === views.STAYCARD)
  		changeView("nested-view", "", "view-nested-first", "view-nested-third", "move-from-right", false);
  	else if ((this.viewParams["from-view"] === views.ROOM_ASSIGNMENT)||
            (this.viewParams["from-view"] === views.ROOM_UPGRADES))
  		changeView("nested-view", "", "view-nested-second", "view-nested-third", "move-from-right", false);
  	 
  };
  
  this.delegateEvents = function(){
  	this.bill_number = that.myDom.find("#bills li.active").attr('data-bill-number');
  	that.myDom.find('#checkin-button').on('click', that.completeCheckin);
  	that.myDom.find('#clear-signature').on('click',that.clearSignature);
  	that.myDom.find('#back-to-staycard').on('click',that.gotoStayCard);
  	that.myDom.find('#complete-checkout-button').on('click',that.clickedCompleteCheckout);
  	that.myDom.find('#pay-button').on('click',that.payButtonClicked);
  };
  
  this.reloadBillCardPage = function(){
  	var viewURL = "staff/reservation/bill_card";
	var viewDom = $("#view-nested-third");
	var params = {"reservation_id": that.reservation_id};
	var nextViewParams = {"showanimation": false, "current-view" : "staycard" };
	sntapp.fetchAndRenderView(viewURL, viewDom, params, 'NONE', nextViewParams );
  };
  
  this.completeCheckin = function(e){
  	
  	e.stopPropagation();
  	e.preventDefault();
  	e.stopImmediatePropagation();
  	
  	var signature = JSON.stringify($("#signature").jSignature("getData", "native"));
  	var terms_and_conditions = that.myDom.find("#terms-and-conditions").hasClass("checked")? 1 : 0;
  	var errorMessage ="";
  	
  	if(signature == "[]") errorMessage = "Signature is missing";
  	else if(!terms_and_conditions) errorMessage ="Please check agree to the Terms & Conditions";
  	
   	if (errorMessage!="") {
   		that.showErrorMessage(errorMessage);
  		return;
  	}
  	else{	
	  	var is_promotions_and_email_set = that.myDom.find("#subscribe-via-email").hasClass("checked") ? 1 : 0;
	  	var data= {
		    "is_promotions_and_email_set": is_promotions_and_email_set,
		    "signature": signature,
		    "reservation_id":that.reservation_id
		};
		$.ajax({
		    type: "POST",
		    url: '/staff/checkin',
		    data : data,
		    success: function(data) {
		    	if(data.status == "success"){
		    		that.openAddKeysModal();
				}
				else if(data.status == "failure"){
					that.showErrorMessage(data.errors);
				}
		    },
		    error: function(){
			}
	  	});
	 }
  };
  this.clearSignature = function(){
  	that.myDom.find("#signature").jSignature("reset");
  };

  this.gotoStayCard = function(e){
	e.preventDefault();
  //goBackToView("", "view-nested-third", "move-from-left");
	var $loader = '<div id="loading"><div id="loading-spinner" /></div>';
	$($loader).prependTo('body').show();
	
	changeView("nested-view", "", "view-nested-third", "view-nested-first", "move-from-left", false);
  };
  this.goToRoomUpgradeView = function(e){
	e.preventDefault();
  //goBackToView("", "view-nested-third", "move-from-left");
	var $loader = '<div id="loading"><div id="loading-spinner" /></div>';
	$($loader).prependTo('body').show();  
	changeView("nested-view", "", "view-nested-third", "view-nested-second", "move-from-left", false);   
  };
  
  this.clickedCompleteCheckout = function(e){
  	e.stopPropagation();
  	e.preventDefault();
  	e.stopImmediatePropagation();
  	
  	var balance_amount = that.myDom.find("#balance-amount").attr("data-balance-amount");
  	
  	if(balance_amount != 0){
  		// When balance amount is not 0 - perform payment action.
  		that.payButtonClicked();
  	}
  	else{
  		// When balance amount is 0 - perform complete check out action.
  		$.ajax({
		    type: "POST",
		    url: '/staff/checkout',
		    data : {"reservation_id" : that.reservation_id},
		    success: function(data) {
		    	if(data.status == "success"){
		    		that.showSuccessMessage(data.data,that.goToSearchScreen);
		    	}
		    	else if(data.status == "failure"){
		    		that.showErrorMessage(data.errors);
		    	}
		    },
		    error: function(){
			}
	  	});
  	}
  };
  // To show payment modal
  this.payButtonClicked = function(){
  	var billCardPaymentModal = new BillCardPaymentModal(that.reloadBillCardPage);
  	billCardPaymentModal.initialize();
  	billCardPaymentModal.params = {"bill_number":that.bill_number};
  };
  // Goto search screen
  this.goToSearchScreen = function(){
  	switchPage('main-page','search','','page-main-second','move-from-left');
  };
  // To show add keys modal
  this.openAddKeysModal = function(e){
    var addKeysModal = new AddKeysModal(that.showCheckinSuccessModal);
    addKeysModal.initialize();
    addKeysModal.params = {"source_page": "bill_card"};
  };
  // To show success message after check in
  this.showCheckinSuccessModal = function(e){
  	var message = $("#gc-firstname").val()+" "+$("#gc-lastname").val()+" IS CHECKED IN";
  	that.showSuccessMessage(message,that.goToSearchScreen);
  };
  
};

