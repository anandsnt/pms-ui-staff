sntRover.controller('RVWorkManagementMultiSheetCtrl', ['$rootScope', '$scope',
	function($rootScope, $scope) {
		$scope.setHeading("Work Management");

		$rootScope.setPrevState = {
			title: ('Work Management'),
			name: 'rover.workManagement.start'
		}

		$scope.employeeList = [{
			name: "Maid 1",
			ticked: false
		}, {
			name: "Maid 2",
			ticked: false
		}, {
			name: "Maid 3",
			ticked: false
		}, {
			name: "Maid 4",
			maker: "(Apple)",
			ticked: false
		}, {
			name: "Maid 5",
			ticked: false
		},{
			name: "Maid 6",
			ticked: false
		}, {
			name: "Maid 7",
			ticked: false
		}, {
			name: "Maid 8",
			ticked: false
		}, {
			name: "Maid 9",
			maker: "(Apple)",
			ticked: false
		}, {
			name: "Maid 10",
			ticked: false
		}];
	}
]);