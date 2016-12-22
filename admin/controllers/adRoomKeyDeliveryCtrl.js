admin.controller('ADRoomKeyDeliveryCtrl', ['$state', '$scope', '$rootScope', 'ADRoomKeyDeliverySrv', function($state, $scope, $rootScope, ADRoomKeyDeliverySrv) {

    BaseCtrl.call(this, $scope);


    var fetchSuccess = function(data) {
        $scope.data = data;
        $scope.$emit('hideLoader');
    };

    $scope.invokeApi(ADRoomKeyDeliverySrv.fetch, {}, fetchSuccess);
	/*
    * To handle save button click.
    */
    $scope.save = function() {
        // show success or failure
        var saveSuccess = function() {
            $scope.successMessage = 'Success';
            $scope.$emit('hideLoader');
        };
        var saveFailed = function(response) {
            var message = response ? response : ['Save Failed'];
            
            console.log(response);

            $scope.errorMessage = message;
            $scope.$emit('hideLoader');
        };

        $scope.invokeApi(ADRoomKeyDeliverySrv.update, $scope.data, saveSuccess, saveFailed);
    };
	/*
    * To hide/show settings details as per room_key_delivery_for_rover_check_in.
    */


}]);