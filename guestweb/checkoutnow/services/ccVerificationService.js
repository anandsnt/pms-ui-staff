(function() {
var ccVerificationService = function($q,$http) {
	var response = {};

	var verifyCC = function(url,data) {

			var deferred = $q.defer();
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

		}
};

var dependencies = [
'$q','$http',
ccVerificationService
];

snt.factory('ccVerificationService', dependencies);
})();