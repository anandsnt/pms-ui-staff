sntRover.service('RVAccountReceivableSrv',['$http', '$q', 'RVBaseWebSrv', function($http, $q, RVBaseWebSrv){
   
	this.create = function(data){
		var deferred = $q.defer();
		var url = '/staff/payments/payment.json?user_id='+userId;
		RVBaseWebSrv.getJSON(url).then(function(data) {
			    deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});	
		return deferred.promise;
	};
	
}]);