sntRover.service('RVHotelDetailsSrv',['$q', 'rvBaseWebSrvV2', function( $q, RVBaseWebSrvV2){

   	var that = this;
	this.fetchHotelDetails = function(){
		var deferred = $q.defer();

		that.fetchUserHotels = function(){
			var url = '/api/current_user_hotels';
			RVBaseWebSrvV2.getJSON(url).then(function(data) {
				that.hotelDetails.userHotelsData = data;
				deferred.resolve(that.hotelDetails);
			},function(errorMessage){
				deferred.reject(errorMessage);
			});
			return deferred.promise;
		};


		that.fetchHotelBusinessDate = function(){
			var url = '/api/business_dates/active';
			RVBaseWebSrvV2.getJSON(url).then(function(data) {
				that.hotelDetails.business_date = data.business_date;
				that.fetchUserHotels();
			},function(errorMessage){
				deferred.reject(errorMessage);
			});
			return deferred.promise;
		};


		var url = '/api/hotel_settings.json';
		RVBaseWebSrvV2.getJSON(url).then(function(data) {
			that.hotelDetails = data;
			that.hotelDetails.is_auto_change_bussiness_date = data.business_date.is_auto_change_bussiness_date;
			that.fetchHotelBusinessDate();
		},function(errorMessage){
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};


	this.redirectToHotel = function(hotel_id){
		var deferred = $q.defer();
		var url = '/admin/hotel_admin/update_current_hotel';
		var data = {"hotel_id": hotel_id};
		RVBaseWebSrvV2.postJSON(url, data).then(function(data) {
			deferred.resolve(data);
		},function(errorMessage){
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};

}]);