admin.service('ADToolsSrv',['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2){
   /**
    * To fetch the list of hold status
    * @return {object} hold statuses json
    */
    this.fetch = function(){
        var deferred = $q.defer();
        var url = '/admin/sync_inventories';
        ADBaseWebSrvV2.getJSON(url).then(function(data) {
            deferred.resolve(data);
        },function(data){
            deferred.reject(data);
        });
        return deferred.promise;
    };

    this.saveTools = function(data){
        var deferred = $q.defer();
        var url = '/admin/sync_inventories';
        ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
            deferred.resolve(data);
        },function(data){
            deferred.reject(data);
        });
        return deferred.promise;
    }

}]);