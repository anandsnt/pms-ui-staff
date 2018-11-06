angular.module('sntRover').service('RVGuestCardsSrv', 
[
 '$q',
 'rvBaseWebSrvV2', 
  function($q, RVBaseWebSrvV2) {       

        this.PER_PAGE_COUNT = 50;

        /**
         * Fetch guest details
         * @param {object} data request object
         * @return {Promise} promise
         */
        this.fetchGuests = function(data) {
            var deferred = $q.defer(),
                url = '/api/guest_details';

            RVBaseWebSrvV2.getJSON(url, data).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        
    }
]);