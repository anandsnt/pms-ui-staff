angular.module('sntPay').controller('payCBAAndMLICtrl', ['$scope', '$controller',
    function($scope, $controller) {

        (function() {
            $controller('payCBACtrl', {
                $scope: $scope
            });
            $controller('payMLIOperationsController', {
                $scope: $scope
            });

        })();

    }
]);