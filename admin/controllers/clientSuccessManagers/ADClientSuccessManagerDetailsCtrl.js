admin.controller('ADClientSuccessManagerDetailsCtrl', [
'$scope',
'ADClientSuccessManagerSrv',
'$stateParams',
'$state',
function($scope, ADClientSuccessManagerSrv,
    $stateParams, $state) {

    BaseCtrl.call(this, $scope);

    // Function to save/update client service manager
    $scope.clickedSave = function() {
            var requestData = $scope.data;

            $scope.errorMessage = [];
            var postSuccess = function() {
                    $scope.$emit('hideLoader');
                    $state.go("admin.clientSuccessManagers");
                },
                postError = function(error) {
                    $scope.errorMessage = error;
                    $scope.$emit('hideLoader');
                };

            if ($scope.isEdit) {
                requestData.id = $scope.id;
                $scope.invokeApi(ADClientSuccessManagerSrv.updateClientSuccessManager, requestData, postSuccess, postError);
            }
            else {
                $scope.invokeApi(ADClientSuccessManagerSrv.addClientSuccessManager, requestData, postSuccess, postError);
            }

    };

    /**
    *   Method to go back to previous state.
    */
    $scope.back = function() {
        $state.go("admin.clientSuccessManagers");
    };

    var init = function() {
        $scope.id = $stateParams.id;
        $scope.errorMessage = '';
        $scope.isEdit = false;
        $scope.title = "Add new Client Success Manager";
        $scope.data = {};

        if (!!$scope.id) {
            $scope.isEdit = true;
            $scope.title = "Edit Client Success Manager";

            var onFetchSuccess = function(data) {
                $scope.$emit('hideLoader');
                $scope.data = data;
            };

            $scope.invokeApi(ADClientSuccessManagerSrv.fetchClientSuccessManagerDetails, $scope.id, onFetchSuccess);
        }
    };

    init();

}]);
