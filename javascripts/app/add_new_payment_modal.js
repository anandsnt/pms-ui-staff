var AddNewPaymentModal = function(fromPagePayment, currentStayCardView){
  	BaseModal.call(this);
  	var that = this;
  	this.save_inprogess = false;
  	this.url = "staff/payments/addNewPayment";
  	this.$paymentTypes = [];
  	
  	this.delegateEvents = function(){
  		that.getPaymentsList();
  		that.myDom.find('#new-payment #payment-type').on('change', that.filterPayments);
		that.myDom.find('#new-payment #save_new_credit_card').on('click', that.saveNewPayment);

		// Keep looking for "injectSwipeCardData"
		// Once avaliable, execute it
		window.injectCardTimer = null;
		injectCard();
	};

	// Keep looking for "injectSwipeCardData"
	// Once avaliable, execute it
	var injectCard = function() {
		if (window.injectSwipeCardData) {
			clearInterval(window.injectCardTimer);
			window.injectSwipeCardData();
		} else {
			window.injectCardTimer = setInterval(injectCard, 200);
		}
	};

	this.modalInit = function(){
   	};
   	this.fetchCompletedOfReservationPayment = function(data, requestParameters){
			$newImage = $("#new-payment #payment-credit-type").val().toLowerCase()+".png";	
			$newDate = $("#new-payment #expiry-year").val()+"/"+$("#new-payment #expiry-month").val();
			$newPaymentOption =  "<option value='"+data.data.id+"'data-number='"+requestParameters['number']+"'"+
			  "data-name='"+$("#new-payment #name-on-card").val()+"' data-image='"+$newImage+"' data-date='"+$newDate+ "'"+
			  "data-card='"+$("#new-payment #payment-credit-type").val()+ "' class='credit-card-option-row" + data.data.id + "'>"+
			 $("#new-payment #payment-credit-type").val()+" "+requestParameters['number']+" "+$("#new-payment #expiry-month").val()+"/"+$("#new-payment #expiry-year").val()+ "</option> ";    
							
			currentStayCardView.find(".staycard-creditcard").append($newPaymentOption);
			$('.staycard-creditcard').val(data.data.id);
			var replaceHtml = "<figure class='card-logo'>"+
								"<img src='/assets/"+$newImage+"' alt=''></figure>"+									
								"<span class='number'>Ending with<span class='value number'>"+requestParameters['number']+							
								"</span></span><span class='date'> Date <span class='value date'>"+
								$("#new-payment #expiry-month").val()+"/"+$("#new-payment #expiry-year").val()+
								"</span>";
		    						
			currentStayCardView.find("#selected-reservation-payment-div").html(replaceHtml);
			that.hide();   			

   	};
   	this.fetchFailedOfReservationPayment = function(errorMessage){
   		sntapp.notification.showErrorList(errorMessage, that.myDom);
   		that.save_inprogress = false;
   	};  
   	this.fetchCompletedOfPayment = function(data, requestParameters){
			that.save_inprogress = false;
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
			if(typeof data.data.id !== 'undefined' && data.data.id !== ""){
				that.fetchCompletedOfReservationPayment(data, requestParameters);
			}
			else{
				sntapp.notification.showErrorMessage('ID is missing after payment method operation');
			}
   	};
   	this.fetchFailedOfPayment = function(errorMessage){
   		sntapp.notification.showErrorList(errorMessage, that.myDom);
   		that.save_inprogress = false;
   	};    	
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
		
		// MOVED TO SERVER SIDE VALIDATION ONLY
		// /* credit card validation */
		// if (!checkCreditCard ($card_number, $payment_credit_type)) {
		// 	    	$("#credit-card-number-error").html(ccErrors[ccErrorNo]).show();
		// 	  		return false;
		// 	  	}
		// $("#new-payment .error").hide();
		// if(($("#new-payment #payment-type").val()) == ""){
		// 	$("#payment-type-error").html("Payment type is required").show();		
		// 	return false;	
		// 	    }else if($("#new-payment #payment-credit-type").val() == ""){ 
		// 	$("#payment-credit-type-error").html("Credit Card type is required").show();	
		// 	return false;			
		// }else if($("#new-payment #card-number-set1").val() == ""){
		// 	$("#credit-card-number-error").html("Credit Card number is required").show();	
		// 	return false;			
		// }else if($.trim($("#new-payment #expiry-month").val()) == "" || $.trim($("#new-payment #expiry-year").val()) == ""){
		// 	$("#credit-card-expiry-error").html("Credit Card expiry is required").show();	
		// 	return false;			
		// }else if($.trim($("#new-payment #name-on-card").val()) == ""){
		// 	$("#name-on-card-error").html("Card holder name is required").show();	
		// 	return false;			
		// }
		
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
				    guest_id: $guest_id,
				    card_token: $card_token
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
		    var data = {
				    reservation_id: reservation_id,
					payment_type: $payment_type,
				    payment_credit_type: $payment_credit_type,
				    card_number: $card_number,
				    credit_card: $card_type,
				    card_expiry: $card_expiry,
				    name_on_card: $name_on_card,
				    card_token: $card_token
		    };		
		    var url = 'staff/reservation/save_payment'; 
		    var options = {
					   requestParameters: data,
					   successCallBack: that.fetchCompletedOfReservationPayment,
					   failureCallBack: that.fetchFailedOfReservationPayment,
					   successCallBackParameters: {
						   'number': $number, 
					   },
			};
		    webservice.postJSON(url, options);
		} 	
	    setTimeout(function() {
			refreshGuestCardScroll();
		}, 300);
  };
   this.getPaymentsList = function(){
		var webservice = new WebServiceInterface();
	
	    var url = 'staff/payments/addNewPayment.json'; 
	    var options = {
				   successCallBack: that.fetchCompletedOfGetPayment,
		};
	    webservice.getJSON(url, options);	   
   };
   this.fetchCompletedOfGetPayment = function(data){
	   that.$paymentTypes = data.data;
   };
   
     this.filterPayments = function(e){

     	alert('change trigger');

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
