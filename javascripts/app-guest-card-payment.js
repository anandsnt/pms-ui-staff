$(function($) {
    
	// This should be moved - it is for staycard
	$(document).on('change', "#staycard_creditcard", function() {		
		var $credit_card_id = $("#staycard_creditcard").val();
		$user_id = $("#user_id").val();
		if(!$guestCardClickTime){
			$("#primary_credit.primary").remove();
			$("#credit_row" + $credit_card_id).append("<span id='primary_credit' class='primary'><span class='value primary'>Primary</span></span>");
		}
		setCreditAsPrimary($credit_card_id, $user_id);
	});
	

});

