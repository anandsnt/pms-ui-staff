angular.module('sntRover').service('RVGuestCardsSrv', [
    '$q',
    'rvBaseWebSrvV2',
    function ($q, RVBaseWebSrvV2) {

        var guestFieldData = {},
            service = this;

        this.PER_PAGE_COUNT = 50;


        service.fetchGuestDetails = function(param) {
            var deferred = $q.defer(),
                url = '/api/guest_details';

            RVBaseWebSrvV2.getJSON(url, param).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        /*
         * Fetch admin settings
         *
         */
        service.fetchGuestAdminSettings = function() {
            var deferred = $q.defer();
            var url = '/admin/guest_card_settings/current_settings';

            RVBaseWebSrvV2.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        /**
         * Fetch guest details
         * @param {object} param request object
         * @return {Promise} promise
         */
        this.fetchGuests = function (param) {

            var deferred = $q.defer(),
                data = {};

            $q.when().then(function() {
                return service.fetchGuestDetails(param).then(function(response) {
                    data = response;
                });
            })
            .then(function() {                 
                return service.fetchGuestAdminSettings().then(function(response) {
                    data.guestAdminSettings = response;
                });
            })            
            .then(function() {
                deferred.resolve(data);
            }, function(errorMessage) {
                deferred.reject(errorMessage);
            });

            return deferred.promise;
        };
        /*
         * CICO-63251
         * @return object
         */
        this.setGuestFields = function() {
            return guestFieldData;
        };

        /*
         * CICO-63251
         * @return object
         */
        this.setGuestFields = function() {
            return guestFieldData;
        };

        /**
         * Fetch guest card statistics summary
         * @param {Object} params request params
         * @return {Promise} promise
         */
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

        /**
         * Fetch guest card statistics details
         * @param {Object} params request params
         * @return {Promise} promise
         */
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

        this.saveFaceImage = function(params) {
            var url = '/staff/guest_cards/' + params.guest_id + '.json';

            return RVBaseWebSrvV2.putJSON(url, params);
        };

        /**
         * Verify whether the given guest cards are eligible for being merged
         * @param {Object} params contains array of ids of the guest cards
         * @return {Promise} promise
         */
        this.verifyGuestCardMerge = function(params) {
            var deferred = $q.defer(),
                url = '/api/guest_details/validate_card_merge';

            RVBaseWebSrvV2.postJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise; 
        };

        /**
         * Merge the non-primary cards to primary card
         * @param {Object} params contains primary card id, non-primary card ids and card type
         * @return {Promise} promise
         */
        this.mergeCards = function(params)  {
            var deferred = $q.defer(),
                url = '/api/guest_details/merge_cards';

            RVBaseWebSrvV2.postJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise; 
        };
        
        this.fetchGenderTypes = function () {
            var deffered = $q.defer(),
               url = 'api/guest_details/gender_types';

            RVBaseWebSrvV2.getJSON(url)
             .then( function (data) {
                deffered.resolve( data.gender_type_list);
             }, function (error) {
                deffered.resolve( error);
             });

             return deffered.promise;
        };

    }
]);