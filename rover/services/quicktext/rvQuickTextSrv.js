angular.module('sntRover').service('rvQuickTextSrv', ['$q', 'BaseWebSrvV2', 'rvUtilSrv',
    function ($q, BaseWebSrvV2, rvUtilSrv) {

    this.fetchQuickTextData = function (data) {
        var deferred = $q.defer(),
            url = "/api/interface/quicktext.json";

        deferred.resolve(data);
        BaseWebSrvV2.getJSON(url).then(function (data) {
            deferred.resolve(data);
        }, function (data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };
}]);
