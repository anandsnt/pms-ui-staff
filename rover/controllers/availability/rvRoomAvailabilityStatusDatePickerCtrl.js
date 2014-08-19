sntRover.controller('rvRoomAvailabilityDatePickerController',['$scope', '$rootScope', 'ngDialog','$filter', function($scope, $rootScope, ngDialog,$filter){


	$scope.setUpCalendar = function(){
	   $scope.dateOptions = {
	     changeYear: true,
	     changeMonth: true,
	     minDate: tzIndependentDate($rootScope.businessDate),
	     yearRange: "-10:+10",
	     
	     onSelect: function(dateText, inst) {
	     	$scope.changedAvailabilityDataParams();
	        ngDialog.close();
	      }

	    }
	};
	$scope.setUpCalendar();

}]);