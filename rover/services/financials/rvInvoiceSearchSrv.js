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

        var deferred = $q.defer(),
            url = "/api/bills/invoice_filter_options";

        sntBaseWebSrv.getJSON(url, params).then(function (data) {
            deferred.resolve(data);
        }, function (data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    this.triggerPaymentReceipt = function(params) {
        var deferred = $q.defer(),
            url = "/api/bills/fiskalize_payment";

        sntBaseWebSrv.postJSON(url, params).then(function (data) {
            deferred.resolve(data);
        }, function (data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

}]);