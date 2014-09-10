sntRover.controller('RVWorkManagementCtrl', ['$rootScope', '$scope', 'ngDialog', '$state',
    function($rootScope, $scope, ngDialog, $state) {        

        $scope.setHeading = function(headingText) {
            $scope.heading = headingText;
        }

        $scope.setHeading("Work Management");
    }
]);