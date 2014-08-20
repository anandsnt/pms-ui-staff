sntRover.controller('rvRoomAvailabilityGraphStatusController', [
	'$scope', 
	'rvAvailabilitySrv', 

	function($scope, rvAvailabilitySrv){
		BaseCtrl.call(this, $scope);


  		$scope.hideMeBeforeFetching = true;	

  		$scope.availabilityGraphCongif = {
			chart: 	{
						type: 'area'
					},
			 xAxis: { 
			 			categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                					'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                	}

  		};


	}
]);