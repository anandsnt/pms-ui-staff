admin.service('adZestCheckinCheckoutSrv',['$http', '$q', 'ADBaseWebSrv', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrv, ADBaseWebSrvV2){
    //Email Check-in
    this.fetchEmailSetup = function(data){
        var deferred = $q.defer();
        var url = '/admin/zest_email_setups.json';
        ADBaseWebSrvV2.getJSON(url).then(function(data) {
                deferred.resolve(data);
        },function(data){
                deferred.reject(data);
        });
        return deferred.promise;
    };

    this.saveEmailSetup = function(data){
        var deferred = $q.defer();
        var url = '/admin/zest_email_setups';

        ADBaseWebSrvV2.putJSON(url,data).then(function(data) {
                deferred.resolve(data);
        },function(data){
                deferred.reject(data);
        });
        return deferred.promise;
    };
    
    //Direct URL
    this.fetchDirectSetup = function(data){
        var deferred = $q.defer();
        var url = '/admin/zest_direct_url_setups';
        ADBaseWebSrv.getJSON(url).then(function(data) {
                deferred.resolve(data);
        },function(data){
                deferred.reject(data);
        });
        return deferred.promise;
    };

    this.saveDirectSetup = function(data){
        var deferred = $q.defer();
        var url = '/admin/zest_direct_url_setups';

        ADBaseWebSrv.putJSON(url,data).then(function(data) {
                deferred.resolve(data);
        },function(data){
                deferred.reject(data);
        });
        return deferred.promise;
    };

}]);