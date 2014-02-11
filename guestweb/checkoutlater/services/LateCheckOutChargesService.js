(function() {
	var LateCheckOutChargesService = function($http, $q) {
		var charges = {};

		var fetch = function() {
			var deferred = $q.defer();

			$http.get('/assets/fauxDB/lateCheckOutCharges.json')
				.success(function(response) {
					this.charges = response;
					deferred.resolve(this.charges);
				}.bind(this))
				.error(function() {
					deferred.reject();
				});

			return deferred.promise;
		};

		return {
			charges: charges,
			fetch: fetch
		}
	};

	var dependencies = [
		'$http',
		'$q',
		LateCheckOutChargesService
	];

	snt.factory('LateCheckOutChargesService', dependencies);
})();