sntRover.service('RVCommissionsSrv', ['$http', '$q', 'BaseWebSrvV2', '$window', function($http, $q, BaseWebSrvV2, $window) {

    var that = this;
    /*
     * Service function to fetch Accounts Receivables
     * @return {object} payments
     */

    that.fetchCommissions = function(params) {

        var deferred = $q.defer();
        var url = '/api/accounts/commission_overview';
        // var url = 'ui/show?json_input=commissions/commissons.json&format=json';

        BaseWebSrvV2.getJSON(url, params).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    that.fetchReservationOfCommissions = function(params) {

        var deferred = $q.defer();
        var url = '/api/accounts/' + params.id + '/commissionable_reservations_data';
        // var url = 'ui/show?json_input=commissions/commissons.json&format=json';

        BaseWebSrvV2.getJSON(url, params).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    that.updateCommissionPaidStatus = function(params) {
        var deferred = $q.defer();
        var url = '/api/accounts/update_commission_paid_status';

        BaseWebSrvV2.postJSON(url, params).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    that.exportCommissions = function(params) {

        var deferred = $q.defer();
        var url = '/api/reports/unpaid_commission_export.csv';

        $http({
            method: 'GET',
            url: url,
            data: params
        }).then(function(response) {
            var data = response.data,
                headers = response.headers;

            var hiddenAnchor = angular.element('<a/>'),
                blob = new Blob([data]);

            hiddenAnchor.attr({
                href: $window.URL.createObjectURL(blob),
                target: '_blank',
                download: headers()['content-disposition'].match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)[1].replace(/['"]+/g, '')
            })[0].click();
            deferred.resolve(true);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    this.filterData = {
        'page': 1,
        'perPage': 3,
        'innerPerPage': 2,
        'searchQuery': '',
        'minAmount': '',
        'billStatus': {
            'value': 'UN_PAID',
            'name': 'UN_PAID'
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
