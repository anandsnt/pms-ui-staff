	(function() {
		var checkinConfirmationService = function($q, $http, $rootScope) {

			var responseData = {};

			var verifyCheckinReservation = function(data) {
				var deferred = $q.defer();
				var url = '/guest_web/search.json';

				// if controller didn't send the url suffix
				if (typeof data.url_suffix === "undefined") {
					data.url_suffix = (typeof $rootScope.urlSuffix !== "undefined") ? $rootScope.urlSuffix : "";
				}

				$http.post(url, data).success(function(response) {
					this.responseData = response;
					deferred.resolve(this.responseData);
				}.bind(this))
				.error(function() {
					deferred.reject();
				});
				return deferred.promise;
			};

			var searchReservation =  function(data) {
				var deferred = $q.defer();

				data.application = (typeof $rootScope.application !== "undefined") ? $rootScope.application : "";
				var url = '/guest_web/checkin_reservation_search.json';

				$http.get(url, {params: data}).success(function(response) {
					deferred.resolve(response);
				})
				.error(function() {
					deferred.reject();
				});
				return deferred.promise;
			};


			var getToken = function(data) {
				var deferred = $q.defer();

				data.application = (typeof $rootScope.application !== "undefined") ? $rootScope.application : "";

				// if controller didn't send the url suffix
				if (typeof data.url_suffix === "undefined") {
					data.url_suffix = (typeof $rootScope.urlSuffix !== "undefined") ? $rootScope.urlSuffix : "";
				}

				var url = '/guest_web/authenticate_checkin_guest';

				$http.post(url, data).success(function(response) {
					deferred.resolve(response);
				})
				.error(function() {
					deferred.reject();
				});
				return deferred.promise;
			};

			var isReservationEligibleToCheckin = function(data) {
				var deferred = $q.defer();
				var url = '/guest_web/checkin_reservation_search.json';


				var response = {
					is_eligible_to_checkin: false,
					reason: 'Recent changes to the payment arrangement on your reservation no longer allow performing a web based check-in'
				};
				deferred.resolve(response);

				// $http.get(url, {
				// 		params: data
				// 	}).success(function(response) {
				// 		deferred.resolve(response);
				// 	})
				// 	.error(function() {
				// 		deferred.reject();
				// 	});
				return deferred.promise;
			};

			return {
				responseData: responseData,
				verifyCheckinReservation: verifyCheckinReservation,
				searchReservation: searchReservation,
				getToken: getToken,
				isReservationEligibleToCheckin: isReservationEligibleToCheckin
			};
		};

		var dependencies = [
		'$q', '$http', '$rootScope',
		checkinConfirmationService
		];

		sntGuestWeb.factory('checkinConfirmationService', dependencies);
	})();