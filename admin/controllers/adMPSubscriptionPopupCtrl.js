admin.controller('adMPSubscriptionPopupCtrl', ['$scope', 'ADUserSrv', 'ngDialog', function($scope, ADUserSrv, ngDialog) {

    // Closing the popup.
    $scope.closePopup = function() {
        $scope.selectedUser = null;
        ngDialog.close();
    };

    // Failure callback for subscribe/unsubscribe actions.
    var failureCallback = function(errorMessage) {
        $scope.$emit('hideLoader');
        $scope.errorMessage = errorMessage;
    };

    // Clicked unsubscribe button actions..
    $scope.clickedUnsubscribe = function ( hotel ) {
        
        // Success callback for unsubscribe actions.
        var successCallbackUnsubscribe = function() {
            hotel.is_subscribed = false;
            hotel.selected_role_id = '';
            $scope.$emit('hideLoader');
            $scope.errorMessage = '';
        },
        params = {
            'user_id': $scope.subscriptionData.user_id,
            'selected_role_id': hotel.selected_role_id,
            'hotel_id': hotel.hotel_id,
            'is_subscribe': false
        };

        $scope.invokeApi(ADUserSrv.subscribeHotel, params, successCallbackUnsubscribe, failureCallback );
    };

    // Clicked subscribe button actions..
    $scope.clickedSubscribe = function ( hotel ) {

        // Success callback for subscribe actions.
        var successCallbackSubscribe = function() {
            hotel.is_subscribed = true;
            $scope.$emit('hideLoader');
            $scope.errorMessage = '';
        },
        params = {
            'user_id': $scope.subscriptionData.user_id,
            'selected_role_id': hotel.selected_role_id,
            'hotel_id': hotel.hotel_id,
            'is_subscribe': true
        };

        $scope.invokeApi(ADUserSrv.subscribeHotel, params, successCallbackSubscribe, failureCallback );
    };

    // On role changes..
    $scope.roleChanged = function ( hotel ) {

        if ( hotel.is_subscribed ) {
            var params = {
                'user_id': $scope.subscriptionData.user_id,
                'role_id': hotel.selected_role_id,
                'hotel_id': hotel.hotel_id
            },
            // Success callback for unsubscribe actions.
            successCallback = function() {
                $scope.$emit('hideLoader');
                $scope.errorMessage = '';
            };

            $scope.invokeApi(ADUserSrv.updateHotelRole, params, successCallback, failureCallback );
        }
    };

}]);
