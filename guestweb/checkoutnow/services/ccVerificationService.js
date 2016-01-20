(function() {
var ccVerificationService = function($q,$http) {
	var response = {};

	var verifyCC = function(data) {

			var deferred = $q.defer();
			var url = "/staff/reservation/save_payment";
			$http.post(url, data).success(function(response){
				deferred.resolve(response);
			}).error(function(){
				deferred.reject();
			});
			return deferred.promise;
		};


		return {
			response:response,
			verifyCC:verifyCC

		};
};

var dependencies = [
'$q','$http',
ccVerificationService
];

sntGuestWeb.factory('ccVerificationService', dependencies);
})();