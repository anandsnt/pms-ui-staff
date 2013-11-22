function getReservationId(){
	var reservation_id = $("#reservation_info").attr("data-reservation-id");
	return reservation_id;
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

    if (reg.test(emailField) == false) 
    {
        alert('Invalid Email Address');
        return false;
    }

    return true;

}