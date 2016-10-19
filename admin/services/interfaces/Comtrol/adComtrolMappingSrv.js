admin.service('adComtrolMappingSrv', ['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2) {


    this.fetchChargeCodeMappings = function() {
        var deferred = $q.defer();
        var url = '';

        ADBaseWebSrvV2.getJSON(url).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.resolve([]);
            // deferred.reject(data);
        });
        return deferred.promise;
    };


    this.fetchGenericMappings = function(params) {
        var deferred = $q.defer();
        var url = '/api/hotel_settings/gomomentivy';

        ADBaseWebSrvV2.postJSON(url, params).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };


    this.fetchRevenueCenterMappings = function() {
        var deferred = $q.defer();
        var url = '/api/hotel_settings/gomomentivy.json';

        ADBaseWebSrvV2.getJSON(url).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };


    this.fetchRoomMappings = function(params) {
        var deferred = $q.defer();
        var url = '/api/hotel_settings/gomomentivy';

        ADBaseWebSrvV2.postJSON(url, params).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };
}]);