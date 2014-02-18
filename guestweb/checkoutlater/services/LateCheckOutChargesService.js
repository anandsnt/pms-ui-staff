(function() {
	var LateCheckOutChargesService = function($http, $q, $rootScope) {
		var charges = {};

		var fetch = function() {
			var deferred = $q.defer();
			console.log('................');
		
			$http.get('/guest_web/get_late_checkout_charges.json',{params:{'reservation_id':$rootScope.reservationID}})
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
		'$rootScope',
		LateCheckOutChargesService
	];

	snt.factory('LateCheckOutChargesService', dependencies);
})();