sntRover.controller('RVQuickTextController',
    ['$scope',
    '$rootScope',
    'quicktextdata',
    '$sce',
    function ($scope, $rootScope, quicktextdata, $sce) {
        BaseCtrl.call(this, $scope);
        // -------------------------------------------------------------------------------------------------------------- B. Local Methods
        var init = function() {
            $scope.iframe_endpoint = $sce.trustAsResourceUrl(quicktextdata.iframe_endpoint);
        };
        // -------------------------------------------------------------------------------------------------------------- B. Scope Variables
        init();
    }
]);
