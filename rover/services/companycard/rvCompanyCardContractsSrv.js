angular.module('sntRover').service('rvCompanyCardContractsSrv', ['$q', 'sntBaseWebSrv', function($q, sntBaseWebSrv) {

    this.fetchRateContract = function(params) {
        var url = '/api/rates/contract_rates',
            deferred = $q.defer();

        sntBaseWebSrv.getJSON(url, params)
            .then(function(data) {
                deferred.resolve(data);
            },
            function(errorMessage) {
                deferred.reject(errorMessage);
            });
        return deferred.promise;
    };

    this.deleteContract = function(data) {
        var deferred = $q.defer(),
            url = '/api/accounts/' + data.account_id + '/contracts/' + data.contract_id;

        sntBaseWebSrv.deleteJSON(url).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    this.fetchContractsDetails = function(data) {
        var deferred = $q.defer(),
            url = '/api/accounts/' + data.account_id + '/contracts/' + data.contract_id;

        sntBaseWebSrv.getJSON(url).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    var contractRates = [];

    this.fetchContractsList = function(data) {
        var deferred = $q.defer(),
            url = '/api/accounts/' + data.account_id + '/contracts';

        sntBaseWebSrv.getJSON(url).then(function(data) {
            contractRates = data;
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    this.getContractedRates = function() {
        return contractRates;
    };

    /**
     * service function used to add new contracts
     * @param {Object} data payLoad
     * @return {promise|{then, catch, finally}|*|e} Promise
     */
    this.addNewContract = function(data) {
        var deferred = $q.defer(),
            url = '/api/accounts/' + data.account_id + '/contracts';

        sntBaseWebSrv.postJSON(url, data.postData).then(function(data) {
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

        sntBaseWebSrv.putJSON(url, data.postData).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    this.updateNight = function(data) {
        var deferred = $q.defer(),
            url = '/api/accounts/' + data.account_id + '/contracts/' + data.contract_id + '/contract_nights';

        sntBaseWebSrv.postJSON(url, data.postData).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    this.fetchContractsForLinking = function(params) {
        var url = '/api/contracts/search_contracts',
            deferred = $q.defer();

        sntBaseWebSrv.getJSON(url, params)
            .then(function(data) {
                deferred.resolve(data);
            },
            function(errorMessage) {
                deferred.reject(errorMessage);
            });
        return deferred.promise;
    };

    this.linkContract = function(params) {
        var deferred = $q.defer(),
            url = '/api/contracts/link_contract';

        sntBaseWebSrv.postJSON(url, params).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    this.unLinkContract = function(params) {
        var deferred = $q.defer(),
            url = '/api/contracts/unlink_contract';

        sntBaseWebSrv.postJSON(url, params).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

}]);