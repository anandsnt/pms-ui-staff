
sntRover.controller('RVroomAssignmentController',['$scope','$state', function($scope, $state){
	console.log("room assignment");
	// $scope.parentObj.slide = 'slide-right';
	$scope.backToStayCard = function(){
		
		$state.go("rover.staycard.reservationcard.reservationdetails");
		
	};
	
	
}]);