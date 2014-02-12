(function() {
	var BaseService = function($http, $q) {
		// var response = {};

		var fetch = function(url) {
			var deferred = $q.defer();

			$http.get(url)
				.success(function(response) {
					// this.response = response;
					deferred.resolve(response);
				}.bind(this))
				.error(function() {
					deferred.reject();
				});

			return deferred.promise;
		};

		return {
			//urls: urls,
			fetch: fetch
		}
	};

	var dependencies = [
		'$http',
		'$q',
		BaseService
	];

	snt.factory('BaseService', dependencies);
})();