$(function($) {

	
	//Show modal to set credit card as primary or to delete the credit card
	$(document).on('click', '#payment_tab .active-item,#payment_tab #add_new_payment', function(e) {

		
		e.preventDefault();
		var $href = $(this).attr('href');

		$modal = '<div id="modal" role="dialog" />', $overlay = '<div id="modal-overlay" />';

		// Get modal data
		$.ajax({
			url : $href,
			// async:false,
			data : {
				id : $(this).attr('credit_id')
			},
			success : function(data) {
				setModal();
				$('#modal').html(data);
				$("#new-payment .error").hide();
			},
			error : function() {
				alert("Sorry, not there yet!");
			}
		});
	});
	// function to set the selected credit card as primary
	$(document).on('click', "#credit-card-set-as-primary", function() {
		var $credit_card_id = $("#credit_card_id").val();
		$("#primary_credit.primary").remove();
		$("#credit_row" + $credit_card_id).append("<span id='primary_credit' class='primary'><span class='value primary'>Primary</span></span>");
		removeModal();
		$.ajax({
			type: "POST",
			url: '/dashboard/setCreditCardAsPrimary',
			data: {id: $credit_card_id},
			dataType: 'json',
			success: function(data) {
				console.log("Succesfully set credit card as primary");
			},
			error: function(){
				console.log("There is an error!!");
			}
		});
	});
	// function to set the selected credit card as primary
	$(document).on('click', "#credit-card-delete", function() {
		var $credit_card_id = $("#credit_card_id").val();
		$("#credit_row" + $credit_card_id).remove();		
		removeModal();
		$.ajax({
			type: "POST",
			url: '/dashboard/deleteCreditCard',
			data: {id: $credit_card_id},
			dataType: 'json',
			success: function(data) {
				console.log("Succesfully deleted credit card");
			},
			error: function(){
				console.log("There is an error!!");
			}
		});
	});
	// function to save new payment type
	$(document).on('click', "#save_new_credit_card", function() {
		
		var $payment_type = $("#new-payment #payment-type").val();
			$payment_credit_type = $("#new-payment #payment-credit-type").val();
			$card_number_set1 = $("#new-payment #card-number-set1").val();
			$card_number_set2 = $("#new-payment #card-number-set2").val();
			$card_number_set3 = $("#new-payment #card-number-set3").val();
			$expiry_month	= $("#new-payment #expiry-month").val();
			$expiry_year	= $("#new-payment #expiry-year").val();
			$name_on_card	= $("#new-payment #name-on-card").val();

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
		
		var $image = (($("#new-payment #credit_card").val()) == "AX" ? "<img src='/assets/amex.png' alt='amex'>": (($("#new-payment #credit_card").val()) == "MA" ? "<img src='/assets/mastercard.png' alt='mastercard'>": "<img src='/assets/visa.png' alt='visa'>" ));
			$number = $("#new-payment #card-number-set3").val();
			$expiry = $("#new-payment #expiry-month").val()+"/"+$("#new-payment #expiry-year").val();
			$cardHolderName = $("#new-payment #name-on-card").val();
		
        var	$add = 
	        '<a id="credit_row" href="dashboard/showCreditModal" credit_id="" class="active-item item-payment primary open-modal float credit-card-info">'+
	        '<figure class="card-logo"></figure>'+$image+'<span class="number">'+
	        'Ending with<span class="value number">'+$number+'</span></span>'+
			'<span class="date">Date<span class="value date">'+$expiry+'</span>'+
			'</span><span class="name">Name<span class="value name">'+$cardHolderName+'</span>'+
			'</span></a>';
		
			console.log($add);
	    $("#payment_tab #payment_list").append($add);
	    removeModal();
	    setTimeout(function() {
			refreshGuestCardScroll();
		}, 300);
		/* Umcomment after API is ready */
		$.ajax({
			type: "POST",
			url: '/dashboard/addNewPayment',
			data: { 
					payment_type: $payment_type,
				    payment_credit_type: $payment_credit_type,
				    card_number_set1: $card_number_set1,
				    card_number_set2: $card_number_set2,
				    card_number_set3: $card_number_set3,
				    expiry_month: $expiry_month,
				    expiry_year: $expiry_year,
				    name_on_card: $name_on_card
				},
			dataType: 'json',
			success: function(data) {
				//TO DO: APPEND NEW CREDIT CARD ID IN THE NEW GENERATED CREDIT CARD - CHECK WITH ORIGINAL API
				$("#credit_row").attr("credit_id", data.id);
				$("#credit_row").attr("id", "credit_row"+data.id);
				
				console.log("Succesfully added credit card");
			},
			error: function(){
				console.log("There is an error!!");
			}
		});
		removeModal();
	});

});
