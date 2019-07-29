angular.module('sntRover').service('RVInvoiceSearchSrv', 
    ['$http', 
    '$q', 
    'sntBaseWebSrv',
    function($http, $q, sntBaseWebSrv) {

    var that = this;
    /*
     * Service function to fetch Accounts Receivables
     * @return {object} payments
     */

    that.searchForInvoice = function (params) {

        var deferred = $q.defer();
        var url = "/api/bills/search_invoice";

        sntBaseWebSrv.getJSON(url, params).then(function (data) {
            deferred.resolve(data);
        }, function (data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    /*
     * Service function to fetch Accounts Receivables
     * @return {object} payments
     */

    that.getFilterOptions = function (params) {

        var deferred = $q.defer();
        var url = "/api/bills/invoice_filter_options";

        sntBaseWebSrv.getJSON(url, params).then(function (data) {
            deferred.resolve(data);
        }, function (data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

}]);