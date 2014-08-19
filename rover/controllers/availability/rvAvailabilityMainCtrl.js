sntRover.controller('rvAvailabilityMainController', [
	'$scope', 
	function($scope){

		//variable to get/set value availabilty or house
		$scope.availabilityToShow = 'room';

		/**
		* function to execute when switching between availability and house keeping
		*/
		$scope.setAvailability = function(){
			$scope.$emit("showLoader");
			if($scope.availabilityToShow == 'room'){
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