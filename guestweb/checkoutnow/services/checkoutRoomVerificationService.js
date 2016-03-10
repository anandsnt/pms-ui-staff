(function() {
var checkoutRoomVerificationService = function($q,$rootScope,$http) {
	var response = {};

	var verifyRoom = function(url,data) {

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
			verifyRoom:verifyRoom

		};
};

var dependencies = [
'$q','$rootScope','$http',
checkoutRoomVerificationService
];

sntGuestWeb.factory('checkoutRoomVerificationService', dependencies);
})();