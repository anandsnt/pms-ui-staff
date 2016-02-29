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
            $scope.title = "Edit Hotel";
            var fetchSuccess = function(data){
                $scope.data = data.data;
                $scope.languages = data.languages;
                $scope.$emit('hideLoader');
                if($scope.data.mli_pem_certificate_loaded){
                    $scope.mli_pem_certificate_file_name = "Certificate Attached";
                }
                if($scope.data.check_in_time.primetime === "" || typeof $scope.data.check_in_time.primetime === 'undefined'){
                    $scope.data.check_in_time.primetime = "AM";
                    $scope.data.check_in_primetime ="AM";
                }
                if($scope.data.check_out_time.primetime === "" || typeof $scope.data.check_out_time.primetime === 'undefined'){
                    $scope.data.check_out_time.primetime = "AM";
                    $scope.data.check_out_primetime = "AM";
                }
                if($scope.data.merchantlink_txn_certificate_loaded) {
                    $scope.mli_transaction_certificate_file_name = "Certificate Attached";
                }
            };
            $scope.invokeApi(ADHotelDetailsSrv.fetchEditData, {'id':$stateParams.id}, fetchSuccess);
        }

    }


    /**
    *   A post method for Add New and UPDATE Existing hotel details.
    */
    $scope.clickedSave = function(){
        // SNT Admin - To save Add/Edit data
        if($scope.isAdminSnt){
            var data = dclone($scope.data, unwantedKeys);


            var postSuccess = function(){
                $scope.$emit('hideLoader');
                $state.go("admin.hotels");
            };

            if($scope.isEdit) {
                $scope.invokeApi(ADServiceProviderSrv.updateServiceProvider, $scope.data, postSuccess);
            }
            else {
                $scope.invokeApi(ADServiceProviderSrv.addServiceProvider, $scope.data, postSuccess);
            }
        }
    };




    /**
    *   Method to go back to previous state.
    */
    $scope.back = function(){

        if($scope.isAdminSnt) {

            if($scope.previousStateIsDashBoard) {
                $state.go("admin.dashboard",{"menu":0});
            }
            else{
                $state.go("admin.hotels");
            }

        }
        else {
            if($rootScope.previousStateParam){
                $state.go($rootScope.previousState, { menu:$rootScope.previousStateParam});
            }
            else if($rootScope.previousState){
                $state.go($rootScope.previousState);
            }
            else
            {
                $state.go('admin.dashboard', {menu : 0});
            }
        }
    };

}]);