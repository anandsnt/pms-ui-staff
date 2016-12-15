admin.directive('adSyncBlock', function() {
        return {
            restrict: 'E',
            scope: {
                config: "=",
                interface: "@"
            },
            templateUrl: '/assets/directives/adSyncBlock/adSyncBlockPartial.html',
            controller: 'adSyncBlockCtrl'
        }
    }
);
