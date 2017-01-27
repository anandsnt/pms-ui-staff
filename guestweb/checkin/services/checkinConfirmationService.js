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

				$http.post(url, data).then(function(response) {
					this.responseData = response.data;
					deferred.resolve(this.responseData);
				},function() {
					deferred.reject();
				});
				return deferred.promise;
			};

			var searchReservation =  function(data) {
				var deferred = $q.defer();

				data.application = (typeof $rootScope.application !== "undefined") ? $rootScope.application : "";
				var url = '/guest_web/checkin_reservation_search.json';

				$http.get(url, {params: data}).then(function(response) {
					deferred.resolve(response.data);
				}, function() {
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

				$http.post(url, data).then(function(response) {
					deferred.resolve(response.data);
				}, function() {
					deferred.reject();
				});
				return deferred.promise;
			};

			return {
				responseData: responseData,
				verifyCheckinReservation: verifyCheckinReservation,
				searchReservation: searchReservation,
				getToken: getToken
			};
		};

		var dependencies = [
		'$q', '$http', '$rootScope',
		checkinConfirmationService
		];

		sntGuestWeb.factory('checkinConfirmationService', dependencies);
	})();