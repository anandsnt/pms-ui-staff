angular.module('sntRover').service('rvAuthorizationSrv', ['$q', 'rvBaseWebSrvV2', '$log',
    function($q, rvBaseWebSrvV2, $log) {

        var service = this,
            uuid = null;

        service.status = function(log) {
            $log.info(log || 'available');
        };

        service.setProperty = function(currentUuid) {
            uuid = currentUuid;
        };

        service.getProperty = function() {
            return uuid;
        };
    }
]);