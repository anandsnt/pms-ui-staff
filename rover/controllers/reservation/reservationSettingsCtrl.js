sntRover.controller('ReservationSettingsCtrl', ['$scope', function($scope){
    
    $scope.reservationSettingsVisible = false;
    /**
	* scroller options
	*/
	$scope.resizableOptions = 
	{	
		minWidth: '10',
		maxWidth: '260',
		handles: 'e',
		resize: function( event, ui ) {
			
		},
		stop: function(event, ui){
			preventClicking = true;
			$scope.eventTimestamp = event.timeStamp;
		}
	}
}]);
