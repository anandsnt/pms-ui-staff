admin.controller('ADGoogleDriveAccountListCtrl', [
    '$scope', 
    'ngTableParams', 
    'ADThirdPartyStorageSrv',
    '$state',
    'storageConfig',
    function($scope,
         ngTableParams,
         ADThirdPartyStorageSrv,
         $state,
         storageConfig ) {
   
    BaseCtrl.call(this, $scope);
    ADBaseTableCtrl.call(this, $scope, ngTableParams);

    /**
     * Fetches the list of accounts for the given type
     */
    var fetchData = function() {
        var onFetchSuccess = function (data) {
                $scope.googleDriveAccountList = data;
            },
            onFetchFailure = function () {
                $scope.googleDriveAccountList = [];
            };

        $scope.callAPI(ADThirdPartyStorageSrv.fetchStorageAccountListByType, {
            params: {
                cloud_drive_type: 'GOOGLE_DRIVE'
            },
            onSuccess: onFetchSuccess,
            onFailure: onFetchFailure
        });
    };

    /**
     * Deletes the given account
     * @param {Number} accountId - id of the given account
     * @return {void}
     */
    $scope.deleteAccount = function (accountId) {
        var onDeleteAccountSuccess = function () {
                angular.forEach($scope.googleDriveAccountList, function (item, index) {
                    if (item.id === accountId) {
                        $scope.googleDriveAccountList.splice(index, 1);
                    }
                });

                $scope.storageAccountList.reload();
            },
            onDeleteAccountFailure = function (error) {
                $scope.errorMessage = error;
            };

        $scope.callAPI(ADThirdPartyStorageSrv.deleteStorageAccount, {
            params: {
                id: accountId
            },
            onSuccess: onDeleteAccountSuccess,
            onFailure: onDeleteAccountFailure
        });
    };

    /**
     * Navigate to the given account details screen
     * @param {Object} account - holds the account info
     * @return {void}
     */
    $scope.navigateToDetails = function (account) {
        var params = {};

        if (account) {
            params = {
                id: account.id,
                data: account
            };
        }
        $state.go('admin.googledriveAccounts.details', params);
    };

    /**
     * Initialize the controller
     */
    var init = function() {
        $scope.errorMessage = '';
        $scope.googleDriveAccountList = [];

        $scope.storageAccountList = new ngTableParams(
            {
                page: 1, // show first page
                count: $scope.googleDriveAccountList.length,
                sorting: {
                    description: 'asc' // initial sorting
                }
            }, {
                total: 0, // length of data
                getData: fetchData
            }
        );
        $scope.config = storageConfig.data;
        
        // Loads the google api client library
        GAPI.call(this, $scope);

    };

    init();

}]);
