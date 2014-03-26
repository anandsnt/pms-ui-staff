admin.service('ADAppSrv',['$http', '$q', 'ADBaseWebSrv', function($http, $q, ADBaseWebSrv){

	this.fetch = function(){
		var deferred = $q.defer();
		console.log("started");
		var url = '/admin/settings/menu_items.json';	
		
		var fetchSuccess = function(data){
			deferred.resolve(data);
		};
		var fetchFailed = function(data){
			deferred.reject(data);
		};
		
		ADBaseWebSrv.getJSON(url).then(fetchSuccess, fetchFailed);
		return deferred.promise;
	};


}]);