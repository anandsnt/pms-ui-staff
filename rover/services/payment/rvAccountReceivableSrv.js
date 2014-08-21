sntRover.service('RVAccountReceivableSrv',['$http', '$q', 'RVBaseWebSrv', function($http, $q, RVBaseWebSrv){
   
	this.create = function(data){
		var deferred = $q.defer();
		var url = 'api/accounts/save_ar_details.json';
		RVBaseWebSrv.postJSON(url).then(function(data) {
			    deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});	
		return deferred.promise;
	};
	
}]);