sntRover.controller('RVTravelAgentCardCtrl', ['$scope',
	function($scope) {

		$scope.searchMode = false;
		$scope.currentSelectedTab = 'cc-contact-info';


		


		$scope.switchTabTo = function($event, tabToSwitch) {
			$event.stopPropagation();
			$event.stopImmediatePropagation();
			$scope.currentSelectedTab = tabToSwitch;
		};

		$scope.$on('travelAgentFetchComplete', function(){
			$scope.contactInformation = $scope.travelAgentInformation;
		})
	}
]);