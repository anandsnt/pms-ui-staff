admin.directive('adSyncBlock', function () {
        return {
            restrict: 'E',
            scope: {
                config: '=',
                interface: '@',
                historicalDateRangeDays: '@',
                excludeToday: '=',
                isExport: '=',
                proxy: '@',
            },
            templateUrl: '/assets/directives/adSyncBlock/adSyncBlockPartial.html',
            controller: 'adSyncBlockCtrl'
        };
    }
);
