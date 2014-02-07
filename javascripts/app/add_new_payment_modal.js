var AddNewPaymentModal = function(fromPagePayment, currentStayCardView){
  	BaseModal.call(this);
  	var that = this;
  	this.save_inprogess = false;
  	this.url = "staff/payments/addNewPayment";
  	this.$paymentTypes = [];
  	this.fromPagePayment = fromPagePayment;
    //Delegate events
  	this.delegateEvents = function(){
  		that.getPaymentsList();
  		that.myDom.find('#new-payment #payment-type').on('change', that.filterPayments);
		that.myDom.find('#new-payment #save_new_credit_card').on('click', that.saveNewPayment);
		//To show checkbox add on guest card
		if(fromPagePayment != "guest"){
			that.myDom.find("#add-in-guest-card").parent().parent().show();
		}
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
	};

	this.modalInit = function(){
		
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
		    						
			currentStayCardView.find("#select-card-from-list").html(replaceHtml);
			currentStayCardView.find("#add-new-payment").remove();
			//to remove add button and show delete icon on succesfull addition of new credit card
			$('#delete_card').remove();
			var appendHtml = '<a id="delete_card" data-payment-id="'+data.data.id+'" class="button with-icon red">'+
								'<span class="icons icon-trash invert"></span>Remove</a>';
			currentStayCardView.find(".payment_actions").append(appendHtml);
			//if add to guest card is on, then update guest card payment tab with new one
			if(requestParameters["add_to_guest_card"] == "true"){
				var	$add = 
			        '<a id="credit_row"  credit_id='+data.data.id +' class="active-item float item-payment new-item credit-card-option-row' + data.data.id + ' ">'+
			        '<figure class="card-logo"><img src="/assets/"'+$newImage+'" alt=""></figure><span class="number">'+
			        'Ending with<span class="value number">'+$endingWith+'</span></span>'+
					'<span class="date">Date<span class="value date">'+$newDate+'</span>'+
					'</span><span class="name">Name<span class="value name">'+$guestName+'</span>'+
					'</span></a>';
				
			    $("#payment_tab").prepend($add);
			}
				
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
			// update guest card payment tab with new one
			var	$add = 
		        '<a id="credit_row"  credit_id='+data.data.id +' class="active-item float item-payment new-item credit-card-option-row' + data.data.id + ' ">'+
		        '<figure class="card-logo">'+requestParameters['image']+'</figure><span class="number">'+
		        'Ending with<span class="value number">'+requestParameters['number']+'</span></span>'+
				'<span class="date">Date<span class="value date">'+requestParameters['expiry']+'</span>'+
				'</span><span class="name">Name<span class="value name">'+requestParameters['cardHolderName']+'</span>'+
				'</span></a>';
			
		    $("#payment_tab").prepend($add);
			//TO DO: APPEND NEW CREDIT CARD ID IN THE NEW GENERATED CREDIT CARD - CHECK WITH ORIGINAL API
			$("#payment_tab .new-item").attr("credit_id", data.id);
			$("#payment_tab .new-item").attr("id", "credit_row"+data.id);
			$("#payment_tab #credit_row"+data.id).removeClass("new-item");				
			$newImage = $("#new-payment #payment-credit-type").val().toLowerCase()+'.png';
			$newDate = $("#new-payment #expiry-year").val()+"/"+$("#new-payment #expiry-month").val();
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
		
		var curr_year  	= new Date().getFullYear()%100; // Last two digits of current year.
		var curr_month  = new Date().getMonth()+1;
		var errorMessage = "";
		// Validation on Expiry date
		// 1.card_expiry > today (MM/YY) 2. MM/YY valid i.e. MM 01-12, YY >13
		if($expiry_month > 12 || $expiry_month < 1){
			errorMessage = "Expiration date : Invalid month";
		}
		else if($expiry_year < curr_year){
			errorMessage = "Expiration date : Invalid year";
		}
		else if($expiry_year == curr_year && $expiry_month < curr_month){
			errorMessage = "Expiration date : Date expired";
		}
		if(errorMessage!=""){
			alert(errorMessage);
	  		return;
  		}
		
		var $image = "<img src='/assets/"+$("#new-payment #payment-credit-type").val().toLowerCase()+".png' alt='"+$("#new-payment #payment-credit-type").val().toLowerCase()+"'>";	
		
		$number = $card_number.substr($card_number.length - 4);
		$expiry = $expiry_month && $expiry_year ? $expiry_month + "/" + $expiry_year : "";		
		$cardHolderName = $("#new-payment #name-on-card").val();
		
		var user_id = $("#user_id").val();
		
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
		    };
			webservice.postJSON(url, options);
			
		} 
		else {
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
				    add_to_guest_card: add_to_guest_card
		    };		
		    var url = 'staff/reservation/save_payment'; 
		    var options = {
					   requestParameters: data,
					   successCallBack: that.fetchCompletedOfReservationPayment,
					   failureCallBack: that.fetchFailedOfReservationPayment,
					   successCallBackParameters: {
						   'number': $number,'add_to_guest_card':add_to_guest_card 
					   },
			};
		    webservice.postJSON(url, options);
		} 	
	    setTimeout(function() {
			refreshGuestCardScroll();
		}, 300);
  };
  // to get the payments list json to filter on change of payment type
   this.getPaymentsList = function(){
		var webservice = new WebServiceInterface();
	
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
