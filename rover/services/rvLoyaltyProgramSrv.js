angular.module('sntRover').service('RVLoyaltyProgramSrv', ['$q', 'RVBaseWebSrv', 'BaseWebSrvV2', function($q, RVBaseWebSrv, BaseWebSrvV2) {

    this.addLoyaltyProgram = function(param) {
        var deferred = $q.defer(),
            url = '/staff/user_memberships';

        BaseWebSrvV2.postJSON(url, param).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;

    };

    this.getGMSSettings = function() {
        var deferred = $q.defer(),
            url = '/api/integrations/zdirect/settings';

        BaseWebSrvV2.getJSON(url).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;

    };

    this.getLoyaltyDetails = function(param) {
        var deferred = $q.defer(),
            url = '/staff/user_memberships/new_loyalty';

        RVBaseWebSrv.getJSON(url, param).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;

    };
    this.getAvailableFFPS = function() {
        var deferred = $q.defer(),
            url = ' /staff/user_memberships/get_available_ffps.json';

        RVBaseWebSrv.getJSON(url, '').then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;

    };
    this.getAvailableHLPS = function() {
        var deferred = $q.defer(),
            url = '/staff/user_memberships/get_available_hlps.json';

        RVBaseWebSrv.getJSON(url, '').then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;

    };
    this.selectLoyalty = function(params) {
        var deferred = $q.defer(),
            url = '/staff/user_memberships/link_to_reservation';

        RVBaseWebSrv.postJSON(url, params).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };
}]);