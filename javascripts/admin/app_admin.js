$(document).ready(function(){
	var hotelAdminElement = document.getElementById('hotel-admin-view');
	var sntAdminElement = document.getElementById('snt-admin-view');
	if (hotelAdminElement != null){
		var hotelAdmin = new HotelAdminView($("#hotel-admin-view"));
		hotelAdmin.initialize();		
	} else if(sntAdminElement != null){
		var sntAdmin = new SntAdminView($("#snt-admin-view"));
		sntAdmin.initialize();
	}
	
});