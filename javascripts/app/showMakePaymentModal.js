var ShowMakePaymentModal = function(backDom) {

	BaseModal.call(this);
	var that = this;
	sntapp.cardSwipeCurrView = 'StayCardDepositModal';
	var swipedCardData = '';
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
		that.myDom.find("#card-number").on('blur', that.activateMakePaymentButton);

	};
	this.modalDidShow = function() {
		$("#modal-overlay").unbind("click");
		$("#modal-overlay").addClass("locked");
		setTimeout(function(){
			createVerticalScroll('#available-cards');
		}, 300);
		that.myDom.find("#card-number").attr("readonly", true);
		that.myDom.find("#expiry-month").attr("readonly", true);
		that.myDom.find("#expiry-year").attr("readonly", true);
	};
	this.activateMakePaymentButton = function(){
		if($("#card-number").val()!==''){
			$("#make-payment").attr("disabled", false);
			$("#make-payment").removeClass("grey");
			$("#make-payment").addClass("green");
		}


	};
	this.inactivateMakePaymentButton = function(){
			$("#make-payment").attr("disabled", true);
			$("#make-payment").removeClass("green");
			$("#make-payment").addClass("grey");
	};
	this.hidePaymentModal = function(){
		sntapp.cardSwipeCurrView = 'StayCardView';
		that.hide();
	};
	this.renderSwipedData = function(){
		swipedCardData = this.swipedCardData;
		$("#isSwiped").attr("data-is-swiped", true);
		$('#card-number').val( 'xxxx-xxxx-xxxx-' + swipedCardData.token.slice(-4) );
		$('#expiry-month').val( swipedCardData.expiry.slice(-2) );
		$('#expiry-year').val( swipedCardData.expiry.substring(0, 2) );
		$('#name-on-card').val( swipedCardData.cardHolderName );
		that.activateMakePaymentButton();

		$('#deposit-balance').append('<input type="hidden" id="card-type" value="' + swipedCardData.cardType + '">');
		$('#deposit-balance').append('<input type="hidden" id="card-token" value="' + swipedCardData.token + '">');
		$('#deposit-balance').append('<input type="hidden" id="et2" value="' + swipedCardData.getTokenFrom.et2 + '">');
		$('#deposit-balance').append('<input type="hidden" id="ksn" value="' + swipedCardData.getTokenFrom.ksn + '">');
		$('#deposit-balance').append('<input type="hidden" id="pan" value="' + swipedCardData.getTokenFrom.pan + '">');
		$('#deposit-balance').append('<input type="hidden" id="etb" value="' + swipedCardData.getTokenFrom.etb + '">');


	};
	this.makePayment = function(){


	    var isSwiped = that.myDom.find("#isSwiped").attr("data-is-swiped").toString();

		if(isSwiped === "true"){

			var user_id = $("#user_id").val();
			var expiryMonth = that.myDom.find("#expiry-month").val(),
				expiryYear = that.myDom.find("#expiry-year").val(),
				cardExpiry = expiryMonth && expiryYear ? "20"+expiryYear+"-"+expiryMonth+"-01" : "",
		    	cardHolderName = that.myDom.find("#name-on-card").val(),
		    	cardType = that.myDom.find("#card-type").val();


			var data = {
			    card_expiry: cardExpiry,
			    name_on_card: cardHolderName,
			    payment_type: "CC",
			    payment_credit_type: cardType,
			    credit_card: cardType,
				mli_token: that.myDom.find("#card-token").val(),
			    et2: that.myDom.find("#et2").val(),
				ksn: that.myDom.find("#ksn").val(),
				pan: that.myDom.find("#pan").val(),
				etb: that.myDom.find("#etb").val(),
				"user_id" :user_id,
				is_deposit: true
		    };

		    that.addNewCardToReservation(data);

		} else {

			if(that.myDom.find("#available-cards").attr("data-is-existing-card") === "yes"){
				var paymentId = that.myDom.find("#available-cards").attr("data-selected-payment");
				var	amount = that.myDom.find("#amount").val();
				var dataToMakePaymentApi = {
					"guest_payment_id": paymentId,
					"reservation_id": that.reservationId,
					"amount": amount
				};
				that.doPaymentOnReservation(dataToMakePaymentApi);
			} else {
				 var merchantId = that.myDom.find("#merchantId").attr("data-merchantId");
				 sntapp.activityIndicator.showActivityIndicator('BLOCKER');
				 HostedForm.setMerchant(merchantId);

				 var sessionDetails ={};

		 		 sessionDetails.cardNumber = that.myDom.find("#card-number").val();
		         sessionDetails.cardSecurityCode = that.myDom.find("#ccv").val();
		         sessionDetails.cardExpiryMonth = that.myDom.find("#expiry-month").val();
		         sessionDetails.cardExpiryYear = that.myDom.find("#expiry-year").val();
		         try {

		                HostedForm.updateSession(sessionDetails, that.sessionSuccessCallBack);
		             }
		         catch(err) {
		         }
			}

		}

	};
	this.sessionSuccessCallBack = function(response){

		  var user_id = $("#user_id").val();

          if(response.status ==="ok"){
              var MLISessionId = response.session;
              var expiryMonth = that.myDom.find("#expiry-month").val(),
				  expiryYear = that.myDom.find("#expiry-year").val(),
				  cardExpiry = expiryMonth && expiryYear ? "20"+expiryYear+"-"+expiryMonth+"-01" : "";

              var dataToApiToAddNewCard = {
	              	"session_id" : MLISessionId,
	              	"user_id" :user_id,
	              	"card_expiry": cardExpiry,
	              	"is_deposit": true
              };
              that.addNewCardToReservation(dataToApiToAddNewCard);

          } else {
          	sntapp.notification.showErrorMessage("There is a problem with your credit card", that.myDom);
          	that.myDom.find(".close-btn").on('click', that.hideErrorMessage);
          	sntapp.activityIndicator.hideActivityIndicator();
          }


	};
	this.hideErrorMessage = function(){
		that.myDom.find("#notification-message").removeClass('notice success_message error_message').html('');
	};
	this.showExistingCards = function(){
		that.myDom.find("#select-make-payment-card").removeClass("hidden");
		that.myDom.find("#new-make-payment-card").addClass("hidden");

		that.myDom.find("#existing-cards").addClass("active");
		that.myDom.find("#add-new-card").removeClass("active");

		refreshVerticalScroll('#available-cards');
		$("#isSwiped").attr("data-is-swiped", false);
		$('#card-number').val('');
		$('#expiry-month').val('');
		$('#expiry-year').val('');
		$('#name-on-card').val('');
		that.inactivateMakePaymentButton();

	};
	this.showAddCardScreen = function(){
		that.myDom.find("#select-make-payment-card").addClass("hidden");
		that.myDom.find("#new-make-payment-card").removeClass("hidden");

		that.myDom.find("#available-cards").attr("data-is-existing-card", "no");
		that.myDom.find("#available-cards").attr("data-selected-payment", "");
		that.myDom.find(".primary-selected").html("");
		that.myDom.find("#existing-cards").removeClass("active");
		that.myDom.find("#add-new-card").addClass("active");
		that.inactivateMakePaymentButton();
	};
	this.selectCreditCardItem = function(){

		that.myDom.find("#available-cards").attr("data-is-existing-card", "yes");
		that.myDom.find("#available-cards").attr("data-selected-payment", $(this).attr("payment-id"));
		that.myDom.find(".primary-selected").html("");
		that.myDom.find("#primary-"+$(this).attr("payment-id")).html("SELECTED");
		$("#make-payment").attr("disabled", false);
		$("#make-payment").removeClass("grey");
		$("#make-payment").addClass("green");
	};
	this.addNewCardToReservation = function(dataToApi){
		dataToApi.add_to_guest_card = "false";
		if(that.myDom.find("#add-in-guest-card").hasClass("checked")){
			dataToApi.add_to_guest_card = "true";
		}
		var webservice = new WebServiceInterface();
		var url = 'staff/payments/save_new_payment';
	    var options = {
			   requestParameters: dataToApi,
			   successCallBack: that.successCallbackAddNewCardToReservation,
			   failureCallBack: that.failureCallBackOfAddNewCard,
			   loader: "blocker"
	    };
		webservice.postJSON(url, options);
	};
	this.failureCallBackOfAddNewCard = function(errorMessage){
		sntapp.activityIndicator.hideActivityIndicator();
		sntapp.notification.showErrorMessage("Error: " + errorMessage, that.myDom);
		that.myDom.find(".close-btn").on('click', that.hideErrorMessage);
	};
	this.successCallbackAddNewCardToReservation = function(data){
		var paymentId = data.data.id;

		if(that.myDom.find("#add-in-guest-card").hasClass("checked")){
			var expiryMonth = that.myDom.find("#expiry-month").val(),
				expiryYear = that.myDom.find("#expiry-year").val(),
				cardExpiry = expiryMonth+"/"+expiryYear,
		    	cardHolderName = that.myDom.find("#name-on-card").val(),
		    	cardType = data.data.card_type;
			var endingWith = $('#card-number').val().slice(-4);

			var logo = cardType.toLowerCase()+".png";
			var appendHTML = "<label payment-id='"+paymentId+"' class='active-item item-payment primary'>"+
						+"<figure class='card-logo'>"+
						+"<img src='/assets/"+logo+"' alt=''>"+
						+"</figure>"+
						+"<span class='number'>Ending with "+
						+"<span class='value number'>"+endingWith+""+
						+"</span>"+
						+"</span>"+
						+"<span class='date'>Date"+
						+"<span class='value date'>"+cardExpiry+"</span></span>"+
						+"<span class='primary'>"+
						+"<span id='primary-"+paymentId+"' class='value primary primary-selected'></span>"+
						+"</span>"+
						+"</label>";

			$("#available-cards-wrapper").append(appendHTML);
		}


		sntapp.activityIndicator.hideActivityIndicator();

		var	amount = that.myDom.find("#amount").val();
		var dataToMakePaymentApi = {
			"guest_payment_id": paymentId,
			"reservation_id": that.reservationId,
			"amount": amount
		};
		that.doPaymentOnReservation(dataToMakePaymentApi);
	};
	this.doPaymentOnReservation = function(dataToMakePaymentApi){
		var webservice = new WebServiceInterface();
		var url = 'staff/reservation/post_payment';
	    var options = {
			   requestParameters: dataToMakePaymentApi,
			   successCallBack: that.successCallbackPaymentOnReservation,
			   // failureCallBack: that.fetchFailedOfPayment,
			   loader: "blocker"
	    };
		webservice.postJSON(url, options);
	};
	this.successCallbackPaymentOnReservation = function(data){
		var depositBalanceOnStayCard = parseInt($("#outstandingAmount").attr("data-outstanding-amount")) - parseInt(that.myDom.find("#amount").val());
		var isRatesSuppressed = backDom.find("#stay-card-total-stay-cost").attr("data-is-rates-suppressed");
		if(isRatesSuppressed !== "true"){
			backDom.find("#deposit_balance").html("");
			backDom.find("#deposit_balance").html("Deposit/Balance $"+depositBalanceOnStayCard.toFixed(0));
		}
		that.hidePaymentModal();
		sntapp.activityIndicator.hideActivityIndicator();
	};

};