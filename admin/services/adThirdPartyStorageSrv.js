admin.service('ADThirdPartyStorageSrv', [
    '$http',
    '$q',
    'sntBaseWebSrv',
     function(
         $http,
         $q, 
         sntBaseWebSrv) {

   /**
    * Fetch storage account list by type
    * @param {Object} params - request params
    * @return {Promise} Promise
    */
    this.fetchStorageAccountListByType = function(params) {

        var deferred = $q.defer(),
            url = '/api/cloud_drives';

        sntBaseWebSrv.getJSON(url, params).then(function (data) {
            deferred.resolve(data.results);
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };
   /*
    * Save new storage account
    * @param {Object} data - storage account details
    * @return {Promise} Promise
    */
    this.addStorageAccount = function(data) {
        var deferred = $q.defer(),
            url = '/api/cloud_drives';

        sntBaseWebSrv.postJSON(url, data).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    
    /*
     * Update storage account details
     * @param {Object} data of the modified storage account
     * @return {Promise} Promise
     */
    this.updateStorageAccount = function(params) {
        var deferred = $q.defer(),
            url = '/api/cloud_drives/' + params.id;

        sntBaseWebSrv.putJSON(url, params).then(function (data) {
            deferred.resolve(data);
        }, function (data) {
            deferred.reject(data);
        });

        return deferred.promise;
    };

    /*
    * Delete a storage account of the given type
    * @param {Object} params - contains id of the account to be deleted
    * @return {Promise} Promise
    */
    this.deleteStorageAccount = function(params) {
        var deferred = $q.defer(),
            url = '/api/cloud_drives/' + params.id;

        sntBaseWebSrv.deleteJSON(url).then(function (data) {
            deferred.resolve(data);
        }, function (data) {
            deferred.reject(data);
        });

        return deferred.promise;
    };

    
}]);
