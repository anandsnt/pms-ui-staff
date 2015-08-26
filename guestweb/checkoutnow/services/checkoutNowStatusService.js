(function() {
var checkoutNowService = function($q,$rootScope,$http) {
	var response = {};

	var completeCheckout = function(url,data) {

		var deferred = $q.defer();
		$http.post(url, data).success(function(response){
			deferred.resolve(response);
		}).error(function(){
		$rootScope.netWorkError = true;
			deferred.reject();
		});
		return deferred.promise;
		};

		return {
			response:response,
			completeCheckout:completeCheckout

		};
};

var dependencies = [
'$q','$rootScope','$http',
checkoutNowService
];

snt.factory('checkoutNowService', dependencies);
})();