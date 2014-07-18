
var avathar_img_urls = ['/assets/avatar-male.png', '/assets/avatar-female.png', '/assets/avatar-trans.png'];

function getDateObj(dateString){
//TODO: Handle different conditions

return convertDateToUTC(new Date(dateString));
}

/**
*   In case of a click or an event occured on child elements
*	of actual targeted element, we need to change it as the event on parent element
*   @param {event} is the actual event
*   @param {selector} is the selector which we want to check against that event
*   @return {Boolean} trueif the event occured on selector or it's child elements
*   @return {Boolean} false if not
*/
function getParentWithSelector(event, selector) {

	var obj = $(event.target), matched = false;
	if(obj.is(selector)) {
		matched = true;
	}
	// if no match found in our above check
	if(!matched){
		result = obj.parents(selector + ":eq(0)");
		if(result.length) {
			obj=result;
			matched = true;
		}
	}
	event.target = obj;
	return matched;
};

function convertDateToUTC(date) {
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
}

function getCurrentConfirmation(){
	var activeTimeline = $('#reservation-card').attr('data-current-timeliine');
	var currentConfirmation = $("#"+activeTimeline+" .reservations-tabs ul li.ui-state-active").attr("data-confirmation-num");
	return currentConfirmation;
}

function getCurrentReservationDiv(){
	var activeTimeline = $('#reservation-card').attr('data-current-timeliine');
	var currentConfirmation = $("#"+activeTimeline+" .reservations-tabs ul li.ui-state-active").attr("data-confirmation-num");
	var currentReservationDiv = "reservation-"+currentConfirmation;
	return currentReservationDiv;
}


function getReservationId(){

	var currentFetchDom = getCurrentReservationDiv();
	var reservation_id = $("#"+currentFetchDom).attr("data-reservation-id");
	return reservation_id;
}

function getReservationStatus(){
	var currentFetchDom = getCurrentReservationDiv();
	var reservationStatus = $("#"+currentFetchDom).attr("data-reservation-status");
	return reservationStatus;
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

function getDateString(dateObj, showDay){

	var dateString = "";
	var weekday = new Array(7);
	weekday[0]="Sunday";
	weekday[1]="Monday";
	weekday[2]="Tuesday";
	weekday[3]="Wednesday";
	weekday[4]="Thursday";
	weekday[5]="Friday";
	weekday[6]="Saturday";


	var month = dateObj.getMonth() + 1 + "";
	if (month.length == 1){
        month = "0" + month;
    }

	var date = dateObj.getDate() + "";
	if (date.length == 1){
        date = "0" + date;
    }

    if(showDay == true){
    	var dateString = weekday[dateObj.getDay()] + " " + month + "-" + date  + "-" + dateObj.getFullYear();
    }else{
		var dateString = dateObj.getFullYear() + "-" + month  + "-" + date ;
    }
	return dateString;

};

var getRoomColorClass = function(reservationStatus, roomStatus, foStatus){
	var roomColorClass = "";
	if(reservationStatus == "CHECKING_IN"){
		if(roomStatus == "READY" && foStatus == "VACANT"){
			roomColorClass = "ready";
		} else {
			roomColorClass = "not-ready";
		}

	}
	return roomColorClass;
}

function isEmpty(dict) {
   for(var key in dict) {
      if (dict.hasOwnProperty(key)) {
         return false;
      }
   }
   return true;
}



var get_mapped_room_ready_status_color = function(roomReadyStatus, checkinIsInspectedOnly) {
		mappedColor = "";
		switch(roomReadyStatus) {

			case "INSPECTED":
				mappedColor = 'room-green';
				break;
			case "CLEAN":
				if (checkinIsInspectedOnly == "true") {
					mappedColor = 'room-orange';
					break;
				} else {
					mappedColor = 'room-green';
					break;
				}
				break;
			case "PICKUP":
				mappedColor = "room-orange";
				break;

			case "DIRTY":
				mappedColor = "room-red";
				break;

		}
		return mappedColor;
};