sntRover.controller('SelectDateRangeModalCtrl',['$scope','ngDialog','$filter','dateFilter', function($scope,  ngDialog, $filter, dateFilter){
	
	$scope.setUpData = function(){

		$scope.isFromDateSelected = true;
		$scope.isToDateSelected   = true;

		$scope.fromCalendarID = "RateManagerDateRangeFrom";
		$scope.toCalendarID = "RateManagerDateRangeTo";


				if($scope.currentFilterData.begin_date.length > 0){
					$scope.fromDate = $scope.currentFilterData.begin_date;
				}else{
					$scope.fromDate = dateFilter(new Date(), 'yyyy-MM-dd');
				}

				$scope.fromMinDate = dateFilter(new Date(), 'yyyy-MM-dd');

				currentDate   = new Date();
				currentDate.setDate(1);
				currentDate.setMonth(currentDate.getMonth() +1);
				$scope.toMonthDate = currentDate;
				
				if($scope.currentFilterData.end_date.length > 0){
					$scope.toMonthDateFormated = $scope.currentFilterData.end_date;
				}else{
					$scope.toMonthDateFormated = dateFilter(new Date(), 'yyyy-MM-dd');
				}

				
				$scope.toMonthMinDate = dateFilter(currentDate, 'yyyy-MM-dd');
				$scope.errorMessage='';
			};

			$scope.setUpData();
			$scope.okClicked = function(){
				$scope.currentFilterData.begin_date = $scope.fromDate;
				$scope.currentFilterData.end_date = $scope.toMonthDateFormated;
				$scope.currentFilterData.selected_date_range = dateFilter($scope.currentFilterData.begin_date, 'MM-dd-yyyy') + " to " + dateFilter($scope.currentFilterData.end_date, 'MM-dd-yyyy');
				ngDialog.close();
			};
			$scope.cancelClicked = function(){
				ngDialog.close();
			};

			$scope.$on("dateChangeEvent",function(e, value){
				if(new Date($scope.fromDate) > new Date($scope.toMonthDateFormated)){
					if (value.calendarId === $scope.fromCalendarID){
						$scope.toMonthDateFormated = $scope.fromDate;
					}else{
						$scope.fromDate = $scope.toMonthDateFormated;
					}
				}
			});
		}]);