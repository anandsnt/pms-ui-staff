sntRover.controller('SelectDateRangeModalCtrl',['$scope','ngDialog','$filter','dateFilter','$rootScope', function($scope,  ngDialog, $filter, dateFilter,$rootScope){

	$scope.setUpData = function(){

		//Workaround - By default the system date will be highlighted, 
		//if we don't specify a default date. But we don't want to highlight any date 
		//So removing the highligting in jQuery way
		/*window.setTimeout(function(){
           $('#modal').find('.ui-state-highlight.ui-state-active')
           .removeClass('ui-state-highlight ui-state-active');     
       	},0); 
		*/
		if($scope.currentFilterData.begin_date){
			$scope.fromDate = $scope.currentFilterData.begin_date;
		}
		if($scope.currentFilterData.end_date){
			$scope.toDate = $scope.currentFilterData.end_date
		}

		$scope.fromDateOptions = {
			firstDay: 1,
			changeYear: true,
			changeMonth: true,
			minDate: tzIndependentDate($rootScope.businessDate),
			yearRange: "-5:+5", //Show 5 years in past & 5 years in future
			onSelect: function() {
				if(tzIndependentDate($scope.fromDate) > tzIndependentDate($scope.toDate)){
					$scope.toDate = $scope.fromDate;
				}
			}
		};

		$scope.toDateOptions = {
			firstDay: 1,
			changeYear: true,
			changeMonth: true,
			minDate: tzIndependentDate($rootScope.businessDate),
			yearRange: "-5:+5",
			onSelect: function() {

				if(tzIndependentDate($scope.fromDate) > tzIndependentDate($scope.toDate)){
					$scope.fromDate = $scope.toDate;
				}
			}
		};

		$scope.errorMessage='';
	};

	$scope.setUpData();
	$scope.updateClicked = function(){
		$scope.currentFilterData.begin_date = $scope.fromDate;
		$scope.currentFilterData.end_date = $scope.toDate;
		$scope.currentFilterData.selected_date_range = dateFilter($scope.currentFilterData.begin_date, 'MM-dd-yyyy') + " to " + dateFilter($scope.currentFilterData.end_date, 'MM-dd-yyyy');
		ngDialog.close();
	};
	$scope.cancelClicked = function(){
		ngDialog.close();
	};

}]);