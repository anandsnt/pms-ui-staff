(function() {
var preCheckinSrv = function($q,baseWebService,$rootScope,$http) {

	var tripDetails = {};

	//fetch trip details
	var fetchTripDetails = function() {
		var deferred = $q.defer();
		var reservationId = $rootScope.reservationID;		
		var url = 'api/reservations/reservationId/web_checkin_reservation_details';
		$http.get(url).success(function(response) {
			this.tripDetails = response;
			deferred.resolve(this.bills);
		}.bind(this))
		.error(function() {
			deferred.reject();
		});
		return deferred.promise;
	};

	var postStayDetails = function(data) {
				var deferred = $q.defer();
				var url = '/guest_web/search.json';
				parameters = {'reservation_id':$rootScope.reservationID};
				$http.post(url,data).success(function(response) {
					deferred.resolve(this.responseData);
				}.bind(this))
				.error(function() {
					deferred.reject();
				});
				return deferred.promise;
	};

	var completePrecheckin = function(data) {
				var deferred = $q.defer();
				var url = '/guest_web/search.json';
				parameters = {'reservation_id':$rootScope.reservationID};
				$http.post(url).success(function(response) {
					deferred.resolve(this.responseData);
				}.bind(this))
				.error(function() {
					deferred.reject();
				});
				return deferred.promise;
	};

	return {
		fetchTripDetails : fetchTripDetails,
		postStayDetails:postStayDetails,
		completePrecheckin:completePrecheckin
	}
};

var dependencies = [
'$q','baseWebService','$rootScope','$http',
preCheckinSrv
];

snt.factory('preCheckinSrv', dependencies);
})();