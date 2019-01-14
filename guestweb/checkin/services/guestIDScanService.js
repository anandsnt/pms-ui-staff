(function() {
	var guestIDScanService = function($q, $http) {

		var savePassport = function(params) {
			var deferred = $q.defer();
			var url = '/api/guest_identity';

			params.application = 'WEB';

			$http.post(url, params).success(function(response) {
					this.responseData = response;
					deferred.resolve(this.responseData);
				}.bind(this))
				.error(function() {
					deferred.reject();
				});
			return deferred.promise;
		};

		var recordReservationActions = function(params) {

			var deferred = $q.defer(),
				url = '/api/reservation_actions';

			$http.post(url, params).success(function(response) {
					deferred.resolve(response);
				}.bind(this))
				.error(function() {
					deferred.reject();
				});
			return deferred.promise;
		};

		var saveFaceImage = function(params) {
			var deferred = $q.defer(),
			    url = '/staff/guest_cards/' + params.id + '.json';

			$http.put(url, params).success(function(response) {
					deferred.resolve(response);
				}.bind(this))
				.error(function() {
					deferred.reject();
				});
			return deferred.promise;
		};

		return {
			savePassport: savePassport,
			recordReservationActions: recordReservationActions,
			saveFaceImage: saveFaceImage
		};
	};

	var dependencies = [
		'$q', '$http',
		guestIDScanService
	];

	sntGuestWeb.factory('guestIDScanService', dependencies);
})();