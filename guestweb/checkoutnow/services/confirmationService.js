(function() {
	var confirmationService = function($http, $q) {
		var details = {};

		var fetch = function() {
			var deferred = $q.defer();

			$http.get('/assets/fauxDB/confirmationPageDetails.json')
				.success(function(response) {
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
		confirmationService
	];

	snt.factory('confirmationService', dependencies);
})();