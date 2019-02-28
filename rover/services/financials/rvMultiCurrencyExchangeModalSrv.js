angular.module('sntRover').service('RVMultiCurrencyExchangeSrv', ['$http', '$q', 'BaseWebSrvV2', function($http, $q, BaseWebSrvV2) {

    var that = this;
    /*
     * Service function to fetch Accounts Receivables
     * @return {object} payments
     */

    that.fetchExchangeRates = function (params) {

        var deferred = $q.defer();
        var url = "/api/exchange_rates/current_exchange_rates";

        BaseWebSrvV2.getJSON(url, params).then(function (data) {
            var data1 = [{ 'date': '2019-01-09',
                'conversion_rate': 12.33 },{ 'date': '2019-01-10',
                'conversion_rate': 12.33 },{ 'date': '2019-01-11',
                'conversion_rate': 12.33 }, { 'date': '2019-01-12',
                'conversion_rate': 12.33 }, { 'date': '2019-01-15',
                'conversion_rate': 12.33 }, { 'date': '2019-01-16',
                'conversion_rate': 13.33 }];
            deferred.resolve(data1);
        }, function (data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    that.saveExchangeRates = function (params) {

        var deferred = $q.defer();
        var url = "/api/exchange_rates/save_exchange_rates";

        BaseWebSrvV2.postJSON(url, params).then(function (data) {
            deferred.resolve(data);
        }, function (data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

}]);
