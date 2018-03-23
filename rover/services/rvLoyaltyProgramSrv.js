angular.module('sntRover').service('RVLoyaltyProgramSrv', ['$q', 'RVBaseWebSrv', function($q, RVBaseWebSrv) {

    this.addLoyaltyProgram = function(param) {
        var deferred = $q.defer();
        var url = '/staff/user_memberships';

        RVBaseWebSrv.postJSON(url, param).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;

    };

    this.getGMSSettings = function(param) {
        var deferred = $q.defer(),
            url = '/api/integrations/zdirect/settings';
        deferred.resolve({
            "enabled":true,
            "user_name":"zdirect_real.pmsTest",
            "password":"Secret123!",
            "end_point":"https://gm-d1.travelclick.com/gms/app/external/snt",
            "membership_feature":true,
            "hotel_code":"GHLD",
            "customer_name":"na",
            "property_name":"GHLD",
            "send_detailed_revenue":null
        });
        // RVBaseWebSrv.getJSON(url).then(function(data) {
        //     deferred.resolve(data);
        // }, function(data) {
        //     deferred.reject(data);
        // });
        return deferred.promise;

    };

    this.getLoyaltyDetails = function(param) {
        var deferred = $q.defer();
        var url = '/staff/user_memberships/new_loyalty';

        RVBaseWebSrv.getJSON(url, param).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;

    };
    this.getAvailableFFPS = function() {
        var deferred = $q.defer();
        var url = ' /staff/user_memberships/get_available_ffps.json';

        RVBaseWebSrv.getJSON(url, '').then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;

    };
    this.getAvailableHLPS = function() {
        var deferred = $q.defer();
        var url = '/staff/user_memberships/get_available_hlps.json';

        RVBaseWebSrv.getJSON(url, '').then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;

    };
    this.selectLoyalty = function(params) {
        var deferred = $q.defer();
        var url = '/staff/user_memberships/link_to_reservation';

        RVBaseWebSrv.postJSON(url, params).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;

    };


}]);
