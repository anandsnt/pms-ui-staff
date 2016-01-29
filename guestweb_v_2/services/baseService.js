(function() {
	var baseWebService = function($http, $q,$rootScope) {
		var details = {};

		var fetch = function(url,parameters) {
			var deferred = $q.defer();


			$http.get(url,{
    		params: parameters
			}).success(function(response) {
					this.details = response;
					deferred.resolve(this.details);
				}.bind(this))
				.error(function() {
					deferred.reject();
					$rootScope.netWorkError = true;
				});

			return deferred.promise;
		};
		var post = function(url,parameters) {


			var deferred = $q.defer();

			$http.post(url, parameters
			).success(function(response) {
					this.details = response;
					deferred.resolve(this.details);
				}.bind(this))
				.error(function() {
					deferred.reject();
					$rootScope.netWorkError = true;
				});

			return deferred.promise;
		};

		return {
			details: details,
			fetch: fetch,
			post :post
		};
	};

	var dependencies = [
		'$http',
		'$q','$rootScope',
		baseWebService
	];

	sntGuestWeb.factory('baseWebService', dependencies);
})();