angular.module('sntRover').service('rvDeviceStatusSrv', ['$http', '$q', 'BaseWebSrvV2', function($http, $q, BaseWebSrvV2) {

    that.sendLastReceipt = function(params) {

        var deferred = $q.defer();
        var url = "/api/send_last_receipt";
        url = '/sample_json/zestweb_v2/ext_checkin_verfication.json';

        alert(JSON.stringify(params));

        BaseWebSrvV2.getJSON(url, params).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

}]);