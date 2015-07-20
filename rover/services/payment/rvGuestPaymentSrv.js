sntRover.service('RVGuestCardSrv',['$http', '$q', 'RVBaseWebSrv', function($http, $q, RVBaseWebSrv){

	this.fetchGuestPaymentData = function(userId){
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