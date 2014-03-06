 function checkinDatePickerController($scope, $rootScope,dateFilter,$filter) {
        $scope.date = dateFilter(new Date(), 'yyyy-MM-dd');




        $scope.minDate = '2013-12-25';
        $scope.maxDate = '2014-10-06';


        $rootScope.departureDate  =  ($filter('date')($scope.date, 'M/d/yy'));


		$scope.$watch('date',function(){

		 	$rootScope.departureDate  = ($filter('date')($scope.date, 'M/d/yy'));

			
		});

 }


