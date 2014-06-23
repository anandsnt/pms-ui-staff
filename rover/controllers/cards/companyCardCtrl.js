sntRover.controller('RVCompanyCardCtrl', ['$scope',
	function($scope) {

		$scope.searchMode = false;
		$scope.currentSelectedTab = 'cc-contact-info';


		$scope.contactInformation = $scope.companyContactInformation;


		$scope.switchTabTo = function($event, tabToSwitch) {
			$event.stopPropagation();
			$event.stopImmediatePropagation();
			$scope.currentSelectedTab = tabToSwitch;
		};
	}
]);