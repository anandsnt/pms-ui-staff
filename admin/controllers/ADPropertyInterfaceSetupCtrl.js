admin.controller('ADPropertyInterfaceSetupCtrl', ['$scope', '$controller', 'ADHotelPropertyInterfaceSrv', '$state', '$filter', '$stateParams',
    function ($scope, $controller, ADHotelPropertyInterfaceSrv, $state, $filter, $stateParams) {

        $scope.errorMessage = '';
        $scope.successMessage = '';
        $scope.isLoading = true;
        $scope.interfaceList = [{
                id: 1,
                name: 'Telephone Interface',
                is_active: true,
                can_delete: true
        }];
    
        $scope.totalCount = 0;

        BaseCtrl.call(this, $scope);

        $scope.fetchListSuccessCallback = function (data) {
            $scope.isLoading = false;
            $scope.$emit('hideLoader');
            
            $scope.interfaceList = data.data;
            console.log('interfaceList: ',interfaceList);
            $scope.totalCount = $scope.interfaceList.length;
        };

        $scope.fetchList = function () {
            $scope.invokeApi(ADHotelPropertyInterfaceSrv.fetchList, {}, $scope.fetchListSuccessCallback);
        };

        $scope.activateInactivate = function(id, currentStatus, index){
		var nextStatus = (currentStatus == "true" ? "false" : "true");
		var data = {
			"set_active": nextStatus,
			"id": id
		};
		var successCallbackActivateInactivate = function(data){
			$scope.interfaceList[index].is_active = (currentStatus == "true" ? "false" : "true");
			$scope.$emit('hideLoader');
		};
		$scope.invokeApi(ADHotelPropertyInterfaceSrv.activateInactivate, data , successCallbackActivateInactivate);
	};

        $scope.fetchList();

    }]);