admin.service('ADAppSrv',['ADBaseWebSrv','ADBaseWebSrvV2', function(ADBaseWebSrv, ADBaseWebSrvV2){

	this.fetch = function(){
		var url = '/admin/settings/menu_items.json';
		//var url = "ui/show?json_input=zestweb_v2/menuItem.json&format=json";
		return ADBaseWebSrv.getJSON(url);
	};

	this.fetchDashboardConfig = function(){
		var url = '/admin/dashboard.json';
		return ADBaseWebSrvV2.getJSON(url);
	};

	this.redirectToHotel = function(hotel_id){
		var url = '/admin/hotel_admin/update_current_hotel';
		var data = {"hotel_id": hotel_id};
		return ADBaseWebSrv.postJSON(url, data);
	};

	this.bookMarkItem = function(data){
		var url = '/admin/user_admin_bookmark';
		return ADBaseWebSrv.postJSON(url, data);
	};
	this.removeBookMarkItem = function(data){
		var id = data.id,
			url = '/admin/user_admin_bookmark/'+id;
		return ADBaseWebSrv.deleteJSON(url);
	};

	this.fetchHotelBusinessDate = function(data) {
		var url = '/api/business_dates/active';
		return ADBaseWebSrvV2.getJSON(url).then(function(data) {
				return (data.business_date);
			},function(errorMessage){
				return (errorMessage);
			});
	};

	this.hotelDetails = {};
	this.fetchHotelDetails = function(){
		var that = this,
			url = '/api/hotel_settings.json';
		return ADBaseWebSrvV2.getJSON(url).then(function(data) {
			that.hotelDetails = data;
			return (that.hotelDetails);
		},function(errorMessage){
			return (errorMessage);
		});
	};

}]);