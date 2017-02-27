angular.module('sntRover').service('rvAuthorizationSrv', ['$q', 'rvBaseWebSrvV2', '$log',
    function($q, rvBaseWebSrvV2, $log) {

        var service = this;

        service.status = function() {
            $log.info('available');
        };
    }
]);