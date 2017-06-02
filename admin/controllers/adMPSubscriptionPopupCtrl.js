admin.controller('adMPSubscriptionPopupCtrl', ['$scope', 'ADUserSrv', 'ngDialog', function($scope, ADUserSrv, ngDialog) {

    // Closing the popup.
    $scope.closePopup = function() {
        $scope.selectedUser = null;
        ngDialog.close();
    };

    // Success callback for subscribe/unsubscribe actions.
    var successCallback = function() {
        $scope.$emit('hideLoader');
    };

    // Failure callback for subscribe/unsubscribe actions.
    var failureCallback = function(errorMessage) {
        $scope.$emit('hideLoader');
        $scope.errorMessage = errorMessage;
    };

    // Clicked unsubscribe button actions..
    $scope.clickedUnsubscribe = function ( hotel ) {
        var params = {
            'user_id': $scope.multiPropertyHotelDetails.user_id,
            'role_id': hotel.selectedHotelRole,
            'hotel_id': hotel.hotel_id,
            'is_subscribe': false
        };

        console.log(params);
        $scope.invokeApi(ADUserSrv.subscribeHotel, params, successCallback, failureCallback );
    };

    // Clicked subscribe button actions..
    $scope.clickedSubscribe = function ( hotel ) {
        var params = {
            'user_id': $scope.multiPropertyHotelDetails.user_id,
            'role_id': hotel.selectedHotelRole,
            'hotel_id': hotel.hotel_id,
            'is_subscribe': true
        };

        console.log(params);
        $scope.invokeApi(ADUserSrv.subscribeHotel, params, successCallback, failureCallback );
    };

    // On role changes..
    $scope.roleChanged = function () {
        var params = {
            'user_id': $scope.multiPropertyHotelDetails.user_id,
            'role_id': hotel.selectedHotelRole,
            'hotel_id': hotel.hotel_id
        };

        console.log(params);
        $scope.invokeApi(ADUserSrv.updateHotelRole, params, successCallback, failureCallback );
    };

}]);
