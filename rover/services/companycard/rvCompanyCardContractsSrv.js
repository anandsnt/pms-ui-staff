angular.module('sntRover').service('rvCompanyCardContractsSrv', ['$q', 'rvBaseWebSrvV2', function($q, rvBaseWebSrvV2) {

    this.fetchRateContract = function(params) {
        var url = '/api/rates/contract_rates';
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

}]);