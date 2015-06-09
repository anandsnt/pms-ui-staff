admin.controller('ADDoorLockInterfaceCtrl',['$scope', '$rootScope','ADDoorlockInterfaceSrv', function($scope, $rootScope,ADDoorlockInterfaceSrv){

	BaseCtrl.call(this, $scope);

	var init = function(){
		fetchInterfaceDetails();

	};

	var fetchInterfaceDetails = function(){
		var fetchSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.data = data;
			console.log(data);
		};
		$scope.invokeApi(ADDoorlockInterfaceSrv.fetch, {},fetchSuccessCallback);
	};



	init();

}]);