angular.module('sntRover').service('RVInvoiceSearchSrv', 
    ['$http', 
    '$q', 
    'BaseWebSrvV2', 
    function($http, $q, BaseWebSrvV2) {

    var that = this;
    /*
     * Service function to fetch Accounts Receivables
     * @return {object} payments
     */

    that.searchForInvoice = function (params) {

        var deferred = $q.defer();
        var url = "/api/bills/search_invoice";

        BaseWebSrvV2.getJSON(url, params).then(function (data) {
            deferred.resolve(data);
        }, function (data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

}]);