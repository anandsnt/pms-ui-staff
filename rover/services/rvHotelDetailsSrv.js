sntRover.service('RVHotelDetailsSrv',['$q', 'rvBaseWebSrvV2', function( $q, RVBaseWebSrvV2){

   	var that = this;
	this.fetchHotelDetails = function(){
		var deferred = $q.defer();
		
		 that.fetchHotelBusinessDate = function(){
			var url = '/api/business_dates/active';
			RVBaseWebSrvV2.getJSON(url).then(function(data) {
				that.hotelDetails.business_date = data.business_date;
				deferred.resolve(that.hotelDetails);
			},function(errorMessage){
				deferred.reject(errorMessage);
			});
			return deferred.promise;
		};		
		
		
		var url = '/api/hotel_settings.json';
		RVBaseWebSrvV2.getJSON(url).then(function(data) {
			that.hotelDetails = data;
			that.fetchHotelBusinessDate();
		},function(errorMessage){
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};

}]);