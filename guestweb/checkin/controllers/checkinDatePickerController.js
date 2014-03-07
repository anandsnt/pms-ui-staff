function checkinDatePickerController($scope, $rootScope,dateFilter,$filter,$location) {
        


        $scope.date = dateFilter(new Date(), 'yyyy-MM-dd');

        $scope.selectedDate = ($filter('date')($scope.date, 'M/d/yy'));

        $scope.minDate = '2013-12-25';
        $scope.maxDate = '2014-10-06';


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


