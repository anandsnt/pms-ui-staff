admin.service('adWindsurferCRSSetupSrv', ['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2) {

    /**
     * to get the WindsurferCRS configraton values
     * @return {undefined}
     */
    this.fetchWindsurferCRSConfiguration = function() {
        var deferred = $q.defer();
        var url = '/api/ota_config/windsurfer';
        //var url = "ui/show?json_input=WindsurferCRS/settings.json&format=json";

        ADBaseWebSrvV2.getJSON(url).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    /**
     * to save the WindsurferCRS configration values
     * @return {undefined}
     */
    this.saveWindsurferCRSConfiguration = function(params) {
        var deferred = $q.defer();
        var url = '/api/ota_config/windsurfer';

        ADBaseWebSrvV2.putJSON(url, params).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    this.runFullRefresh = function(params) {
        var deferred = $q.defer();
        var url = '/api/ota_config/windsurfer/full_refresh';

        ADBaseWebSrvV2.putJSON(url, params).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    }

}]);