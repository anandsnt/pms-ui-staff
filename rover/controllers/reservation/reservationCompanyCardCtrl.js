sntRover.controller('ReservationCompanyCardCtrl', ['$scope', function($scope){
    
    $scope.guestCardVisible = false;
    /**
	* scroller options
	*/
	$scope.resizableOptions = 
	{	
		minHeight: '90',
		maxHeight: screen.height -200,
		handles: 's',
		resize: function( event, ui ) {
			if ($(this).height() > 120 && !$scope.guestCardVisible) { //against angular js principle, sorry :(				
				$scope.guestCardVisible = true;
				$scope.$apply();
			}
			else if($(this).height() <= 120 && $scope.guestCardVisible){
				$scope.guestCardVisible = false;
				$scope.$apply();
			}
		},
		stop: function(event, ui){
			preventClicking = true;
			$scope.eventTimestamp = event.timeStamp;
		}
	}
}]);
