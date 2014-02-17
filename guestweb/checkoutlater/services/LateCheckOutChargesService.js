(function() {
	var LateCheckOutChargesService = function($http, $q) {
		var charges = {};

		var fetch = function() {
			var deferred = $q.defer();

			$http.get('/guest_web/get_late_checkout_charges.json')
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