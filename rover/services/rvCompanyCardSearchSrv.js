sntRover.service('RVCompanyCardSearchSrv',['$q', 'rvBaseWebSrvV2', function($q, rvBaseWebSrvV2){
	
	var self = this;
	
	this.fetch = function(data){
		var deferred = $q.defer();		
		var url =  '/api/accounts/search_account';	
		rvBaseWebSrvV2.postJSON(url,data).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;		
	};


}]);