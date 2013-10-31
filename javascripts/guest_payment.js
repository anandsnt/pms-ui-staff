var GuestPaymentView = function(domRef){
  BaseView.call(this);
  var that = this;
  this.myDomElement = domRef;  
  
  this.$paymentTypes = [];
  	
  this.pageinit = function(){
  	console.log("Page Init inside guest payment");
    that.myDomElement.find($('#payment_tab .active-item,#payment_tab #add_new_payment')).on('click', that.renderNewPaymentView);  
  
  };
  
  
  this.deleteCreditCard = function(){
  		var $credit_card_id = $("#credit_card_id").val();
		$("#credit_row" + $credit_card_id).remove();		
		removeModal();
		$.ajax({
			type: "POST",
			url: 'staff/dashboard/deleteCreditCard',
			data: {id: $credit_card_id},
			dataType: 'json',
			success: function(data) {
				console.log("Succesfully deleted credit card");
			},
			error: function(){
				console.log("There is an error!!");
			}
		});
  };
  
  this.setCreditAsPrimary = function(){
  	
  		var $credit_card_id = $("#credit_card_id").val();
		$user_id = $("#user_id").val();
		$("#primary_credit.primary").remove();
		$("#credit_row" + $credit_card_id).append("<span id='primary_credit' class='primary'><span class='value primary'>Primary</span></span>");
		removeModal();
		
		
		$.ajax({
			type: "POST",
			url: 'staff/dashboard/setCreditAsPrimary',
			data: {id: $credit_card_id, user_id: $user_id},
			dataType: 'json',
			success: function(data) {
				console.log("Succesfully set credit card as primary");
				$("#primary_credit.primary").remove();
				$("#payment_tab #credit_row" + $credit_card_id).append("<span id='primary_credit' class='primary'><span class='value primary'>Primary</span></span>");
				// $("#payment_tab credit_row"+$credit_card_id)				
			},
			error: function(){
				console.log("There is an error!!");
			}
		});
  };
  
  this.saveNewPayment = function(){
  	var $payment_type = $("#new-payment #payment-type").val();
		$payment_credit_type = $("#new-payment #payment-credit-type").val();
		$card_number_set1 = $("#new-payment #card-number-set1").val();
		$card_number_set2 = $("#new-payment #card-number-set2").val();
		$card_number_set3 = $("#new-payment #card-number-set3").val();
		$expiry_month	= $("#new-payment #expiry-month").val();
		$expiry_year	= $("#new-payment #expiry-year").val();
		$name_on_card	= $("#new-payment #name-on-card").val();
		$card_type 		= $("#payment-credit-type").val();
		$card_number = $card_number_set1 + $card_number_set2 + $card_number_set3;
		$card_expiry = $expiry_month +"/"+$expiry_year;
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
		}else if($("#new-payment #card-number-set1").val() == "" || $("#new-payment #card-number-set2").val() == "" || $("#new-payment #card-number-set3").val()==""){
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
		var $image = "<img src='/assets/"+$("#new-payment #payment-credit-type").val().toLowerCase()+".png' alt='visa'>";	
			$number = $("#new-payment #card-number-set3").val();
			$expiry = $("#new-payment #expiry-year").val()+"/"+$("#new-payment #expiry-month").val();
			$cardHolderName = $("#new-payment #name-on-card").val();
		
        var	$add = 
	        '<a id="credit_row" href="dashboard/showCreditModal" credit_id="" class="active-item float item-payment new-item">'+
	        '<figure class="card-logo">'+$image+'</figure><span class="number">'+
	        'Ending with<span class="value number">'+$number+'</span></span>'+
			'<span class="date">Date<span class="value date">'+$expiry+'</span>'+
			'</span><span class="name">Name<span class="value name">'+$cardHolderName+'</span>'+
			'</span></a>';
		
		//console.log($add);
	    $("#payment_tab").prepend($add);
	    
		/* Umcomment after API is ready */
		
		var user_id = $("#user_id").val();
		console.log("user_id"+user_id);
		$.ajax({
			type: "POST",
			url: 'staff/dashboard/save_new_payment',
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
				/*
				$newPaymentOption =  "<option value='"+data.id+"'data-number='"+$("#new-payment #card-number-set3").val()+"'"+
				  "data-name='"+$("#new-payment #name-on-card").val()+"' data-image='"+$newImage+"' data-date='"+$newDate+ "'"+
				  "data-card='"+$("#new-payment #payment-credit-type").val()+ "'>"+
				 $("#new-payment #payment-credit-type").val()+" "+$("#new-payment #card-number-set3").val()+" "+$("#new-payment #expiry-year").val()+"/"+$("#new-payment #expiry-month").val()+ "</option> ";    
				*/				
				//$("#staycard_creditcard").append($newPaymentOption);
				removeModal();
			},
			error: function(){
				alert(data.errors);
			}
		});
		
	    setTimeout(function() {
			refreshGuestCardScroll();
		}, 300);
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
  this.renderNewPaymentView = function(e){
  	e.preventDefault();
  	
  	var $href = $(this).attr('href');

		$modal = '<div id="modal" role="dialog" />', $overlay = '<div id="modal-overlay" />';
		
		// Get modal data
		$.ajax({
			url : $href,
			async:false,
			data : {
				id : $(this).attr('credit_id')
			},
			success : function(data) {
				setModal();
				$('#modal').html(data);
				$("#new-payment .error").hide();
				//To be changed
				if($href == "staff/dashboard/showCreditModal"){
					$('#credit-card-set-as-primary').on('click', that.setCreditAsPrimary);   
    				$('#credit-card-delete').on('click', that.deleteCreditCard);  
				}
			},
			error : function() {
				alert("Sorry, not there yet!");
			}
		});
		
		
		$.ajax({
			type: "GET",
			url: 'staff/dashboard/addNewPayment.json',			
			dataType: 'json',
			success: function(data) {		
				that.$paymentTypes = data.data;
			},
			error: function(){
				console.log("There is an error!!");
			}
		});
		$('#new-payment #payment-type').on('change', that.filterPayments);
		$('#new-payment #save_new_credit_card').on('click', that.saveNewPayment);
  };
};