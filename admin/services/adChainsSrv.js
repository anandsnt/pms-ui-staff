admin.service('adChainsSrv',['$http', '$q', 'ADBaseWebSrv', function($http, $q, ADBaseWebSrv){

	var deferred = $q.defer();

	var fetchSuccess = function(data){
		
			deferred.resolve(data);
	};
	var fetchFailed = function(data){
			deferred.reject(data);
			
	};
		
	this.fetch = function(){


		var url = '/admin/hotel_chains.json';	
		
		ADBaseWebSrv.getJSON(url).then(fetchSuccess, fetchFailed);
		return deferred.promise;
	};

	this.edit = function(index){


		var url = '/admin/hotel_chains/'+index+'/edit.json';	
		
		ADBaseWebSrv.getJSON(url).then(fetchSuccess, fetchFailed);
		return deferred.promise;
	};


}]);