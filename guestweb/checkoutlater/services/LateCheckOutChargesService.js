sntGuestWeb.service('LateCheckOutChargesService', [
	'$http',
	'$q',
	'$rootScope',
	function($http, $q, $rootScope) {
		var service = this;

		service.charges = {};

		service.fetchLateCheckoutOptions = function() {
			var deferred = $q.defer();
			var url = '/guest_web/get_late_checkout_charges.json',
				parameters = {
					'reservation_id': $rootScope.reservationID
				};

			$http.get(url, {
				params: parameters
			}).then(function(response) {
				service.charges = response.data;
				deferred.resolve(service.charges);
			}, function() {
				deferred.reject();
			});
			return deferred.promise;
		};

		service.postNewCheckoutOption = function(url, data) {
			var deferred = $q.defer();

			$http.post(url, data).then(function(response) {
				deferred.resolve(response.data);
			}, function() {
				deferred.reject();
			});
			return deferred.promise;
		};
	}
]);