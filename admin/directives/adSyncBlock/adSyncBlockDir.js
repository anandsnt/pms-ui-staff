admin.directive('adSyncBlock', function() {
        return {
            restrict: 'E',
            scope: {
                syncItemsList: "=",
                interface: "@"
            },
            templateUrl: '/assets/directives/adSyncBlock/adSyncBlockPartial.html',
            controller: 'adSyncBlockCtrl'
        }
    }
);
