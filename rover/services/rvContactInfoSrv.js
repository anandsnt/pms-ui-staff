angular.module('sntRover').service('RVContactInfoSrv', [
    '$q', 'RVBaseWebSrv', 'rvBaseWebSrvV2', '$log', '$rootScope',
    function($q, RVBaseWebSrv, rvBaseWebSrvV2, $log, $rootScope) {

        var service = this,
            _guest = {
                id: null,
                isFetched: false
            };

        service.setGuest = function(id) {
            service.resetGuest();
            _guest.id = parseInt(id, 10);

        };

        service.isGuestFetchComplete = function(id) {
            id = parseInt(id, 10);
            return _guest.id === id && _guest.isFetched;
        };

        service.resetGuest = function() {
            _guest.id = null;
            _guest.isFetched = false;
        };

        service.saveContactInfo = function(param) {
            var deferred = $q.defer(),
                dataToSend = param.data,
                userId = param.userId,
                url = '/staff/guest_cards/' + userId;

            RVBaseWebSrv.putJSON(url, dataToSend).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        service.createGuest = function(param) {
            var deferred = $q.defer();
            var dataToSend = param.data;
            var url = '/api/guest_details';

            rvBaseWebSrvV2.postJSON(url, dataToSend).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };


        service.updateGuest = function(param) {
            var deferred = $q.defer(),            
                url = '/api/guest_details/' + param.userId;

            rvBaseWebSrvV2.putJSON(url, param.data).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        service.fetchGuestLanguages = function(param) {
            var deferred = $q.defer();
            var url = '/api/guest_languages';

            rvBaseWebSrvV2.getJSON(url, param).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        service.getGuestDetails = function() {
            var deferred = $q.defer();
            var url = '/api/guest_details/' + _guest.id;

            if (!$rootScope.isStandAlone) {
                url += "?sync_with_external_pms=true";
            }

            if (!_guest.id) {
                $log.debug('Guest not set!');
                deferred.reject(['Guest not set']);
            } else {
                rvBaseWebSrvV2.getJSON(url).then(function(data) {
                    _guest.isFetched = true;
                    deferred.resolve(data);
                }, function(data) {
                    deferred.reject(data);
                });
            }
            return deferred.promise;
        };

        /**
         * Remove guest details except first name and last name
         * @param {Number} guestId id of the guest
         * @return {Promise} Promise
         */
        service.removeGuestDetails = function (guestId) {
            var deferred = $q.defer(),
                url = '/api/guest_details/' + guestId + '/anonymize';

            rvBaseWebSrvV2.putJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        /**
         * Get guest details info by id
         * @param {Number} guestId id of the guest
         * @return {Promise} Promise
         */        
        service.getGuestDetailsById = function (guestId) {            
            var deffered = $q.defer(),
                url = '/api/guest_details/' + guestId;

            if (guestId === null) {
                deffered.reject([""]);
            } else {
               rvBaseWebSrvV2.getJSON(url).then (function (data) {
                    deffered.resolve (data);
                }, function (error) {
                    deffered.reject(error);
                }); 
            }

            return deffered.promise;
        };

        /**
         * Parse the api response data and convert it into the format required for view
         * @param {object} apiResponseData data from API
         * @return {object} guestData formatted data
         */
        service.parseGuestData = function (apiResponseData, guestId) {
            var guestData = {};

            guestData.id = guestId;
            guestData.firstName = apiResponseData.first_name;
            guestData.lastName = apiResponseData.last_name;
            guestData.image = apiResponseData.image_url;
            guestData.vip = apiResponseData.vip;
            if (apiResponseData.address) {
                guestData.address = {};
                guestData.address.city = apiResponseData.address.city;
                guestData.address.state = apiResponseData.address.state;
                guestData.address.postalCode = apiResponseData.address.postal_code;
            }
            guestData.stayCount = apiResponseData.stay_count;
            guestData.lastStay = {};
            guestData.phone = apiResponseData.home_phone;
            guestData.email = apiResponseData.email;

            if (apiResponseData.last_stay) {
                guestData.lastStay.date = apiResponseData.last_stay.date;
                guestData.lastStay.room = apiResponseData.last_stay.room;
               guestData.lastStay.roomType = apiResponseData.last_stay.room_type;
            }            

            return guestData;
        };

        /**
         * Delete guest by id
         * @param {Number} guestId id of the guest
         * @return {Promise} Promise
         */        
        service.deleteGuest = function (guestId) {
            var deffered = $q.defer(),
                url = '/api/guest_details/' + guestId;

            rvBaseWebSrvV2.deleteJSON(url).then (function (data) {
                deffered.resolve (data);
            }, function (error) {
                deffered.reject(error);
            });

            return deffered.promise;
        };


        service.checkIfCommisionWasRecalculated = function(param) {
            var deferred = $q.defer();
            var url = '/api/reservations/' + param.reservation_id + '/commission_transaction_info';

            rvBaseWebSrvV2.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

    }
]);
