admin.controller('ADDropboxAccountDetailsCtrl', [
    '$scope',
    'ADThirdPartyStorageSrv',
    '$state',
    '$stateParams',
    function($scope, ADThirdPartyStorageSrv, $state, $stateParams) {
    
    BaseCtrl.call(this, $scope);

    /**
     * Navigate back to the previous state
     */
    $scope.goBack = function() {
        $state.go('admin.dropboxAccounts');
    };

    /**
     * Save the dropbox account details
     */
    $scope.saveAccountDetails = function() {
        var postData = $scope.accountDetails,
            onSaveAccountSuccess = function() {
                $scope.goBack();
            };
        
        postData.cloud_drive_type = 'DROP_BOX';

        if ($scope.isEdit) {
            $scope.callAPI(ADThirdPartyStorageSrv.updateStorageAccount, {
                params: postData,
                onSuccess: onSaveAccountSuccess
            });               
        } else {
            $scope.callAPI(ADThirdPartyStorageSrv.addStorageAccount, {
                params: postData,
                onSuccess: onSaveAccountSuccess
            });
        }
    };

    // Initializes the controller
    var init = function() {
        $scope.errorMessage = '';
        $scope.isEdit = $stateParams.id;
        $scope.accountDetails = {};

        if ($scope.isEdit) {
            $scope.accountDetails = $stateParams.data;
        } 
        
    };

    init();

}]);
