/**
 * Service used for tablet-kiosk UI (Zest Station)
 */

sntZestStation.service('zsGeneralSrv', ['$http', '$q', 'zsBaseWebSrv', 'zsBaseWebSrv2',
	function($http, $q, zsBaseWebSrv, zsBaseWebSrv2) {

		this.getDoorLockSettings = function() {
			var deferred = $q.defer(),
				url = 'api/door_lock_interfaces.json';

			zsBaseWebSrv.getJSON(url).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		this.encodeKey = function(params) {
            var deferred = $q.defer(),
                url = '/staff/reservation/print_key';

            zsBaseWebSrv2.postJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.saveUIDtoRes = function(params) {
            var deferred = $q.defer(),
                url = '/api/reservations/update_key_uid';

            zsBaseWebSrv.postJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };



        this.fetchReservationDetails = function(param) {
            var  url = '/staff/staycards/reservation_details.json?reservation_id=' + param.reservation_id;
            var deferred = $q.defer();
            
            zsBaseWebSrv2.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };


	}
]);