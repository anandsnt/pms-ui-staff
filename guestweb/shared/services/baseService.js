(function() {
	var baseWebService = function($http, $q) {
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
				});

			return deferred.promise;
		};

		return {
			details: details,
			fetch: fetch
		}
	};

	var dependencies = [
		'$http',
		'$q',
		baseWebService
	];

	snt.factory('baseWebService', dependencies);
})();