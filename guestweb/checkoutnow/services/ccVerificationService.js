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

	var fetchMerchantID = function() {
			var deferred = $q.defer();
			var url = "/api/merchant_id.json";
			$http.get(url).success(function(response){
				deferred.resolve(response);
			}).error(function(){
				deferred.reject();			
			});
			return deferred.promise;
		};

		return {
			response:response,
			verifyCC:verifyCC,
			fetchMerchantID:fetchMerchantID

		}
};

var dependencies = [
'$q','$http',
ccVerificationService
];

snt.factory('ccVerificationService', dependencies);
})();