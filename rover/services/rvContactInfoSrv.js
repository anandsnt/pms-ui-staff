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
            var deferred = $q.defer();
            var dataToSend = param.data;
            var userId = param.userId;
            var url = '/staff/guest_cards/' + userId;

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
            var deferred = $q.defer();
            var dataToSend = param.data;
            var userId = param.userId;
            var url = '/api/guest_details/' + userId;

            rvBaseWebSrvV2.putJSON(url, dataToSend).then(function(data) {
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

    }
]);
