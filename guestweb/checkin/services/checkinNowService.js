	(function() {
		var checkinNowService = function($q,$http,$rootScope) {

			var responseData = {};

			var assignRoom = function(data) {
				var deferred = $q.defer();
				//var url = '/guest_web/search.json';
				$http.post(url,data).success(function(response) {
					deferred.resolve(this.responseData);
				}.bind(this))
				.error(function() {
					deferred.reject();
				});
				return deferred.promise;
			};

			var releaseRoomRoom = function(data) {
				var deferred = $q.defer();
				//var url = '/guest_web/search.json';
				$http.post(url,data).success(function(response) {
					deferred.resolve(this.responseData);
				}.bind(this))
				.error(function() {
					deferred.reject();
				});
				return deferred.promise;
			};

			var fetchEarlyCheckinData =  function(data){
				var deferred = $q.defer();
				var url = '/sample_json/zestweb_v2/checkin_now.json';
				// var url = '/guest_web/checkin_reservation_search.json';
				$http.get(url,{params: data}).success(function(response) {
					deferred.resolve(response);
				}.bind(this))
				.error(function() {
					deferred.reject();
				});
				return deferred.promise;
			};



			return {
				responseData: responseData,
				assignRoom : assignRoom,
				releaseRoomRoom:releaseRoomRoom,
				fetchEarlyCheckinData:fetchEarlyCheckinData
			};
		};

		var dependencies = [
		'$q','$http','$rootScope',
		checkinNowService
		];

		sntGuestWeb.factory('checkinNowService', dependencies);
	})();