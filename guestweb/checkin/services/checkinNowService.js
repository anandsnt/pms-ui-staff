	(function() {
		var checkinNowService = function($q, $http) {

			var responseData = {};

			var assignRoom = function(data) {
				var deferred = $q.defer();
				var url = ' /staff/reservation/modify_reservation.json';

				$http.post(url, data).then(function(response) {
					deferred.resolve(response.data);
				}, function() {
					deferred.reject();
				});

				return deferred.promise;
			};

			var releaseRoomRoom = function(data) {
				var deferred = $q.defer();
				var url = '/api/reservations/' + data.reservation_id + '/unassign_room';

				$http.post(url).then(function(response) {
					deferred.resolve(response.data);
				}, function() {
					deferred.reject();
				});

				return deferred.promise;
			};

			var fetchEarlyCheckinData =  function(data) {
				var deferred = $q.defer();
				var url = '/guest_web/reservations/' + data.reservation_id + '.json';

				$http.post(url, {params: data}).then(function(response) {
					deferred.resolve(response.data);
				}, function() {
					deferred.reject();
				});

				return deferred.promise;
			};


			return {
				responseData: responseData,
				assignRoom: assignRoom,
				releaseRoomRoom: releaseRoomRoom,
				fetchEarlyCheckinData: fetchEarlyCheckinData
			};
		};

		var dependencies = [
		'$q', '$http', '$rootScope',
		checkinNowService
		];

		sntGuestWeb.factory('checkinNowService', dependencies);
	})();