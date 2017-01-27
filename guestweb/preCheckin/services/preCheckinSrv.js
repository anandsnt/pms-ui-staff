(function() {
var preCheckinSrv = function($q, baseWebService, $rootScope, $http) {


	var reservationId = $rootScope.reservationID;
	// fetch trip details
	var fetchTripDetails = function() {
		var deferred = $q.defer();
		var url = '/api/reservations/' + reservationId + '/web_checkin_reservation_details';

		$http.get(url).then(function(response) {
			deferred.resolve(response.data);
		}, function() {
			deferred.reject();
		});
		return deferred.promise;
	};

	// post staydetails
	var postStayDetails = function(data) {
		var deferred = $q.defer();
		var url = '/api/reservations/' + reservationId + '/update_stay_details';

		$http.post(url, data).then(function(response) {
			deferred.resolve(response.data);
		}, function() {
			deferred.reject();
		});
		return deferred.promise;
	};

	var completePrecheckin = function() {
		var deferred = $q.defer();
		var url = '/api/reservations/' + reservationId + '/pre_checkin';
		var data = {};

		data.application = (typeof $rootScope.application !== "undefined") ? $rootScope.application : "";
		data.url_suffix = (typeof $rootScope.urlSuffix !== "undefined") ? $rootScope.urlSuffix : "";
		$http.post(url, data).then(function(response) {
			deferred.resolve(response.data);
		}, function() {
			deferred.reject();
		});
		return deferred.promise;
	};

	return {
		fetchTripDetails: fetchTripDetails,
		postStayDetails: postStayDetails,
		completePrecheckin: completePrecheckin
	};
};

var dependencies = [
'$q', 'baseWebService', '$rootScope', '$http',
preCheckinSrv
];

sntGuestWeb.factory('preCheckinSrv', dependencies);
})();