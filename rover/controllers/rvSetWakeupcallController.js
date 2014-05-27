sntRover.controller('rvSetWakeupcallController',['$scope','RVSaveWakeupTimeSrv', 'ngDialog', function($scope, RVSaveWakeupTimeSrv, ngDialog){
	BaseCtrl.call(this, $scope);
	$scope.todaySelected = true;
	$scope.closeDialog = function(){
		ngDialog.close();
	};

}]);