function checkinDatePickerController($scope, $rootScope,dateFilter,$filter,$location) {
	
	$scope.pageSuccess = true;

	// page navigatons if any of following conditions happpens

	if($rootScope.isCheckedin){
		$scope.pageSuccess = false;
		$location.path('/checkinSuccess');
	}
	else if($rootScope.isCheckedout){
		$scope.pageSuccess = false;
		$location.path('/checkOutNowSuccess');
	}
	else if(!$rootScope.isCheckin){
		$scope.pageSuccess = false;
		$location.path('/');
	}

	if($scope.pageSuccess){
		$scope.date = dateFilter(new Date(), 'yyyy-MM-dd');
		$scope.selectedDate = ($filter('date')($scope.date, 'M/d/yy'));
		
        // format the selected date
        $scope.$watch('date',function(){
        	$scope.selectedDate  = ($filter('date')($scope.date, 'M/d/yy'));        	
        });

		// back button action
		$scope.backBtnClick = function(){
			$location.path('/checkinConfirmation');
		};
		// done button action
		$scope.doneBtnClick = function(){			
			$rootScope.departureDate = $scope.selectedDate;
			$location.path('/checkinConfirmation');
		};
	}
}


