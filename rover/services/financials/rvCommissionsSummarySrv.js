sntRover.service('RVCommissionsSrv', ['$http', '$q', 'BaseWebSrvV2', function($http, $q, BaseWebSrvV2) {

    var that = this;
    /*
     * Service function to fetch Accounts Receivables
     * @return {object} payments
     */

    that.fetchCommissions = function (params) {

        var deferred = $q.defer();
        var url = "/api/accounts/commission_overview";
        // var url = 'ui/show?json_input=commissions/commissons.json&format=json';

            BaseWebSrvV2.getJSON(url, params).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
        return deferred.promise;
    };

    this.filterData = {
        'page': 1,
        'perPage': 50,
        'searchQuery': '',
        'minAmount': '',
        'billStatus': {
            'value': 'ALL',
            'name': 'ALL'
        },
        'sort_by': {
            'value': 'NAME_ASC',
            'name': 'NAME_ASC'
        },
        'filterTab': 'PAYABLE',
        'billStatusOptions': [{
            'value': 'OPEN',
            'name': 'OPEN'
        }, {
            'value': 'PAID',
            'name': 'PAID'
        }, {
            'value': 'ALL',
            'name': 'ALL'
        }],
        'sortOptions': [{
            'value': 'NAME_ASC',
            'name': 'NAME ASC'
        }, {
            'value': 'NAME_DSC',
            'name': 'NAME DESC'
        }, {
            'value': 'AMOUNT_ASC',
            'name': 'AMOUNT ASC'
        }, {
            'value': 'AMOUNT_DSC',
            'name': 'AMOUNT DESC'
        }]
    };

}]);