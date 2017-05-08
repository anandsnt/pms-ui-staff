admin.service('ADFTPServersSrv', ['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2) {


    this.ftpServerData  = {};
    var that = this;

   /**
    * To fetch the list of ftp servers
    * @return {object}
    */
    this.fetchFtpServers = function() {

        var deferred = $q.defer(),
        url = '/api/ftp_servers';

        ADBaseWebSrvV2.getJSON(url).then(function(data) {
            that.ftpServerData = data.results;
            deferred.resolve(that.ftpServerData);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };
   /*
    * To save new ftp address
    * @param {array} new ftp details
    *
    */
    this.saveFtpServer = function(data) {
        var deferred = $q.defer();
        var url = '/api/ftp_servers';

        ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    /*
     * To get the details of the selected ftp server
     * @param {array} selected server id
     * @return {object}
     */
    this.getServerDetails = function(param) {
        var deferred = $q.defer();

        var url = '/api/ftp_servers/' + param.id;

        ADBaseWebSrvV2.getJSON(url).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    /*
     * To update FTP data
     * @param {array} data of the modified FTP
     * @return {object}
     */
    this.updateFtpServer = function(param) {

        var deferred = $q.defer();
        var url = '/api/ftp_servers/' + param.id;

        ADBaseWebSrvV2.putJSON(url, param).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    /*
    *   A delete method to delete the ftp server
    */
    this.deleteFTPServer = function(param) {
        var deferred = $q.defer();
        var url = '/api/ftp_servers/' + param.id;

        ADBaseWebSrvV2.deleteJSON(url).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    /*
    * To test connectivity
    * @param {array} data of the connectivity
    * @return {object} status of the api
    */
    this.testConnectivity = function(data) {
        var deferred = $q.defer();
        var url = '/api/ftp_servers/test_connectivity';

        ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };
}]);
