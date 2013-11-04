function getReservationId(){
	var reservation_id = $("#reservation_info").attr("data-reservation-id");
	return reservation_id;
}

__ = function(value){
	return ((value == null || typeof value == 'undefined' ) ? "": value);
}
