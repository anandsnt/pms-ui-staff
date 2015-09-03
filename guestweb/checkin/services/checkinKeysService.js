(function() {
	var checkinKeysService = function($q,$http,$rootScope) {

		var responseData = {};

		var checkin = function(url,data) {

				var deferred = $q.defer();
				$http.post(url,data).success(function(response) {
					this.responseData = response;
				     deferred.resolve(this.responseData);
				}.bind(this))
				.error(function() {
					deferred.reject();
				});
			return deferred.promise;
		};



		return {
			responseData: responseData,
			checkin : checkin
		};
	};

	var dependencies = [
	'$q','$http','$rootScope',
	checkinKeysService
	];

	snt.factory('checkinKeysService', dependencies);
})();