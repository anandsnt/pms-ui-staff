sntRover.controller('RVNightlyDiaryDatePickerController',['$scope','$rootScope','ngDialog','dateFilter',function($scope,$rootScope,ngDialog,dateFilter){

	var minDateSelected = '';
	$scope.date = $scope.diaryData.fromDate;

	$scope.setUpData = function(){
		$scope.dateOptions = {
		   changeYear: true,
		   changeMonth: true,
		   minDate: minDateSelected,
		   yearRange: "-100:+5",
		   onSelect: function(dateText, inst) {
				$scope.diaryData.fromDate = $scope.date;
				$scope.$emit('DATE_CHANGED');
				ngDialog.close();
			}
		};
	};

	$scope.setUpData();
}]);