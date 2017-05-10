angular.module('sntRover').service('RVReservationNotesService', ['$q', 'rvBaseWebSrvV2',
    function($q, rvBaseWebSrvV2) {
        var service = this;

        /**
         * Syncs the notes with the opera systems and returns the notes_count
         * @param {Integer} reservationID reservation_id from the stay card
         * @returns {promise|{then, catch, finally}|*|e} promise would return total notes when succeeds
         */
        service.sync = function(reservationID) {
            var deferred = $q.defer(),
                url = '/api/reservations/' + reservationID + '/sync_notes_with_ext_pms.json';

            rvBaseWebSrvV2.getJSON(url).then(function(res) {
                deferred.resolve(res.notes_count);
            }, function(err) {
                deferred.reject(err);
            });

            return deferred.promise;
        };


        /**
         *
         * @param {Integer} reservationID reservationID reservation_id from the stay card
         * @returns {promise|{then, catch, finally}|*|e} returns list of notes associated with the reservation
         */
        service.fetch = function(reservationID) {
            var deferred = $q.defer(),
                url = '/api/reservations/' + reservationID + '/notes.json';

            rvBaseWebSrvV2.getJSON(url).then(function(res) {
                deferred.resolve(res.notes.reservation_notes);
            }, function(err) {
                deferred.reject(err);
            });

            return deferred.promise;
        };

    }
]);