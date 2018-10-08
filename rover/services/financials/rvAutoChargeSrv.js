angular.module('sntRover').service('RVAutoChargeSrv',
    ['$http',
        '$q',
        'BaseWebSrvV2',
        function($http, $q, BaseWebSrvV2) {

            var that = this;
            /*
             * Service function to fetch Accounts Receivables
             * @return {object} payments
             */

            that.fetchAutoCharge = function (params) {

                var deferred = $q.defer();
                var url = '/api/hotels/auto_charge_deposit_report';

                BaseWebSrvV2.getJSON(url, params).then(function (data) {
                    deferred.resolve(data);
                }, function (data) {
                    deferred.reject(data);
                });
                return deferred.promise;
            };

        }]);
