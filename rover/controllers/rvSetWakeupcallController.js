sntRover.controller('rvSetWakeupcallController',['$scope','RVSaveWakeupTimeSrv', 'ngDialog', function($scope, RVSaveWakeupTimeSrv, ngDialog){
	BaseCtrl.call(this, $scope);
	$scope.todaySelected = true;
	$scope.closeDialog = function(){
		ngDialog.close();
	};

	$scope.saveWakeupCall = function(){
		
		$scope.invokeApi(RVSaveWakeupTimeSrv.saveWakeupTime, {} , $scope.closeDialog);
	};

	$scope.deleteWakeupCall = function(){
		$scope.invokeApi(RVSaveWakeupTimeSrv.saveWakeupTime, {} , $scope.closeDialog);
	};

}]);