angular.module('admin').controller('ADTimeoutErrorCtrl', ['$scope', 'ngDialog',
    function($scope, ngDialog) {

        $scope.closeThisDialog = function() {
            ngDialog.close();
        };
    }
]);
