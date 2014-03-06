 function checkinDatePickerController($scope, $rootScope,dateFilter,$filter,$location) {
        


        $scope.date = dateFilter(new Date(), 'yyyy-MM-dd');

        $scope.selectedDate = ($filter('date')($scope.date, 'M/d/yy'));

        $scope.minDate = '2013-12-25';
        $scope.maxDate = '2014-10-06';


        //$rootScope.departureDate  =  ($filter('date')($scope.date, 'M/d/yy'));


		$scope.$watch('date',function(){

		 	 $scope.selectedDate  = ($filter('date')($scope.date, 'M/d/yy'));

			
		});
		$scope.backBtnClick = function(){
			$location.path('/checkinConfirmation');
		};
		$scope.doneBtnClick = function(){
			
			$rootScope.departureDate = $scope.selectedDate;
			$location.path('/checkinConfirmation');
		};
 }


