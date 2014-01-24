
function getCurrentReservationDiv(){
	var activeTimeline = $('#reservation-card').attr('data-current-timeliine');
	var currentConfirmation = $("#"+activeTimeline+" #reservation-listing ul li.ui-state-active").attr("data-confirmation-num");
	//console.log(currentConfirmation);
	var currentReservationDiv = "reservation-"+currentConfirmation;
	return currentReservationDiv;
}


function getReservationId(){

	var currentFetchDom = getCurrentReservationDiv();
	var reservation_id = $("#"+currentFetchDom).attr("data-reservation-id");
	return reservation_id;
}

var avatharImgs = {
	'mr' : 'avatar-male.png',
	'mrs': 'avatar-female.png',
	'ms': 'avatar-female.png',
	'miss': 'avatar-female.png',
	'': 'avatar-trans.png',
};

function getAvatharUrl(title){
	//function to get avathar image url by giving title
	title = $.trim(title).toLowerCase().split('.')[0];
	console.log(title);
	try{
		if((title == "mr") || (title == "mrs") || (title == "miss")|| (title == "ms"))
			return (/assets/ + avatharImgs[title]);
	    else
	    	return (/assets/ + avatharImgs['']);
	}
	catch (e) {
		console.log(e.message);
		// TODO: handle exception
	}
}
//function that converts a null value to a desired string. 
//if no replace value is passed, it returns an empty string
escapeNull = function(value, replaceWith){
	var newValue = "";
	if((typeof replaceWith != "undefined") && (replaceWith != null)){
		newValue = replaceWith;
	}
	return ((value == null || typeof value == 'undefined' ) ? newValue : value);
};

function validateEmail(emailField){
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (reg.test(emailField) == false){
        alert('Invalid Email Address');
        return false;
    }
    return true;
}

function getCurrencySymbol(currenyCode){
      var symbol = "";
      if(currenyCode == "USD"){
        symbol = "$";
      }
      return symbol;
};