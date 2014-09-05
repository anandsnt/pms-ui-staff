var ShowMakePaymentModal = function() {

	BaseModal.call(this);
	var that = this;
	sntapp.cardSwipeCurrView = 'StayCardDepositModal';
	
	this.reservationId = getReservationId();
	this.url = "staff/reservations/"+that.reservationId+"/deposit_and_balance";

	this.delegateEvents = function() {
		that.myDom.find("#make-payment").attr("disabled", true);
		
		that.myDom.find('#close').on('click', that.hidePaymentModal);
		that.myDom.find("#make-payment").on('click', that.makePayment);
		that.myDom.find("#existing-cards").on('click', that.showExistingCards);
		that.myDom.find("#add-new-card").on('click', that.showAddCardScreen);
		that.myDom.find(".active-item").on('click', that.selectCreditCardItem);
	};
	this.hidePaymentModal = function(){
		sntapp.cardSwipeCurrView = 'StayCardView';
		that.hide();
	};
	this.dataUpdated = function(){
		console.log("=====================================");
	};
	this.makePayment = function(){
		
		var	amount = that.myDom.find("#amount").val();
			
		var webservice = new WebServiceInterface();
		if(that.myDom.find("#available-cards").attr("data-is-existing-card") == "yes"){
			var selectedPaymentId = that.myDom.find("#available-cards").attr("data-selected-payment");
			var data = {
				reservation_id : that.reservationId,
				 amount: amount,
				 payment_id: selectedPaymentId
			};
		} else {
			var cardNumber = that.myDom.find("#card-number").val(),
				expiryMonth = that.myDom.find("#expiry-month").val(),
				expiryYear = that.myDom.find("#expiry-year").val(),
				cardExpiry = expiryMonth && expiryYear ? "20"+expiryYear+"-"+expiryMonth+"-01" : "",
				cardHolderName = that.myDom.find("#name-on-card").val(),
				ccv = that.myDom.find("#ccv").val();
			var data = {
	    		reservation_id : that.reservationId,
				payment_type: "CC",
			    //payment_credit_type: $payment_credit_type,
			    card_number: cardNumber,
			    card_expiry: cardExpiry,
			    name_on_card: cardHolderName,
			    amount: amount
		    };
		    if(that.myDom.find("#add-in-guest-card").hasClass("checked")){
				data.add_to_guest_card = "true";
			}
		}
	    
			console.log(data)
	    // var url = 'ghfghfghfghfghfg'; 
	    // var options = {
			   // requestParameters: data,
			   // // successCallBack: that.fetchCompletedOfPayment,
			   // // failureCallBack: that.fetchFailedOfPayment,
			   // // successCallBackParameters: {
				   // // 'image': $image, 
				   // // 'number': $number, 
				   // // 'expiry': $expiry,
				   // // 'cardHolderName': $cardHolderName,
			   // // },
			   // loader: "blocker"
	    // };
		// webservice.postJSON(url, options);
			
	    
		
	};
	this.showExistingCards = function(){
		that.myDom.find("#select-make-payment-card").removeClass("hidden");
		that.myDom.find("#new-make-payment-card").addClass("hidden");
	};
	this.showAddCardScreen = function(){
		that.myDom.find("#select-make-payment-card").addClass("hidden");
		that.myDom.find("#new-make-payment-card").removeClass("hidden");
	};
	this.selectCreditCardItem = function(){
		that.myDom.find("#available-cards").attr("data-is-existing-card", "yes");
		that.myDom.find("#available-cards").attr("data-selected-payment", $(this).attr("payment-id"));
	};
	

	
};