
var avathar_img_urls = ['/assets/avatar-male.png', '/assets/avatar-female.png', '/assets/avatar-trans.png'];

function getDateObj(dateString){
//TODO: Handle different conditions

return convertDateToUTC(new Date(dateString));
}

function convertDateToUTC(date) { 
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
}


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

function getAvatharUrl(title){
	//function to get avathar image url by giving title
	var avathar_imgs = {
			'mr.' : '/assets/avatar-male.png',
			'mrs.': '/assets/avatar-female.png',
			'miss.': '/assets/avatar-female.png',
			'': '/assets/avatar-trans.png',
	};
	try{
		if(($.trim(title).toLowerCase() == "mr.") || ($.trim(title).toLowerCase() == "mrs.") || ($.trim(title).toLowerCase() == "miss."))
			return avathar_imgs[$.trim(title).toLowerCase()];
	    else
	    	return avathar_imgs[''];
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

function getDateString(dateObj, showDay){
	var dateString = "";
	var weekday = new Array(7);
	weekday[0]="Monday";
	weekday[1]="Tuesday";
	weekday[2]="Wednesday";
	weekday[3]="Thursday";
	weekday[4]="Friday";
	weekday[5]="Saturday";
	weekday[6]="Sunday";

	var month = dateObj.getMonth() + 1 + "";// > 9 ? ("0" + dateObj.getMonth()): dateObj.getMonth();
	if (month.length == 1){
        month = "0" + month;
    }

	var date = dateObj.getDate() + "";
	if (date.length == 1){
        date = "0" + date;
    }

    if(showDay == true){
    	var dateString = weekday[dateObj.getDay()] + " " + dateObj.getFullYear() + "-" + month  + "-" + date ;
    }else{
		var dateString = dateObj.getFullYear() + "-" + month  + "-" + date ;
    }
	return dateString;

};