sntRover.controller('rvAvailabilityMainController', [
	'$scope', 'rvAvailabilitySrv',
	function($scope, rvAvailabilitySrv){

		//variable to get/set value availabilty or house
		$scope.availabilityToShow = 'room';

		/**
		* function to execute when switching between availability and house keeping
		*/
		$scope.setAvailability = function(){
			$scope.$emit("showLoader");
			if($scope.availabilityToShow == 'room'){
				var emptyDict = {};
				rvAvailabilitySrv.updateData (emptyDict);
				$scope.availabilityToShow = 'house';				
			}
			else if($scope.availabilityToShow == 'house'){
				$scope.availabilityToShow = 'room';
			}
			
		};	

		/**
		*/
		$scope.getTemplateUrl = function()	{
			if($scope.availabilityToShow == 'room'){
				return '/assets/partials/availability/roomAvailabilityMain.html';
			}
			else if($scope.availabilityToShow == 'house'){
				return '/assets/partials/availability/houseAvailabilityStatus.html';
			}
		}

}]);