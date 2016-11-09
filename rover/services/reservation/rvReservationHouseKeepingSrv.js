sntRover.service('rvReservationHouseKeepingSrv', ['$q', 'rvBaseWebSrvV2',
    function($q, RVBaseWebSrvV2) {

        this.fetch = function(data) {
            var deferred = $q.defer();
            var url = '/api/reservations/' + data.reservation_id + '/room_attendance';

            RVBaseWebSrvV2.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.save = function(data) {
            // To Do: after API completion
            var deferred = $q.defer();
            var url = '/api/reservations/save_reservation_task';

            RVBaseWebSrvV2.postJSON(url, data).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
    }
]);