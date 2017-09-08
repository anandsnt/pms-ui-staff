admin.directive('adSyncBlock', function () {
        return {
            restrict: 'E',
            scope: {
                config: '=',
                interface: '@',
                historicalDateRangeDays: '@'
            },
            templateUrl: '/assets/directives/adSyncBlock/adSyncBlockPartial.html',
            controller: 'adSyncBlockCtrl'
        };
    }
);
