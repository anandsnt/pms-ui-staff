admin.service('ADServiceProviderSrv',['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2){

    /**
    *   Service to return the service provider list
    */
    this.fetchServiceProviderList = function(){
        var deferred = $q.defer();
        var url = '/admin/service_providers';

        ADBaseWebSrvV2.getJSON(url).then(function(data) {
            deferred.resolve(data);
        },function(data){
            deferred.reject(data);
        });
        return deferred.promise;
    };

    /**
    *   Service to add a new service provider
    *   @param {Object} data holding the service provider details.
    */
    this.addServiceProvider = function(data){
        var deferred = $q.defer();
        var url = '/admin/service_providers';

        ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
            deferred.resolve(data);
        },function(data){
            deferred.reject(data);
        });
        return deferred.promise;
    };

    /**
    *   Service to update a new service provider
    *   @param {Object} data holding the service provider details.
    */
    this.updateServiceProvider = function(data){
        var deferred = $q.defer();
        var url = '/admin/service_providers/' + data.id;

        ADBaseWebSrvV2.putJSON(url, data).then(function(data) {
            deferred.resolve(data);
        },function(data){
            deferred.reject(data);
        });
        return deferred.promise;
    };

    /**
    *   Service to get service provider details
    *   @param id unique identifier of the service provider
    */
    this.getServiceProviderDetails = function(id){
        var deferred = $q.defer();
        var url = '/admin/service_providers/' + id;

        ADBaseWebSrvV2.getJSON(url).then(function(data) {
            deferred.resolve(data);
        },function(data){
            deferred.reject(data);
        });
        return deferred.promise;
    };

    /**
    *   Service to delete a service provider detail
    *   @param id unique identifier of the service provider
    */
    this.deleteServiceProvider = function(id){
        var deferred = $q.defer();
        var url = '/admin/service_providers/' + id;

        ADBaseWebSrvV2.deleteJSON(url).then(function(data) {
            deferred.resolve(data);
        },function(data){
            deferred.reject(data);
        });
        return deferred.promise;
    };


}]);