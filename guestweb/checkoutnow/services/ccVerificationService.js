(function() {
var ccVerificationService = function($q,$http,$rootScope) {
	var response = {};

	var verifyCC = function(data) {

			var deferred = $q.defer();
			var url = "/staff/reservation/save_payment";
			data.application = (typeof $rootScope.application !=="undefined") ? $rootScope.application : "";
			data.url_suffix = (typeof $rootScope.urlSuffix !=="undefined") ? $rootScope.urlSuffix : "";
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
'$q','$http','$rootScope',
ccVerificationService
];

sntGuestWeb.factory('ccVerificationService', dependencies);
})();