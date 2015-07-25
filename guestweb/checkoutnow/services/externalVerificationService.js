(function() {
var externalVerificationService = function($q,$http,$rootScope) {
	var response = {};

	var verifyUser = function(data) {

		var deferred = $q.defer();
		var url = '/guest_web/authenticate_checkout_guest'
		$http.post(url, data).success(function(response){
			deferred.resolve(response);
		}).error(function(){				
			deferred.reject();			
		});
		return deferred.promise;
		};

		return {
			response:response,
			verifyUser:verifyUser

		}
};

var dependencies = [
'$q','$http','$rootScope',
externalVerificationService
];

snt.factory('externalVerificationService', dependencies);
})();