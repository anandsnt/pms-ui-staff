angular.module('sntRover').service('rvCompanyCardContractsSrv', ['$q', 'rvBaseWebSrvV2', function($q, rvBaseWebSrvV2) {

    this.fetchRateContract = function(params) {
        var url = '/api/rates/contract_rates',
            deferred = $q.defer();

        rvBaseWebSrvV2.getJSON(url, params)
            .then(function(data) {
                deferred.resolve(data);
            },
            function(errorMessage) {
                deferred.reject(errorMessage);
            });
        return deferred.promise;
    };

    this.fetchContractsDetails = function(data) {
        var deferred = $q.defer(),
            url = '/api/accounts/' + data.account_id + '/contracts/' + data.contract_id;

        rvBaseWebSrvV2.getJSON(url).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    this.fetchContractsList = function(data) {
        var deferred = $q.defer(),
            url = '/api/accounts/' + data.account_id + '/contracts';

        rvBaseWebSrvV2.getJSON(url).then(function(data) {
            contractRates = data;
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    /**
     * service function used to add new contracts
     * @param {Object} data payLoad
     * @return {promise|{then, catch, finally}|*|e} Promise
     */
    this.addNewContract = function(data) {
        var deferred = $q.defer(),
            url = '/api/accounts/' + data.account_id + '/contracts';

        rvBaseWebSrvV2.postJSON(url, data.postData).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    /**
     * service function used to update the contracts
     * @param {Object} data payLoad
     * @return {promise|{then, catch, finally}|*|e} Promise
     */
    this.updateContract = function(data) {
        var deferred = $q.defer(),
            url = '/api/accounts/' + data.account_id + '/contracts/' + data.contract_id;

        rvBaseWebSrvV2.putJSON(url, data.postData).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

}]);