admin.controller('ADServiceProviderDetailsCtrl', [
                            '$rootScope',
                            '$scope',
                            'ADServiceProviderSrv',
                            '$stateParams',
                            '$state',
                            'ngDialog',
                            function($rootScope, $scope, ADServiceProviderSrv, $stateParams, $state, ngDialog){

    $scope.isAdminSnt = false;
    $scope.isEdit = false;
    $scope.id = $stateParams.id;
    $scope.errorMessage = '';
    BaseCtrl.call(this, $scope);

    if($rootScope.adminRole === "snt-admin"){
        $scope.isAdminSnt = true;
        if($stateParams.action ==="addfromSetup"){
            $scope.previousStateIsDashBoard = true;
        }
        // SNT Admin -To add new hotel view
        if($stateParams.action === "add" || $stateParams.action ==="addfromSetup"){
            $scope.title = "Add New Service Provider";

            var fetchSuccess = function(data){
                $scope.data = data;
                $scope.$emit('hideLoader');
            };

            $scope.invokeApi(ADServiceProviderSrv.fetchServiceProviderAddData, {}, fetchSuccess);
        }
        // SNT Admin -To edit existing hotel view
        else if($stateParams.action === "edit"){
            $scope.isEdit = true;
            $scope.title = "Edit Service Provider";
            var fetchSuccess = function(data){
                $scope.data = data;
                $scope.$emit('hideLoader');
            };
            $scope.invokeApi(ADServiceProviderSrv.getServiceProviderDetails, {'id':$stateParams.id}, fetchSuccess);
        }

    }

    /**
    *   A post method for Add New and UPDATE Existing hotel details.
    */
    $scope.clickedSave = function(){

        if($scope.isAdminSnt){
            var requestData = $scope.data;
            var postSuccess = function(){
                $scope.$emit('hideLoader');
                $state.go("admin.serviceProviders");
            };

            if($scope.isEdit) {
                requestData.id = $scope.id;
                $scope.invokeApi(ADServiceProviderSrv.updateServiceProvider, $scope.data, postSuccess);
            }
            else {
                $scope.invokeApi(ADServiceProviderSrv.addServiceProvider, requestData, postSuccess);
            }
        }
    };
    /**
    *   Method to go back to previous state.
    */
    $scope.back = function(){
        if($scope.isAdminSnt) {
            $state.go("admin.serviceProviders");
        }
    };

}]);