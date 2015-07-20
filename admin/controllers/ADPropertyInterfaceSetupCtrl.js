admin.controller('ADPropertyInterfaceSetupCtrl', ['$scope', '$controller', 'ADHotelPropertyInterfaceSrv', '$state', '$filter', '$stateParams',
    function ($scope, $controller, ADHotelPropertyInterfaceSrv, $state, $filter, $stateParams) {

        $scope.errorMessage = '';
        $scope.successMessage = '';
        $scope.isLoading = true;
        $scope.interfaceList = [];

        $scope.totalCount = 0;

        BaseCtrl.call(this, $scope);

        $scope.fetchListSuccessCallback = function (data) {
            $scope.isLoading = false;
            $scope.$emit('hideLoader');

            $scope.interfaceList = data.data;
            $scope.totalCount = $scope.interfaceList.length;

        };

        $scope.fetchList = function () {
            $scope.invokeApi(ADHotelPropertyInterfaceSrv.fetchList, {}, $scope.fetchListSuccessCallback);
        };

        $scope.activateInactivate = function(name, currentStatus, index){
		var nextStatus = (currentStatus === true ? false : true);
		var data = {
			"set_active": nextStatus,
			"id": name
		};
		var successCallbackActivateInactivate = function(data){
			$scope.interfaceList[index].active = nextStatus;
			$scope.$emit('hideLoader');
		};
                if (nextStatus){
                    $scope.invokeApi(ADHotelPropertyInterfaceSrv.activate, data , successCallbackActivateInactivate);
                } else {
                    $scope.invokeApi(ADHotelPropertyInterfaceSrv.deActivate, data , successCallbackActivateInactivate);
                }
	};

        $scope.fetchList();

    }]);