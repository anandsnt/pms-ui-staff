admin.controller('ADGuestIDSetup', ['$scope', '$state', 'ADGuestIDSetupSrv', function($scope, $state, ADGuestIDSetupSrv) {

    /*
    * controller class for guest review setup
    */

    BaseCtrl.call(this, $scope);
    $scope.errorMessage = '';

    /*
    * success call back of details web service call
    */
    var fetchCompletedOfIDTypes = function(data) {
        $scope.$emit('hideLoader');
        $scope.data.id_types = data.id_types;
        if (!data.id_types) {
            $scope.data.id_types = [];// passport ID type
        }
    };
    
    var fetchCompletedOfSettingsDetails = function(data) {
        $scope.data = data.guest_id_scan;

        $scope.invokeApi(ADGuestIDSetupSrv.fetchGuestIDTypeDetails, {}, fetchCompletedOfIDTypes);
    };

    // fetching the settings details
    $scope.invokeApi(ADGuestIDSetupSrv.fetchGuestIDSetupDetails, {}, fetchCompletedOfSettingsDetails);

    /*
    * success call back of details web service call
    */
    var successCallbackOfSaveDetails = function() {
        $scope.$emit('hideLoader');
        $scope.errorMessage = '';

        var postingDataIDTypes = {
            'id_types': [{
                'id': 1,
                'is_double_sided': $scope.data.id_types[0] ? $scope.data.id_types[0].is_double_sided : false
            }]
        };

        $scope.invokeApi(ADGuestIDSetupSrv.saveGuestIDTypes, postingDataIDTypes, $scope.goBackToPreviousState);
    };

    $scope.save = function() {
        var postingData = {
            'guest_id_scan': {
                'scan_guest_id_active': $scope.data.scan_guest_id_active
            }
        };

        postingData.guest_id_scan.scan_guest_id_active = $scope.data.scan_guest_id_active;

        // calling the save api
        $scope.invokeApi(ADGuestIDSetupSrv.saveGuestIDSetup, postingData, successCallbackOfSaveDetails);

    };

}]);