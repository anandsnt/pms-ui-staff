admin.service('ADAppSrv',['$http', '$q', 'ADBaseWebSrv', function($http, $q, ADBaseWebSrv){

	this.fetch = function(){
		var deferred = $q.defer();
		// var url = '/admin/settings/menu_items.json';	
		var url = '/sample_json/menu_items.json';
		
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


}]);