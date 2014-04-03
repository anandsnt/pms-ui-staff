admin.controller('ADRoomKeyDeliveryCtrl',['$state', '$scope', 'ADRoomKeyDeliverySrv', function($state, $scope, ADRoomKeyDeliverySrv){
	
	BaseCtrl.call(this, $scope);
	
	var fetchSuccess = function(data){
		$scope.data = data;
		$scope.$emit('hideLoader');
	};
	
	$scope.invokeApi(ADRoomKeyDeliverySrv.fetch, {}, fetchSuccess);
	/*
    * To handle save button click.
    */
	$scope.save = function(){
		var unwantedKeys = ["selected_key_system","key_systems"];
		var data = dclone($scope.data, unwantedKeys);
		data.key_system_id = $scope.data.selected_key_system;
		$scope.invokeApi(ADRoomKeyDeliverySrv.update, data);
	};
	
}]);