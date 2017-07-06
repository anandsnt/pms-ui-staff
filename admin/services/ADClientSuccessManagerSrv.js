admin.service('ADClientSuccessManagerSrv', [
    '$http',
    '$q',
    'ADBaseWebSrvV2',
    function($http, $q, ADBaseWebSrvV2) {

    /**
    *   Service to return the client success manager list
    */
    this.fetchClientSuccessManagerList = function() {
        var deferred = $q.defer();
        var url = '/admin/client_success_managers';

        ADBaseWebSrvV2.getJSON(url).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };


    /**
    *   Service to add a new client success manager
    *   @param {Object} data holding the client success manager details.
    */
    this.addClientSuccessManager = function(data) {
        var deferred = $q.defer();
        var url = '/admin/client_success_managers';

        ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    /**
    *   Service to update an existing client success manager
    *   @param {Object} data holding the client success manager details.
    */
    this.updateClientSuccessManager = function(data) {
        var deferred = $q.defer();
        var url = '/admin/client_success_managers/' + data.id;

        ADBaseWebSrvV2.putJSON(url, data).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    /**
    *   Service to delete a client success manager
    *   @param id unique identifier of the client success manager
    */
    this.deleteClientSuccessManager = function(id) {
        var deferred = $q.defer();
        var url = '/admin/client_success_managers/' + id;

        ADBaseWebSrvV2.deleteJSON(url).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };


    /**
    *   Service to get the details of a client success manager
    *   @param id unique identifier of the client success manager
    */
    this.fetchClientSuccessManagerDetails = function(id) {
        var deferred = $q.defer();
        var url = '/admin/client_success_managers/' + id;

        ADBaseWebSrvV2.getJSON(url).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };


}]);
