var RegistrationCardView = function(viewDom){
  BaseView.call(this);
  var that = this;
  this.myDom = viewDom;
  this.reservation_id = getReservationId();
  this.url = "ui/checkinSuccess";
  
  this.pageinit = function(){
    if (viewScroll) { destroyViewScroll(); }
    setTimeout(function(){
        createViewScroll('#registration-content');
  	}, 300);
  	
  	var width = that.myDom.find("#signature").width();
  	that.myDom.find("#signature").jSignature({height:130, width:width, lineWidth :1});
	that.myDom.find("#signature canvas").addClass('pad');
	 
	$("#signature").on('mouseover',function(){
		viewScroll.disable();
	});	
	$("#signature").on('mouseout',function(){
		viewScroll.enable();
	});
	
	var reservation_status = that.myDom.find("#registration-content").attr("data-reservation-status");
	
	if(this.viewParams.clickedButton == "ViewBill button"){
		// To Display Guest Bill screen in detailed mode via ViewBillButton click.
      	that.myDom.find("#bill1-fees").removeClass("hidden");
	}
	else if(this.viewParams.clickedButton == "CheckoutButton" || reservation_status == "CHECKING_OUT"){
		// To show 'COMPLETE CHECK OUT' button when Reservation is DUE OUT,regardless of how it has been accessed.
		// Always show 'COMPLETE CHECK OUT' button when click "CheckoutButton" in stay card.
      	that.myDom.find("#complete-checkout-button").removeClass("hidden");
	}
  };
  
  this.executeLoadingAnimation = function(){
  	
  	if (this.viewParams === undefined) return;
  	if (this.viewParams["showanimation"] === false) return;
	
	if (this.viewParams["current-view"] === "staycard")
  		changeView("nested-view", "", "view-nested-first", "view-nested-third", "move-from-right", false);
  	else
  		changeView("nested-view", "", "view-nested-second", "view-nested-third", "move-from-right", false);
  	 
  };
  
  this.delegateEvents = function(){
  	that.myDom.find('#checkin-button').on('click', that.completeCheckin);
  	that.myDom.find('#clear-signature').on('click',that.clearSignature);
  	that.myDom.find('#back-to-staycard').on('click',that.gotoStayCard);
  };
  
  this.reloadBillCardPage = function(){
  	var viewURL = "staff/reservation/bill_card";
	var viewDom = $("#view-nested-third");
	var params = {"reservation_id": that.reservation_id};
	var nextViewParams = {"showanimation": false, "current-view" : "staycard" };
	sntapp.fetchAndRenderView(viewURL, viewDom, params, false, nextViewParams );
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
   		alert(errorMessage);
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
				      var message = $("#gc-firstname").val()+" "+$("#gc-lastname").val()+" IS CHECKED IN";
					  var successModal = new SuccessModal();
					  successModal.initialize();
					  successModal.params = {"message": message};
				}
				if(data.status == "failure"){
					alert(data.errors);
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
	var $loader = '<div id="loading" />';
	$($loader).prependTo('body').show();
	
	changeView("nested-view", "", "view-nested-third", "view-nested-first", "move-from-left", false);
  };
  this.goToRoomUpgradeView = function(){
	e.preventDefault();
	var $loader = '<div id="loading" />';
	$($loader).prependTo('body').show();  
	changeView("nested-view", "", "view-nested-third", "view-nested-second", "move-from-left", false);   

  };
};