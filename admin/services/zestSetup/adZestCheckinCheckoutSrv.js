admin.service('adZestCheckinCheckoutSrv', ['$http', '$q', 'ADBaseWebSrv', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrv, ADBaseWebSrvV2) {
    //Email Check-in
    this.fetchEmailSetup = function(data) {
        var deferred = $q.defer();
        var url = '/admin/zest_email_setups.json';

        ADBaseWebSrvV2.getJSON(url).then(function(data) {
                deferred.resolve(data);
        }, function(data) {
                deferred.reject(data);
        });
        return deferred.promise;
    };

    this.saveEmailSetup = function(data) {
        var deferred = $q.defer();
        var url = '/admin/zest_email_setups';

        ADBaseWebSrvV2.putJSON(url, data).then(function(data) {
                deferred.resolve(data);
        }, function(data) {
                deferred.reject(data);
        });
        return deferred.promise;
    };
    
    //Direct URL
    this.fetchDirectSetup = function(data) {
        var deferred = $q.defer();
        var url = '/admin/zest_direct_url_setups';

        ADBaseWebSrv.getJSON(url).then(function(data) {
                deferred.resolve(data);
        }, function(data) {
                deferred.reject(data);
        });
        return deferred.promise;
    };

    this.saveDirectSetup = function(data) {
        var deferred = $q.defer();
        var url = '/admin/zest_direct_url_setups';

        ADBaseWebSrv.putJSON(url, data).then(function(data) {
                deferred.resolve(data);
        }, function(data) {
                deferred.reject(data);
        });
        return deferred.promise;
    };

    //Direct URL
    this.fetchDirectUrlList= function(data) {
        var deferred = $q.defer();
        var url = '/api/guest_web_urls/';

        ADBaseWebSrv.getJSON(url, data).then(function(data) {
                deferred.resolve(data);
        }, function(data) {
                deferred.reject(data);
        });
        return deferred.promise;
    };

    // save new direct URL
    this.saveNewDirectURL= function(data) {
        var deferred = $q.defer();
        var url = '/api/guest_web_urls';

        ADBaseWebSrv.postJSON(url, data).then(function(data) {
                deferred.resolve(data);
        }, function(data) {
                deferred.reject(data);
        });
        return deferred.promise;
    };
    //edit a direct URL
    this.editDirectURL = function(data) {
        var deferred = $q.defer();
        var url = '/api/guest_web_urls/'+data.id;

        ADBaseWebSrv.putJSON(url, data).then(function(data) {
                deferred.resolve(data);
        }, function(data) {
                deferred.reject(data);
        });
        return deferred.promise;
    };
    //delere a direct URL
    this.deteDirectUrl = function(data) {
        var deferred = $q.defer();
        var url = '/api/guest_web_urls/'+data.id;

        ADBaseWebSrv.deleteJSON(url).then(function(data) {
                deferred.resolve(data);
        }, function(data) {
                deferred.reject(data);
        });
        return deferred.promise;
    };
    // activate/deactivate a direct URL
    this.toggleDirectUrl = function(data) {
        var deferred = $q.defer();
        var url = '/admin/zest_direct_url_setups';

        ADBaseWebSrv.putJSON(url, data).then(function(data) {
                deferred.resolve(data);
        }, function(data) {
                deferred.reject(data);
        });
        return deferred.promise;
    };

}]);