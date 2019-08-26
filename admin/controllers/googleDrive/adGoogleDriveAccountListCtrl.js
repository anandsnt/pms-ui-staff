admin.controller('ADGoogleDriveAccountListCtrl', [
    '$scope', 
    'ngTableParams', 
    'ADThirdPartyStorageSrv',
    '$state',
    function($scope,
         ngTableParams,
         ADThirdPartyStorageSrv,
         $state ) {
   
    BaseCtrl.call(this, $scope);
    ADBaseTableCtrl.call(this, $scope, ngTableParams);

    var fetchData = function() {
        var onFetchSuccess = function (data) {
            $scope.dropboxAccountList = data;
        },
        onFetchFailure = function () {
            $scope.dropboxAccountList = [];
        };

        $scope.callAPI(ADThirdPartyStorageSrv.fetchStorageAccountListByType, {
            params: {
                cloud_drive_type: 'DROP_BOX'
            },
            onSuccess: onFetchSuccess,
            onFailure: onFetchFailure
        });
    };

    $scope.deleteAccount = function (accountId) {
        var onDeleteAccountSuccess = function () {
            angular.forEach($scope.dropboxAccountList, function (item, index) {
                if (item.id === accountId) {
                    $scope.dropboxAccountList.splice(index, 1);
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

    $scope.navigateToDetails = function (account) {
        var params = {};

        if (account) {
            params = {
                id: account.id,
                data: account
            };
        }
        $state.go('admin.googleDriveAccountDetails', params);
    };

    var init = function() {
        $scope.errorMessage = '';
        $scope.dropboxAccountList = {};

        $scope.storageAccountList = new ngTableParams(
            {
                page: 1, // show first page
                count: $scope.dropboxAccountList.length,
                sorting: {
                    name: 'asc' // initial sorting
                }
            }, {
                total: 0, // length of data
                getData: fetchData
            }
        );

        GAPI.call(this, $scope);

    };

    init();

}]);
