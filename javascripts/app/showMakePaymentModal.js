var ShowMakePaymentModal = function(backDom) {

	BaseModal.call(this);
	var that = this;
	sntapp.cardSwipeCurrView = 'StayCardDepositModal';
	var swipedCardData = '';
	var isSwiped = false;
	this.reservationId = getReservationId();
	this.url = "staff/reservations/"+that.reservationId+"/deposit_and_balance";

	this.delegateEvents = function() {
		that.myDom.find("#make-payment").attr("disabled", true);
		that.myDom.find('#close').on('click', that.hidePaymentModal);
		that.myDom.find("#make-payment").on('click', that.makePayment);
		that.myDom.find("#existing-cards").on('click', that.showExistingCards);
		that.myDom.find("#add-new-card").on('click', that.showAddCardScreen);
		that.myDom.find(".active-item").on('click', that.selectCreditCardItem);
		that.myDom.find("#modal-close").on('click', that.hidePaymentModal);
	};
	this.modalDidShow = function() {
		$("#modal-overlay").unbind("click");
		$("#modal-overlay").addClass("locked");
	};
	
	this.hidePaymentModal = function(){
		sntapp.cardSwipeCurrView = 'StayCardView';
		that.hide();
	};
	this.renderSwipedData = function(){
		swipedCardData = this.swipedCardData;
		isSwiped = true;
		$('#card-number').val( 'xxxx-xxxx-xxxx-' + swipedCardData.token.slice(-4) );
		$('#expiry-month').val( swipedCardData.expiry.slice(-2) );
		$('#expiry-year').val( swipedCardData.expiry.substring(0, 2) );
		$('#name-on-card').val( swipedCardData.cardHolderName );
		$("#make-payment").attr("disabled", false);
		$("#make-payment").removeClass("grey");
		$("#make-payment").addClass("green");
	};
	this.makePayment = function(){
		
		// $('#new-payment').append('<input type="hidden" id="card-token" value="' + swipedCardData.token + '">');
		// $('#new-payment').append('<input type="hidden" id="et2" value="' + swipedCardData.getTokenFrom.et2 + '">');
		// $('#new-payment').append('<input type="hidden" id="ksn" value="' + swipedCardData.getTokenFrom.ksn + '">');
		// $('#new-payment').append('<input type="hidden" id="pan" value="' + swipedCardData.getTokenFrom.pan + '">');
		// $('#new-payment').append('<input type="hidden" id="etb" value="' + swipedCardData.getTokenFrom.etb + '">');
// 
// 		

alert(isSwiped)
		if(!isSwiped){
			console.log("---------&&&&--------------")
			 var merchantId = that.myDom.find("#merchantId").attr("data-merchantId");
			 HostedForm.setMerchant(merchantId);
			 
			 var sessionDetails ={};
	
	 		 sessionDetails.cardNumber = that.myDom.find("#card-number").val();
	         sessionDetails.cardSecurityCode = that.myDom.find("#ccv").val();
	         sessionDetails.cardExpiryMonth = that.myDom.find("#expiry-month").val();
	         sessionDetails.cardExpiryYear = that.myDom.find("#expiry-year").val();
	         try {
	                HostedForm.updateSession(sessionDetails, that.sessionSuccessCallBack); 
	             }
	         catch(err) {}
		} else {
			console.log("-----------------------")
			var cardExpiry = expiryMonth && expiryYear ? "20"+expiryYear+"-"+expiryMonth+"-01" : "",
		    	cardHolderName = that.myDom.find("#name-on-card").val();
			var data = {
			    card_expiry: cardExpiry,
			    name_on_card: cardHolderName,
			    mli_token: swipedCardData.token,
			    et2: swipedCardData.getTokenFrom.et2,
				ksn: swipedCardData.getTokenFrom.ksn,
				pan: swipedCardData.getTokenFrom.pan,
				etb: swipedCardData.getTokenFrom.etb,
				reservationId: that.reservationId
		    };
		    that.addNewCardToReservation(data);
		}
		 
		
		
		
		
		// var	amount = that.myDom.find("#amount").val();
// 			
		// var webservice = new WebServiceInterface();
		// if(that.myDom.find("#available-cards").attr("data-is-existing-card") == "yes"){
			// var selectedPaymentId = that.myDom.find("#available-cards").attr("data-selected-payment");
			// var data = {
				// reservation_id : that.reservationId,
				 // amount: amount,
				 // payment_id: selectedPaymentId
			// };
		// } else {
			// var cardNumber = that.myDom.find("#card-number").val(),
				// expiryMonth = that.myDom.find("#expiry-month").val(),
				// expiryYear = that.myDom.find("#expiry-year").val(),
				// cardExpiry = expiryMonth && expiryYear ? "20"+expiryYear+"-"+expiryMonth+"-01" : "",
				// cardHolderName = that.myDom.find("#name-on-card").val(),
				// ccv = that.myDom.find("#ccv").val();
			// var data = {
	    		// reservation_id : that.reservationId,
				// payment_type: "CC",
			    // //payment_credit_type: $payment_credit_type,
			    // card_number: cardNumber,
			    // card_expiry: cardExpiry,
			    // name_on_card: cardHolderName,
			    // amount: amount
		    // };
		    // if(that.myDom.find("#add-in-guest-card").hasClass("checked")){
				// data.add_to_guest_card = "true";
			// }
		// }
// 	    
			// console.log(data)
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
	this.sessionSuccessCallBack = function(response){
		
          if(response.status ==="ok"){     
              var MLISessionId = response.session;
              var dataToApiToAddNewCard = {
              	"sessionId" : MLISessionId,
              	"reservationId" :that.reservationId
              };
              that.addNewCardToReservation(dataToApiToAddNewCard);
             
          }
          
        
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
		that.myDom.find(".primary-selected").html("");
		that.myDom.find("#primary-"+$(this).attr("payment-id")).html("SELECTED");
		that.myDom.find("#make-payment").attr("disabled", false);
		that.myDom.find("#make-payment").removeClass("grey");
		that.myDom.find("#make-payment").addClass("green");
	};
	this.addNewCardToReservation = function(dataToApi){
		dataToApi.add_to_guest_card = "false";
		if(that.myDom.find("#add-in-guest-card").hasClass("checked")){
			dataToApi.add_to_guest_card = "true";
		}
		
		var url = 'staff/payment/save_new_payment'; 
	    var options = {
			   requestParameters: dataToApi,
			   successCallBack: that.successCallbackAddNewCardToReservation,
			   // failureCallBack: that.fetchFailedOfPayment,
			   loader: "blocker"
	    };
		webservice.postJSON(url, options);
	};
	this.successCallbackAddNewCardToReservation = function(data){
		var paymentId = data.data.id;
		var	amount = that.myDom.find("#amount").val();
		var dataToMakePaymentApi = {
			"payment_id": paymentId,
			"reservationId": that.reservationId,
			"amount": amount
		};
		that.doPaymentOnReservation(dataToMakePaymentApi);
	};
	this.doPaymentOnReservation = function(dataToMakePaymentApi){
		console.log("do payment on reservation");
		console.log(dataToMakePaymentApi);
		// var url = 'ghjghjghjghjent'; 
	    // var options = {
			   // requestParameters: dataToMakePaymentApi,
			   // successCallBack: that.successCallbackPaymentOnReservation,
			   // // failureCallBack: that.fetchFailedOfPayment,
			   // loader: "blocker"
	    // };
		// webservice.postJSON(url, options);
	};
	this.successCallbackPaymentOnReservation = function(data){
		
	};
	
};