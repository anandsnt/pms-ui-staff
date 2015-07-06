admin.service('ADAppSrv',['$http', '$q', 'ADBaseWebSrv','ADBaseWebSrvV2', function($http, $q, ADBaseWebSrv, ADBaseWebSrvV2){

	this.fetch = function(){
		var deferred = $q.defer();
		var url = '/admin/settings/menu_items.json';
		// var url = '/sample_json/menu_items.json';
		
		var fetchSuccess = function(data){
			deferred.resolve(data);
		};
		var fetchFailed = function(data){
			deferred.reject(data);
		};
		
		ADBaseWebSrv.getJSON(url).then(fetchSuccess, fetchFailed);
		return deferred.promise;
	};
	
	this.redirectToHotel = function(hotel_id){
		var deferred = $q.defer();
		var url = '/admin/hotel_admin/update_current_hotel';
		
		var fetchSuccess = function(data){
			deferred.resolve(data);
		};
		var fetchFailed = function(data){
			deferred.reject(data);
		};
		var data = {"hotel_id": hotel_id};
		ADBaseWebSrv.postJSON(url, data).then(fetchSuccess, fetchFailed);
		return deferred.promise;
		
	};
	
	this.bookMarkItem = function(data){
		var deferred = $q.defer();
		var url = '/admin/user_admin_bookmark';
		
		var fetchSuccess = function(data){
			deferred.resolve(data);
		};
		var fetchFailed = function(data){
			deferred.reject(data);
		};
		
		ADBaseWebSrv.postJSON(url, data).then(fetchSuccess, fetchFailed);
		return deferred.promise;
	};
	this.removeBookMarkItem = function(data){
		var id = data.id;
		var deferred = $q.defer();
		var url = '/admin/user_admin_bookmark/'+id;
		
		var fetchSuccess = function(data){
			deferred.resolve(data);
		};
		var fetchFailed = function(data){
			deferred.reject(data);
		};
		
		ADBaseWebSrv.deleteJSON(url).then(fetchSuccess, fetchFailed);
		return deferred.promise;
	};
	
	this.fetchHotelBusinessDate = function(data) {
		var deferred = $q.defer();
		var url = '/api/business_dates/active';
		
		ADBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data.business_date);
		},function(errorMessage){
			deferred.reject(errorMessage);
		});
		
		return deferred.promise;
	};
	
	this.hotelDetails = {};
	this.fetchHotelDetails = function(){
		var that = this;
		var deferred = $q.defer();
		
		var url = '/api/hotel_settings.json';
		ADBaseWebSrvV2.getJSON(url).then(function(data) {
			that.hotelDetails = data;
			deferred.resolve(that.hotelDetails);
		},function(errorMessage){
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};

}]);