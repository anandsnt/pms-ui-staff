sntRover.service('RVReservationGuestSrv', ['$q', 'rvBaseWebSrvV2',
    function($q, RVBaseWebSrvV2) {

    	this.fetchGuestTabDetails = function(data) {
            var deferred = $q.defer();
            var url = '/api/reservations/'+data.reservation_id+'/reservations_guest_details';
            RVBaseWebSrvV2.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.updateGuestTabDetails = function(data) {
            var deferred = $q.defer();
            var url = '/api/reservations/'+data.reservation_id+'/reservations_guest_details';
            RVBaseWebSrvV2.postJSON(url, data).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        
         this.fetchGuestPrefList = function (params) {
            var deferred = $q.defer();
            var url = 'api/hotels/guest_preferences.json';

            RVBaseWebSrvV2.getJSON(url, params).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        
    }
]);