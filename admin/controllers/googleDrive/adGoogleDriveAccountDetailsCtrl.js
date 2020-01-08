admin.controller('ADGoogleDriveAccountDetailsCtrl', [
    '$scope',
    'ADThirdPartyStorageSrv',
    '$state',
    '$stateParams',
    '$timeout',
    function($scope, ADThirdPartyStorageSrv, $state, $stateParams, $timeout) {
    
    BaseCtrl.call(this, $scope);

    var ERROR_POPUP_CLOSED_BY_USER = 'popup_closed_by_user';
    
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
            }, function(error) {
                if (error.error === ERROR_POPUP_CLOSED_BY_USER) {
                    $scope.errorMessage = ['No account has been selected'];
                }
                $scope.$apply();
            });
        } else {
            GAPI.call(this, $scope);
            $scope.errorMessage = ["Google client failed to load...please try again"];
        }
    };

    // Checks whether the save btn should be disabled or not
    $scope.shouldDisableSave = function () {
        var flag = !$scope.accountDetails.description || !$scope.accountDetails.access_token;

        return flag;
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
