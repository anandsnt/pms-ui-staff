sntRover.controller('rvAvailabilityMainController', [
	'$scope', 'rvAvailabilitySrv',
	function($scope, rvAvailabilitySrv){

		//variable to get/set value availabilty or house
		$scope.availabilityToShow = 'room';
		$scope.page = {};
		$scope.page.title = "Availability";


		/**
		* function to execute when switching between availability and house keeping
		*/
		$scope.setAvailability = function(){
			$scope.$emit("showLoader");
		};

		/**
		* function to load different template based the availability chosen
		*/
		$scope.getTemplateUrl = function()	{
			if($scope.availabilityToShow === 'room'){
				return '/assets/partials/availability/roomAvailabilityMain.html';
			}
			else if($scope.availabilityToShow === 'house'){
				return '/assets/partials/availability/houseAvailabilityStatus.html';
			}
		};

}]);