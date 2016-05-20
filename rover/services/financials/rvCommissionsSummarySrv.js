sntRover.service('RVCommissionsSrv',['$http', '$q', 'BaseWebSrvV2', function($http, $q, BaseWebSrvV2){

    var that = this;
    /*
     * Service function to fetch Accounts Receivables
     * @return {object} payments
     */
    that.fetchCommissions = function (params) {

        var deferred = $q.defer();
        var url = "/api/accounts/commission_overview";
        //var url = 'ui/show?json_input=commissions/commissons.json&format=json';

            BaseWebSrvV2.getJSON(url,params).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
        return deferred.promise;
    };

}]);