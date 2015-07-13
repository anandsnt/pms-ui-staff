sntRover.controller('rvSetWakeupcallController',['$scope','$filter','RVSaveWakeupTimeSrv', 'ngDialog', function($scope, $filter, RVSaveWakeupTimeSrv, ngDialog){
	BaseCtrl.call(this, $scope);

	$scope.hourValues = ["01", "02", "03", "04", "05", "06","07", "08", "09", "10", "11", "12"];
	$scope.minValues = ["00", "15", "30", "45"];

	$scope.getHours = function(){
			return (typeof $scope.wakeupData.wake_up_time != 'undefined')?$scope.wakeupData.wake_up_time.substr(0,2):"";
	};
	$scope.getMins = function(){
			return (typeof $scope.wakeupData.wake_up_time != 'undefined')?$scope.wakeupData.wake_up_time.substr(3,2):"";
	};
	$scope.getAM_PM = function(){
			return (typeof $scope.wakeupData.wake_up_time != 'undefined')?$scope.wakeupData.wake_up_time.substr(6,2):"AM";
	};

	$scope.$watch(
        function() { return $scope.wakeupData.day == "TOMORROW"|| typeof $scope.wakeupData.day == 'undefined' ; },
        function(flag) { $scope.todaySelected  = !flag; }
    );

	$scope.hrs = $scope.getHours();
	$scope.min = $scope.getMins();
	$scope.am_pm = $scope.getAM_PM();
	$scope.dimissLoaderAndDialog = function(){
			$scope.$emit('hideLoader');
			$scope.closeDialog();
		};

	$scope.saveWakeupCall = function(){
		var params = {};
		params.wake_up_time = $scope.getTimeString();
		params.day = ($scope.todaySelected)? "Today":"Tomorrow";
		params.reservation_id = $scope.reservationData.reservation_card.reservation_id;

		var successCallbackSetWakeupcall = function(){
			// $scope.$parent.wake_up_time = $scope.getTimeString();
			$scope.wakeupData.wake_up_time = $scope.getTimeString();
			$scope.wakeupData.day = ($scope.todaySelected)? "TODAY":"TOMORROW";
			$scope.$emit("updateWakeUpTime",$scope.wakeupData);
			$scope.dimissLoaderAndDialog();
		};

		var errorCallbackSetWakeupcall = function(errorMessage){
			$scope.$emit('hideLoader');
			$scope.errorMessage = errorMessage;
		};

		$scope.invokeApi(RVSaveWakeupTimeSrv.saveWakeupTime, params , successCallbackSetWakeupcall, errorCallbackSetWakeupcall);
	};

	$scope.getTimeString = function(){
		return $scope.hrs + ":" + $scope.min + " " + $scope.am_pm;
	};

	$scope.deleteWakeupCall = function(){
		var params = {};
		params.reservation_id = $scope.reservationData.reservation_card.reservation_id;
		var successCallbackDeleteWakeupcall = function(){
			delete $scope.wakeupData.wake_up_time;
			delete $scope.wakeupData.day;
			$scope.$emit("updateWakeUpTime",$scope.wakeupData);
			$scope.dimissLoaderAndDialog();
		};
		var errorCallbackDeleteWakeupcall = function(errorMessage){
			$scope.$emit('hideLoader');
			$scope.errorMessage = errorMessage;
		};
		$scope.invokeApi(RVSaveWakeupTimeSrv.saveWakeupTime, params , successCallbackDeleteWakeupcall, errorCallbackDeleteWakeupcall);

	};

	$scope.validate = function(){
		if($scope.hrs == "" || $scope.min == "" || $scope.am_pm == "")
			return false;
		else
			return true;
	};
	$scope.isDeletable = function(){
		return typeof $scope.wakeupData.wake_up_time == 'undefined';
	};


}]);