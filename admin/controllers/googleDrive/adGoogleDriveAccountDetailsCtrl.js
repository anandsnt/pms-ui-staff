admin.controller('ADGoogleDriveAccountDetailsCtrl', [
    '$scope',
    'ADThirdPartyStorageSrv',
    '$state',
    '$stateParams',
    '$timeout',
    function($scope, ADThirdPartyStorageSrv, $state, $stateParams, $timeout) {
    
    BaseCtrl.call(this, $scope);

    /**
     * Navigate back to the previous state
     */
    $scope.goBack = function() {
        $state.go('admin.googledriveAccounts', {
            updated: true
        });
    };

    /**
     * Save account details
     */
    $scope.saveAccountDetails = function() {
        var postData = $scope.accountDetails,
            onSaveAccountSuccess = function() {
                $scope.goBack();
            };
        
        postData.cloud_drive_type = 'GOOGLE_DRIVE';

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

    /**
     * Start the authorization process
     */
    var startAuth = function () {
        if ($scope.GoogleAuth) {
            $scope.GoogleAuth.grantOfflineAccess()
            .then(function(res) {
                if (res.code) {
                    $scope.accountDetails.access_token = res.code;
                    $timeout(function () {
                        $scope.$apply();
                    }, 700);
                }
            });
        } else {
            GAPI.call(this, $scope);
            $scope.errorMessage = ["Google client failed to load...please try again"];
        }
    };

    /**
     * Initialize the controller
     */
    var init = function() {
        $scope.errorMessage = '';
        $scope.isEdit = $stateParams.id;
        $scope.accountDetails = {};

        if ($scope.isEdit) {
            $scope.accountDetails = $stateParams.data;
        } 

        startAuth();
        
    };

    init();

}]);
