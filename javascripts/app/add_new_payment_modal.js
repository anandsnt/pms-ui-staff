var AddNewPaymentModal = function(fromPagePayment, backView, backViewParams){
  	BaseModal.call(this);
  	var that = this;
  	this.save_inprogess = false;
  	this.url = "staff/payments/addNewPayment";
  	this.$paymentTypes = [];
  	this.fromPagePayment = fromPagePayment;
  	
  	
    //Delegate events
    this.modalDidShow = function(){
    	console.log("upto here");
    	console.log(that.params);
    	that.myDom.find("#setOverlay").hide();
 		if(that.params && that.should_show_overlay){
 			that.should_show_overlay = false;
 			console.log("inside that parama here");
			that.myDom.find("#setOverlay").show();
			that.myDom.find('#noSwipe').on('click', that.hidePaymentModal);
		};
    	
    };
    
  	this.delegateEvents = function(){

		
  		that.getPaymentsList();
  		that.myDom.find('#new-payment #payment-type').on('change', that.filterPayments);
		that.myDom.find('#new-payment #save_new_credit_card').on('click', that.saveNewPayment);
		//To show checkbox add on guest card
		if(fromPagePayment != "guest"){
			that.myDom.find("#add-in-guest-card").parent().parent().show();
		}
	};
	that.hidePaymentModal = function(){
		that.hide();
	};
    
    this.dataUpdated=function(){
    	$("#setOverlay").hide();
    	if (that.swipedCardData) {
			that.populateSwipedCard();
	   };
    	
    	
    };
	this.populateSwipedCard = function() {
		var swipedCardData = this.swipedCardData;
		// inject the values to payment modal
        // inject payment type
		$('#payment-type').val( 'CC' );

		// before filling the card type
		that.filterPayments();
		$('#payment-credit-type').val(swipedCardData.cardType);

		// inject card number, exipry & name
		$('#card-number-set1').val( 'xxxx-xxxx-xxxx-' + swipedCardData.token.slice(-4) );
		$('#expiry-month').val( swipedCardData.expiry.slice(-2) );
		$('#expiry-year').val( swipedCardData.expiry.substring(0, 2) );
		$('#name-on-card').val( swipedCardData.cardHolderName );

		// inject the token as hidden field into form
		// TODO: Fix Security issue associated with input[type="hidden"]
		$('#new-payment').append('<input type="hidden" id="card-token" value="' + swipedCardData.token + '">');
		$('#new-payment').append('<input type="hidden" id="et2" value="' + swipedCardData.getTokenFrom.et2 + '">');
		$('#new-payment').append('<input type="hidden" id="ksn" value="' + swipedCardData.getTokenFrom.ksn + '">');
		$('#new-payment').append('<input type="hidden" id="pan" value="' + swipedCardData.getTokenFrom.pan + '">');
	};

	this.modalInit = function(){
		console.log(that.should_show_overlay);
		if((typeof that.swipedCardData != 'undefined' && Object.keys(that.swipedCardData).length != 0)
			||that.should_show_overlay===true){
			console.log("swipe");
    		that.params = {"card_action": "swipe"};
		}else{
    		that.params = {"card_action": "manual_entry"};
			console.log('not swipe');
		}
	
		
   	};
    //Success call back after succesful addition of payment in reservation
   	this.fetchCompletedOfReservationPayment = function(data, requestParameters){

   			that.save_inprogress = false;
			$newImage = that.myDom.find("#new-payment #payment-credit-type").val().toLowerCase()+".png";	
			$newDate = that.myDom.find("#new-payment #expiry-month").val()+"/"+$("#new-payment #expiry-year").val();
			$endingWith = requestParameters['number'];
			$guestName = that.myDom.find("#new-payment #name-on-card").val();
			//to populate newly added credit card in reservation card
			var replaceHtml = "<figure class='card-logo'>"+
								"<img src='/assets/"+$newImage+"' alt=''></figure>"+									
								"<span class='number'>Ending with<span id='token-last-value' class='value number'>"+$endingWith+							
								"</span></span><span class='date'> Date <span class='value date'>"+
								$newDate+
								"</span>";
			backView.find("#select-card-from-list").html(replaceHtml);
			backView.find("#add-new-payment").remove();
			//to remove add button and show delete icon on succesfull addition of new credit card
			backView.find('#update_card').remove();
			var appendHtml = '<a id="update_card" class="button with-icon green">'+
								'<span class="icons icon-wallet"></span>Update CC</a>';
			
			
			if(that.params["origin"] == views.BILLCARD){
				backView.find("#payment-type-text").remove();
				backView.find("#select-card-from-list").removeClass('hidden');
        		backView.find(".item-payment").append(appendHtml);
        		
        		// To update bill tab paymnt info
	        	var billTabHtml = '<img src="/assets/'+$newImage+'" alt="">'+
								'<span class="number">'+$endingWith+'</span>';
								
				$("#bills-tabs-nav #payment-info-"+that.params["bill_number"]).html("");		
				$("#bills-tabs-nav #payment-info-"+that.params["bill_number"]).html(billTabHtml);
				$("#bills-tabs-nav #payment-info-"+that.params["bill_number"]).addClass('card-logo');
	        }
	        else{			
				backView.find(".payment_actions").append(appendHtml);
			}
			

			//if add to guest card is on, then update guest card payment tab with new one
			if(requestParameters["add_to_guest_card"] == "true"){
				var currentCount = $("#payment_tab").attr("data-payment-count");
				var newCount = 	parseInt(currentCount) + parseInt(1);
				$("#payment_tab").attr("data-payment-count", newCount);	
				var primarySpan = "";
				if(currentCount == 0){
					primarySpan = '<span id="primary_credit" class="primary"><span class="value primary">Primary</span></span>';
				}
				$image = "<img src='/assets/"+$newImage+"' alt=''>";
				var	$add = 
			        '<a id="credit_row"  credit_id='+data.data.id +' class="active-item float item-payment new-item credit-card-option-row' + data.data.id + ' ">'+
			        '<figure class="card-logo">'+$image+'</figure><span class="number">'+
			        'Ending with<span class="value number">'+$endingWith+'</span></span>'+
					'<span class="date">Date<span class="value date">'+$newDate+'</span>'+
					'</span><span class="name">Name<span class="value name">'+$guestName+'</span>'+
					'</span></a>';
				
			    $("#payment_tab").prepend($add);
			}			
			this.paymentTypeSwipe = false;	
			that.hide();   			

   	};
   	//failure call back
   	this.fetchFailedOfReservationPayment = function(errorMessage){
   		that.save_inprogress = false;
   		sntapp.notification.showErrorList(errorMessage, that.myDom);
   		
   	};  
   	//Success call back after succesful addition of payment in guest card
   	this.fetchCompletedOfPayment = function(data, requestParameters){
			that.save_inprogress = false;
			var currentCount = backView.find("#payment_tab").attr("data-payment-count");
			var newCount = 	parseInt(currentCount) + parseInt(1);
			var primarySpan = "";
			if(currentCount == 0){
				primarySpan = '<span id="primary_credit" class="primary"><span class="value primary">Primary</span></span>';
			}
			// update guest card payment tab with new one
			var	$add = 
		        '<a id="credit_row"  credit_id='+data.data.id +' class="active-item float item-payment new-item credit-card-option-row' + data.data.id + ' ">'+
		        '<figure class="card-logo">'+requestParameters['image']+'</figure><span class="number">'+
		        'Ending with<span class="value number">'+requestParameters['number']+'</span></span>'+
				'<span class="date">Date<span class="value date">'+requestParameters['expiry']+'</span></span>'+
				'<span class="name">Name<span class="value name">'+requestParameters['cardHolderName']+'</span></span>'+
				primarySpan+'</a>';
			
		    backView.find("#payment_tab").prepend($add);
			//TO DO: APPEND NEW CREDIT CARD ID IN THE NEW GENERATED CREDIT CARD - CHECK WITH ORIGINAL API
			backView.find("#payment_tab .new-item").attr("credit_id", data.id);
			backView.find("#payment_tab .new-item").attr("id", "credit_row"+data.id);
			backView.find("#payment_tab #credit_row"+data.id).removeClass("new-item");	
			
			backView.find("#payment_tab").attr("data-payment-count", newCount);	
			//$newImage = $("#new-payment #payment-credit-type").val().toLowerCase()+'.png';
			//$newDate = $("#new-payment #expiry-year").val()+"/"+$("#new-payment #expiry-month").val();
			that.hide();
   	};
   	//failure call back
   	this.fetchFailedOfPayment = function(errorMessage){
   		that.save_inprogress = false;
   		sntapp.activityIndicator.hideActivityIndicator();
		sntapp.notification.showErrorMessage("Error: " + errorMessage, that.myDom);  
   	};    	
   	//save new payment
   	this.saveNewPayment = function(){
   		if (that.save_inprogress == true) return false;
		var $payment_type = $("#new-payment #payment-type").val();
		var $payment_credit_type = $("#new-payment #payment-credit-type").val();
		var $card_number_set = $("#new-payment #card-number-set1").val();
		var $expiry_month	= $("#new-payment #expiry-month").val();
		var $expiry_year	= $("#new-payment #expiry-year").val();
		var $name_on_card	= $("#new-payment #name-on-card").val();
		var $card_type 		= $("#payment-credit-type").val();
		var $card_number = $card_number_set;
		var $card_expiry = $expiry_month && $expiry_year ? "20"+$expiry_year+"-"+$expiry_month+"-01" : "";
		var $guest_id = $("#guest_id").val();
		var $card_token = $('#card-token').val();
		var $et2 = $('#et2').val();
		var $ksn = $('#ksn').val();
		var $pan = $('#pan').val();
		
		var curr_year  	= new Date().getFullYear()%100; // Last two digits of current year.
		var curr_month  = new Date().getMonth()+1;
		var errorMessage = "";
			
		var $image = "<img src='/assets/"+$("#new-payment #payment-credit-type").val().toLowerCase()+".png' alt='"+$("#new-payment #payment-credit-type").val().toLowerCase()+"'>";	
		
		$number = $card_number.substr($card_number.length - 4);
		$expiry = $expiry_month && $expiry_year ? $expiry_month + "/" + $expiry_year : "";		
		$cardHolderName = $("#new-payment #name-on-card").val();
		
		var user_id = $("#user_id").val();
		var reservationStatus = $('#registration-content').attr('data-reservation-status');
		
		refreshVerticalScroll('#cc-payment');
		//If it is a check-in reservation using card swipe from registration card, 
		//do not update the server with card details. 
		//Instead, save the details locally and pass the information while cheking in 
		//Commenting for now as per CICO-6389
		/*if(reservationStatus == "CHECKING_IN" && fromPagePayment == views.BILLCARD && sntapp.paymentTypeSwipe){
			console.log("---------------------------------");
			var params =  {'number': $number,'add_to_guest_card':add_to_guest_card}
		    var data = {
				payment_type: $payment_type,
			    credit_card: $card_type,
			    card_expiry: $card_expiry,
			    name_on_card: $name_on_card,
			    mli_token: $card_token,
			    et2: $et2,
				ksn: $ksn,
				pan: $pan
		    };
		    sntapp.regCardData = data;
			that.fetchCompletedOfReservationPayment('', params);
			return false;
		}*/
		
		if(fromPagePayment == "guest"){
			
		    that.save_inprogress = true; // Handle clicking on Add button twice.
		    var webservice = new WebServiceInterface();
		    var data = {
		    		user_id : user_id,
					payment_type: $payment_type,
				    payment_credit_type: $payment_credit_type,
				    card_number: $card_number,
				    credit_card: $card_type,
				    card_expiry: $card_expiry,
				    name_on_card: $name_on_card,
				    guest_id: $guest_id
		    };
		    var url = 'staff/payments/save_new_payment'; 
		    var options = {
				   requestParameters: data,
				   successCallBack: that.fetchCompletedOfPayment,
				   failureCallBack: that.fetchFailedOfPayment,
				   successCallBackParameters: {
					   'image': $image, 
					   'number': $number, 
					   'expiry': $expiry,
					   'cardHolderName': $cardHolderName,
				   },
				   loader: "blocker"
		    };
			webservice.postJSON(url, options);
			
		} 
		else {
			console.log("reservation payment payment");
			var reservation_id = getReservationId();
			that.save_inprogress = true;
			var webservice = new WebServiceInterface();
			var add_to_guest_card = "false";
			if(that.myDom.find("#add-in-guest-card").parent().hasClass("checked")){
				add_to_guest_card = "true";
			}
			
		    var data = {
				    reservation_id: reservation_id,
					payment_type: $payment_type,
				    payment_credit_type: $payment_credit_type,
				    card_number: $card_number,
				    credit_card: $card_type,
				    card_expiry: $card_expiry,
				    name_on_card: $name_on_card,
				    mli_token: $card_token,
				    et2: $et2,
					ksn: $ksn,
					pan: $pan,
				    add_to_guest_card: add_to_guest_card,
				    bill_number : that.params["bill_number"]
		    };		
		    var url = 'staff/reservation/save_payment'; 
		    var options = {
					   requestParameters: data,
					   successCallBack: that.fetchCompletedOfReservationPayment,
					   failureCallBack: that.fetchFailedOfReservationPayment,
					   successCallBackParameters: {
						   'number': $number,'add_to_guest_card':add_to_guest_card 
					   },
					   loader: "blocker"
			};
		    webservice.postJSON(url, options);
		} 

  };
  // to get the payments list json to filter on change of payment type
   this.getPaymentsList = function(){
		var webservice = new WebServiceInterface();
	console.log("how many")
	    var url = 'staff/payments/addNewPayment.json'; 
	    var options = {
				   successCallBack: that.fetchCompletedOfGetPayment,
		};
	    webservice.getJSON(url, options);	   
   };
   //success call back
   this.fetchCompletedOfGetPayment = function(data){
	   that.$paymentTypes = data.data;

	   if (that.swipedCardData) {
			that.populateSwipedCard();
	   };
   };
    // Re render type of cards with the selected payment type
	 this.filterPayments = function(e){
		var $selectedPaymentType = $("#new-payment #payment-type").val();
		var $paymentTypeValues = '';
		$("#new-payment #payment-credit-type").find('option').remove().end();
		$.each(that.$paymentTypes, function(key, value) {
		    if(value.name == $selectedPaymentType){
		    	$paymentTypeValues = '<option value="" data-image="">Select credit card</option>';
		    	$("#payment-credit-type").append($paymentTypeValues);
		    	$.each(value.values, function(paymentkey, paymentvalue) {
		    		$paymentTypeValues = '<option value="'+paymentvalue.cardcode+'" data-image="images/visa.png">'+paymentvalue.cardname+'</option>';
		    		$("#payment-credit-type").append($paymentTypeValues);
		    	});
		    }		    
		});
  };
};
