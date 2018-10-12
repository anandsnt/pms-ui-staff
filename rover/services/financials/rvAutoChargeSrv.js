angular.module('sntRover').service('RVAutoChargeSrv',
    ['$http',
        '$q',
        'rvBaseWebSrvV2',
        function($http, $q, RVBaseWebSrvV2) {

            var that = this;

            that.params = {};
            that.getParams = function() {
                return that.params;
            };

            that.setParams = function(params) {
                that.params = params;
            };
            /*
             * Service function to fetch Accounts Receivables
             * @return {object} payments
             */

            that.fetchAutoCharge = function (params) {

                that.setParams(params)

                var url = '/api/hotels/auto_charge_deposit_report';

                return RVBaseWebSrvV2.getJSON(url, params);

            };

        }]);
