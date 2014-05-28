sntRover.controller('rvSetWakeupcallController',['$scope','RVSaveWakeupTimeSrv', 'ngDialog', function($scope, RVSaveWakeupTimeSrv, ngDialog){
	BaseCtrl.call(this, $scope);
	$scope.tomorrowSelected = true;
	$scope.hrs = "";
	$scope.min = "";
	$scope.am_pm = "AM";
	$scope.closeDialog = function(){
		ngDialog.close();
	};

	$scope.saveWakeupCall = function(){
		var params = {};		
		params.wake_up_time = $scope.getTimeString();
		params.day = ($scope.tomorrowSelected)? "Tomorrow":"Today";
		params.reservation_id = $scope.reservationData.reservation_card.reservation_id;
		$scope.invokeApi(RVSaveWakeupTimeSrv.saveWakeupTime, {} , $scope.closeDialog);
	};

	$scope.getTimeString = function(){
		return $scope.hrs + ":" + $scope.min + " " + $scope.am_pm;
	};

	$scope.deleteWakeupCall = function(){
		var params = {};
		params.reservation_id = $scope.reservationData.reservation_card.reservation_id;
		$scope.invokeApi(RVSaveWakeupTimeSrv.saveWakeupTime, params , $scope.closeDialog);
	};

	$scope.validate = function(){
		if($scope.hrs == "" || $scope.min == "" || $scope.am_pm == "")
			return false;
		else 
			return true;
	};

}]);