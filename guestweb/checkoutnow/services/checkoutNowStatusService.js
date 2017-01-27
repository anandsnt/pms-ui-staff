(function() {
var checkoutNowService = function($q, $rootScope, $http) {
	var response = {};

	var completeCheckout = function(url, data) {

		var deferred = $q.defer();

		$http.post(url, data).then(function(response) {
			deferred.resolve(response.data);
		}, function() {
		$rootScope.netWorkError = true;
			deferred.reject();
		});
		return deferred.promise;
		};

		return {
			response: response,
			completeCheckout: completeCheckout

		};
};

var dependencies = [
'$q', '$rootScope', '$http',
checkoutNowService
];

sntGuestWeb.factory('checkoutNowService', dependencies);
})();