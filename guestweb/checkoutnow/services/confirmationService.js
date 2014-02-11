(function() {
	var confirmationService = function($http, $q) {
		var details = {};

		var fetch = function() {
			var _this = this;
			var deferred = $q.defer();

			$http.get('/assets/fauxDB/confirmationPageDetails.json')
				.success(function(response) {
					_this.details = response;
					deferred.resolve(_this.details);
				})
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