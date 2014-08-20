sntRover.controller('rvRoomAvailabilityGraphStatusController', [
	'$scope', 
	'rvAvailabilitySrv', 

	function($scope, rvAvailabilitySrv){
		BaseCtrl.call(this, $scope);


  		$scope.hideMeBeforeFetching = false;	

	}
]);