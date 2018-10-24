angular.module('sntRover').service('RVGuestCardsSrv', [
    '$q',
    'rvBaseWebSrvV2',
    function ($q, RVBaseWebSrvV2) {

        this.PER_PAGE_COUNT = 50;

        /**
         * Fetch guest details
         * @param {object} data request object
         * @return {Promise} promise
         */
        this.fetchGuests = function (data) {
            var deferred = $q.defer(),
                url = '/api/guest_details';

            RVBaseWebSrvV2.getJSON(url, data).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };


        this.fetchGuestCardStatisticsSummary = function (params) {
            var deferred = $q.defer(),
                url = '/api/guest_details/' + params.guestId + '/statistics?view=SUMMARY';
            
            delete params.guestId;

            RVBaseWebSrvV2.getJSON(url, params).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchGuestCardStatisticsDetails = function (params) {
            var deferred = $q.defer(),
                url = '/api/guest_details/' + params.guestId + '/statistics?view=DETAILED';

            delete params.guestId;
            
            RVBaseWebSrvV2.getJSON(url, params).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        
        var _countryList = [];

        this.fetchNationsList = function() {
            var deferred = $q.defer();
            var url = '/ui/country_list';

            if (_countryList.length) {
                deferred.resolve(_countryList);
            } else {
                RVBaseWebSrvV2.getJSON(url).then(function(data) {
                    _countryList = data;
                    deferred.resolve(data);
                }, function(data) {
                    deferred.reject(data);
                });
            }

            return deferred.promise;
        };


        this.saveGuestIdDetails = function(params) {
            //var url = '/api/guest_identity/'+ params.reservation_id +'/save_id_details';

            var url =  '/api/guest_identity';

            return RVBaseWebSrvV2.postJSON(url, params);
        };

    }
]);