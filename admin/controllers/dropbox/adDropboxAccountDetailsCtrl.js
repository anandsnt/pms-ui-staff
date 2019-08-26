admin.controller('ADDropboxAccountDetailsCtrl', [
    '$scope',
    'ADThirdPartyStorageSrv',
    '$state',
    '$stateParams',
    function($scope, ADThirdPartyStorageSrv, $state, $stateParams) {
    
    BaseCtrl.call(this, $scope);

    $scope.goBack = function() {
        $state.go('admin.dropboxAccounts');
    };

    $scope.saveAccountDetails = function() {
        var postData = $scope.accountDetails;
        
        postData.cloud_drive_type = 'DROP_BOX';

        var onSaveAccountSuccess = function() {
            $scope.goBack();
        };

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
