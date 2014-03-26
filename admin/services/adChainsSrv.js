admin.service('adChainsSrv',['$http', '$q', 'ADBaseWebSrv', function($http, $q, ADBaseWebSrv){


	this.fetch = function(){
		var deferred = $q.defer();
		console.log("started");
		var url = '/admin/hotel_chains.json';	
		
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