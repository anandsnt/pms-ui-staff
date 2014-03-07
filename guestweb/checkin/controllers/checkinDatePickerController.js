function checkinDatePickerController($scope, $rootScope,dateFilter,$filter,$location) {
        


        $scope.date = dateFilter(new Date(), 'yyyy-MM-dd');

        $scope.selectedDate = ($filter('date')($scope.date, 'M/d/yy'));


    // disable previous dates if needed.
    
       // $scope.minDate = $scope.date;
       


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


