angular.module('sntZestStation').service('zsStateHelperSrv',
    function () {
        var service = this,
            previousStateParams = null;

        service.setPreviousStateParams = function (stateParams) {
            previousStateParams = angular.copy(stateParams);
        };

        service.getPreviousStateParams = function () {
            return previousStateParams;
        };

    }
);
