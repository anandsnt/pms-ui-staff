angular.module('login').service('selectPropertySrv', ['$http', '$q', 'BaseWebSrvV2', function($http, $q, BaseWebSrvV2) {
    /*
     *   Service to search charge code
     *   @param object of data
     */
    this.searchChargeCode = function(params) {
        var deferred = $q.defer();
        var url = "/api/users/service_provider_hotels?query=" + params.query;
        
        BaseWebSrvV2.getJSON(url).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    /*
     * Set property(hotel)
     * @param object of data
     */
    this.setProperty = function(params) {

        var deferred = $q.defer();
        var url = '/admin/hotel_admin/update_current_hotel';
        BaseWebSrvV2.postJSON(url, params).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

}]);
