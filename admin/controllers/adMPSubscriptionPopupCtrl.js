admin.controller('adMPSubscriptionPopupCtrl', ['$scope', 'ADUserSrv', 'ngDialog', function($scope, ADUserSrv, ngDialog) {

    console.log($scope.selectedUser);
    // Closing the popup.
    $scope.closePopup = function() {
        $scope.selectedUser = null;
        ngDialog.close();
    };
}]);
