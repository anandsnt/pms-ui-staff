sntRover.controller('rvAvailabilityButtonController', [
	'$scope',
	'$timeout',
	'$filter',
	'rvAvailabilitySrv',
	function($scope, $timeout, $filter, rvAvailabilitySrv){

		/**
		* Controller class for availability  button in header section,
		* will do only showing/hiding the template only.
		*/

		BaseCtrl.call(this, $scope);

		//variable used to determine whether we need to show availability section or not (we will add/remove section based on this)
		$scope.showAvailability = false;

		//When closing we need to add a class to container div
		$scope.isClosing = false;

		/**
		* function to handle click on availability in the header section.
		* will call the API to fetch data with default values (from business date to 14 days)
		* and will show the availability section if successful
		*/
		$scope.clickedOnAvailabilityButton = function($event){

			/*
				in order to compromise with stjepan's animation class we need write like this
				because we are removing the availability details section when not wanted,
				we need to wait some time to complete the animation and execute the removing section after that
			*/

			if($scope.showAvailability){
				//adding the class for closing animation
				$scope.isClosing = true;
				//after some time we are removing the section and resetiing values to older
				 $timeout(function(){
				 	$scope.isClosing = false;
					//hiding/removing the availability section
					$scope.showAvailability = false;
				 }, 1000);

				// setting data loaded as null, will be using to hide the data showing area on loading in availiable room grid display
				var emptyDict = {};
				rvAvailabilitySrv.updateData (emptyDict);
			}
			else{
				$scope.showAvailability = true;
			}

		};

		/**
		* function to get the template url for availability, it will supply only if
		* 'showAvailability' is true
		*/
		$scope.getAvailabilityTemplateUrl = function(){
			if($scope.showAvailability){
				return '/assets/partials/availability/availability.html';
			}
			return "";
		};
		$scope.$on('CLOSEAVAILIBILTY', function(event) {
		$scope.clickedOnAvailabilityButton(null);
		});
	}
]);