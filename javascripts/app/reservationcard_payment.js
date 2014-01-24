var ReservationPaymentView = function(domRef){
  BaseView.call(this);
  var that = this;
  this.myDom = domRef;  
  
  this.$paymentTypes = [];
  
  this.pageinit = function(){
    // start card swipe listener
    this.initCardSwipListner();
  };

  // Listen for card swipes
  this.initCardSwipListner = function() {
    var that = this;

    // oh this is not an device, lets leave
    if( ! sntapp.cordovaLoaded ) {
      return;
    }

    // yep we are in device, lets setup listener
    var options = {
      successCallBack: function(data){
        // to keep card data; both read from 
	    // swiped card and fetched from APIs
        that.cardData = {};

        // add new card data
        that.cardData.cardType = data.RVCardReadCardType;
        that.cardData.expiryDate = data.RVCardReadExpDate;
        that.cardDatac.cardName = data.RVCardReadCardName || '-';
        that.cardData.getTokenFrom = {
          'et2': data.RVCardReadTrack2,
          'ksn': data.RVCardReadTrack2KSN
        };

        // call the cardSwipeHandler
        that.cardSwipHandler();
      },
      failureCallBack: function(errorObject){
        sntapp.notification.showErrorMessage('Error occured (103): Bad Read, Please try again.');
      }
    };
    sntapp.cardReader.startReader(options);
  };

  // post the et2 & ksn to get the card token
  this.cardSwipHandler = function(cardData) {
    var that = this;

    // wow go the token! Lets call the payment modal
    var _successHandler = function(token) {
      // push token into cardData
      that.cardData.token = fetchedToken.data;

      // pass the cardData to addNewPaymentModal intance or handler
      if (this.addNewPaymentModalInst) {
      	that.addNewPaymentModalInst.autoPopulate(that.cardData);
      } else {
      	that.addNewPaymentHandler(that.cardData);
      }
    };

    var _failureHandler = function(error) {
      sntapp.notification.showErrorMessage('failed on postCardSwipData ' + error);
    };

    var webservice = new WebServiceInterface();
    var url = 'http://pms-dev.stayntouch.com/staff/payments/tokenize';
    var options = {
      loader: 'blocker',
      requestParameters: cardData.getTokenFrom,
      successCallBack: _successHandler,
      failureCallBack: _failureHandler
    }
    webservice.postJSON(url, options);
  };

  this.delegateEvents = function(){
  	that.myDom.find('#add-new-payment').on('click', that.addNewPaymentHandler);
    that.myDom.find('#staycard_creditcard').on('change', that.setPaymentToReservation);
  };

  this.addNewPaymentHandler = function(event, options){
  	this.addNewPaymentModalInst = new AddNewPaymentModal("reservation", that.myDom);
    this.addNewPaymentModalInst.initialize({ 'cardData': this.cardData });
  };
  
  this.fetchCompletedOfSetPaymentToReservation = function(data){
	// success function set payment to reservation's ajax call  
  };
  
  this.setPaymentToReservation = function(){
  	var reservation_id = getReservationId();
  	var credit_card_id = that.myDom.find("#staycard_creditcard").val();
  	if(credit_card_id == ""){
  		var html = "<figure class='card-logo'>Select Credit Card</figure>"+		
				"<span class='number'>"+					
				"<span class='value number'> </span>"+
				"</span>"+
				"<span class='date'>"+					
				"<span class='value date'></span>"+
				"</span>"+
				"";
  		
  	} else {
  		var html = "<figure class='card-logo'>"+
			"<img src='' alt=''>"+
			"</figure>"+
			"<span class='number'>"+
			"Ending with"+
			"<span class='value number'></span>"+
			"</span>"+
			"<span class='date'>"+
			"Date"+
			"<span class='value date'></span>"+
			"</span>";
  		
  	}
  	that.myDom.find("#selected-reservation-payment-div").html(html);
  	var data = {"reservation_id": reservation_id, "user_payment_type_id": credit_card_id };
  	var url = "/staff/reservation/link_payment";
    var webservice = new WebServiceInterface();
    var options = {
		   requestParameters: data,
		   successCallBack: that.fetchCompletedOfSetPaymentToReservation,
		   async: false,
    };
    webservice.postJSON(url, options);

  
  };
};


	