var AddNewPaymentModal = function(fromPagePayment){
  	BaseModal.call(this);
  	var that = this;
  	// this.myDom = "#modal";
  	this.url = "staff/payments/addNewPayment";
  	this.$paymentTypes = [];
  	
  	this.delegateEvents = function(){

  		console.log("sub modal delegate events");
  		that.getPaymentsList();

  		that.myDom.find('#new-payment #payment-type').on('change', that.filterPayments);
		that.myDom.find('#new-payment #save_new_credit_card').on('click', that.saveNewPayment);
	};
	this.modalInit = function(){
        console.log("modal init in sub modal");
        
   };
   this.saveNewPayment = function(){

   	
  	var $payment_type = $("#new-payment #payment-type").val();
		$payment_credit_type = $("#new-payment #payment-credit-type").val();
		$card_number_set = $("#new-payment #card-number-set1").val();
		$expiry_month	= $("#new-payment #expiry-month").val();
		$expiry_year	= $("#new-payment #expiry-year").val();
		$name_on_card	= $("#new-payment #name-on-card").val();
		$card_type 		= $("#payment-credit-type").val();
		$card_number = $card_number_set;
		$card_expiry = $expiry_month +"/"+$expiry_year;
		$card_expiry = "20"+$expiry_year+"-"+$expiry_month+"-01";
		$guest_id = $("#guest_id").val();
		
		
		/* credit card validation */
		if (!checkCreditCard ($card_number, $payment_credit_type)) {
	    	// alert (ccErrors[ccErrorNo]);
	    	$("#credit-card-number-error").html(ccErrors[ccErrorNo]).show();
	  		return false;
	  	}

		$("#new-payment .error").hide();
		if(($("#new-payment #payment-type").val()) == ""){
			$("#payment-type-error").html("Payment type is required").show();		
			return false;	
	    }else if($("#new-payment #payment-credit-type").val() == ""){ 
			$("#payment-credit-type-error").html("Credit Card type is required").show();	
			return false;			
		}else if($("#new-payment #card-number-set1").val() == ""){
			$("#credit-card-number-error").html("Credit Card number is required").show();	
			return false;			
		}else if($("#new-payment #expiry-month").val() == "" || $("#new-payment #expiry-year").val() == ""){
			$("#credit-card-expiry-error").html("Credit Card expiry is required").show();	
			return false;			
		}else if($("#new-payment #name-on-card").val() == ""){
			$("#name-on-card-error").html("Card holder name is required").show();	
			return false;			
		}	
		
		// var $image = (($("#new-payment #credit_card").val()) == "AX" ? "<img src='/assets/amex.png' alt='amex'>": (($("#new-payment #credit_card").val()) == "MA" ? "<img src='/assets/mastercard.png' alt='mastercard'>": "<img src='/assets/visa.png' alt='visa'>" ));
		var $image = "<img src='/assets/"+$("#new-payment #payment-credit-type").val().toLowerCase()+".png' alt='"+$("#new-payment #payment-credit-type").val().toLowerCase()+"'>";	
			$number = $card_number.substr($card_number.length - 5);			
			$expiry = $("#new-payment #expiry-year").val()+"/"+$("#new-payment #expiry-month").val();
			$cardHolderName = $("#new-payment #name-on-card").val();
		var user_id = $("#user_id").val();
		if(fromPagePayment == "guest"){
			var	$add = 
	        '<a id="credit_row"  credit_id="" class="active-item float item-payment new-item">'+
	        '<figure class="card-logo">'+$image+'</figure><span class="number">'+
	        'Ending with<span class="value number">'+$number+'</span></span>'+
			'<span class="date">Date<span class="value date">'+$expiry+'</span>'+
			'</span><span class="name">Name<span class="value name">'+$cardHolderName+'</span>'+
			'</span></a>';
		
			//console.log($add);
		    $("#payment_tab").prepend($add);
		    $.ajax({
				type: "POST",
				url: 'staff/payments/save_new_payment',
				data: { 
					    user_id : user_id,
						payment_type: $payment_type,
					    payment_credit_type: $payment_credit_type,
					    card_number: $card_number,
					    credit_card: $card_type,
					    card_expiry: $card_expiry,
					    name_on_card: $name_on_card,
					    guest_id: $guest_id
					},
				dataType: 'json',
				success: function(data) {
					console.log(data.id);
					if(data.errors!="" && data.errors!=null){
						$("#credit-card-number-error").html(data.errors).show();
						// $("#new-payment #credit_row .new-item").remove();
						$('#payment_tab a:first').remove();
						return false;
					}
					console.log(data.id);
					//TO DO: APPEND NEW CREDIT CARD ID IN THE NEW GENERATED CREDIT CARD - CHECK WITH ORIGINAL API
					$("#payment_tab .new-item").attr("credit_id", data.id);
					$("#payment_tab .new-item").attr("id", "credit_row"+data.id);
					$("#payment_tab #credit_row"+data.id).removeClass("new-item");				
					$newImage = $("#new-payment #payment-credit-type").val().toLowerCase()+'.png';
					$newDate = $("#new-payment #expiry-year").val()+"/"+$("#new-payment #expiry-month").val();
					that.hide();
				},
				error: function(){
					//alert(data.errors);
				}
			});
			
		} else {
			var reservation_id = getReservationId();
			$.ajax({
				type: "POST",
				url: 'staff/reservation/save_payment',
				data: { 
					    reservation_id: reservation_id,
						payment_type: $payment_type,
					    payment_credit_type: $payment_credit_type,
					    card_number: $card_number,
					    credit_card: $card_type,
					    card_expiry: $card_expiry,
					    name_on_card: $name_on_card
					},
				dataType: 'json',
				success: function(data) {
					console.log(data.id);
					if(data.errors!="" && data.errors!=null){
						$("#credit-card-number-error").html(data.errors).show();
						// $("#new-payment #credit_row .new-item").remove();
						$('#payment_tab a:first').remove();
						return false;
					}
					console.log(data.data.id);
					//TO DO: APPEND NEW CREDIT CARD ID IN THE NEW GENERATED CREDIT CARD - CHECK WITH ORIGINAL API
					
					$newImage = $("#new-payment #payment-credit-type").val().toLowerCase()+".png";	
					$newDate = $("#new-payment #expiry-year").val()+"/"+$("#new-payment #expiry-month").val();
					$newPaymentOption =  "<option value='"+data.data.id+"'data-number='"+$number+"'"+
					  "data-name='"+$("#new-payment #name-on-card").val()+"' data-image='"+$newImage+"' data-date='"+$newDate+ "'"+
					  "data-card='"+$("#new-payment #payment-credit-type").val()+ "'>"+
					 $("#new-payment #payment-credit-type").val()+" "+$number+" "+$("#new-payment #expiry-year").val()+"/"+$("#new-payment #expiry-month").val()+ "</option> ";    
									
					$("#staycard_creditcard").append($newPaymentOption);
					that.hide();
				},
				error: function(){
					//alert(data.errors);
				}
			});
		} 	
	    setTimeout(function() {
			refreshGuestCardScroll();
		}, 300);
  };
   this.getPaymentsList = function(){
   $.ajax({
			type: "GET",
			url: 'staff/payments/addNewPayment.json',			
			dataType: 'json',
			success: function(data) {		
				that.$paymentTypes = data.data;
			},
			error: function(){
				console.log("There is an error!!");
			}
		});
   };
     this.filterPayments = function(e){

  		var $selectedPaymentType = $("#new-payment #payment-type").val();
		$paymentTypeValues = '';
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
