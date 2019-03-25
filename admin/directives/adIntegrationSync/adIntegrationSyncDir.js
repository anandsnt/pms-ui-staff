admin.directive('adIntegrationSync', function () {
        return {
            restrict: 'E',
            scope: {
                config: '=',
                interface: '@',
                historicalDateRangeDays: '@',
                excludeToday: '=',
                isExport: '='
            },
            templateUrl: '/assets/directives/adIntegrationSync/adIntegrationSyncPartial.html',
            controller: 'adIntegrationSyncCtrl'
        };
    }
);
