sntRover.controller('rvSetWakeupcallController',['$scope','RVSaveWakeupTimeSrv', 'ngDialog', function($scope, RVSaveWakeupTimeSrv, ngDialog){
	BaseCtrl.call(this, $scope);
	
	$scope.closeDialog = function(){
		ngDialog.close();
	};

	$scope.getHours = function(){
			return (typeof $scope.wakeupData.wake_up_time != 'undefined')?$scope.wakeupData.wake_up_time.substr(0,2):"";
	}
	$scope.getMins = function(){
			return (typeof $scope.wakeupData.wake_up_time != 'undefined')?$scope.wakeupData.wake_up_time.substr(3,2):"";
	}
	$scope.getAM_PM = function(){
			return (typeof $scope.wakeupData.wake_up_time != 'undefined')?$scope.wakeupData.wake_up_time.substr(6,2):"AM";
	}

	$scope.tomorrowSelected = $scope.wakeupData.day == "TOMORROW";
	$scope.hrs = $scope.getHours();
	$scope.min = $scope.getMins();
	$scope.am_pm = $scope.getAM_PM();
	$scope.successCallbackForAPI = function(){
			$scope.$emit('hideLoader');
			$scope.closeDialog();
		};

	$scope.saveWakeupCall = function(){
		var params = {};		
		params.wake_up_time = $scope.getTimeString();
		params.day = ($scope.tomorrowSelected)? "Tomorrow":"Today";
		params.reservation_id = $scope.reservationData.reservation_card.reservation_id;

		var successCallbackSetWakeupcall = function(){
			$scope.$emit('hideLoader');
			$scope.closeDialog();
		};

		$scope.invokeApi(RVSaveWakeupTimeSrv.saveWakeupTime, params , $scope.successCallbackForAPI);
	};


	$scope.getTimeString = function(){
		return $scope.hrs + ":" + $scope.min + " " + $scope.am_pm;
	};

	$scope.deleteWakeupCall = function(){
		var params = {};
		params.reservation_id = $scope.reservationData.reservation_card.reservation_id;
		$scope.invokeApi(RVSaveWakeupTimeSrv.saveWakeupTime, params , $scope.successCallbackForAPI);
	};

	$scope.validate = function(){
		if($scope.hrs == "" || $scope.min == "" || $scope.am_pm == "")
			return false;
		else 
			return true;
	};
	$scope.isDeletable = function(){
		return !$scope.validate && typeof $scope.wakeupData.wake_up_time == 'undefined')
	};

}]);