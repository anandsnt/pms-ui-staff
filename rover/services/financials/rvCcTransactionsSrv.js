angular.module('sntRover').service('RVccTransactionsSrv', ['$http', '$q', 'BaseWebSrvV2', 'RVBaseWebSrv', '$rootScope', function($http, $q, BaseWebSrvV2, RVBaseWebSrv, $rootScope) {

	var that = this;

 	// get authorization data
    this.fetchAuthData = function() {
        return BaseWebSrvV2.getJSON('/api/cc?type=authorization');
    };

    /*
     * Service function to fetch payments
     * @return {object} payments
     */
    that.fetchPayments = function(params) {
        var url = '/api/cc?date=' + (params.date || $rootScope.businessDate);

        return BaseWebSrvV2.getJSON(url);
    };

    /*
     * Service function to post batch settle
     * @return {object} payments
     */
    that.submitBatch = function () {
        var deferred = $q.defer();
        var url = "/api/cc/batch_settle";

        BaseWebSrvV2.postJSON(url).then(function (data) {
            deferred.resolve(data);
        }, function (data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

}]);
