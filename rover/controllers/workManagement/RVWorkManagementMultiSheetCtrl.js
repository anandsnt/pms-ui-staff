sntRover.controller('RVWorkManagementMultiSheetCtrl', ['$rootScope', '$scope', 'ngDialog',
	function($rootScope, $scope, ngDialog) {
		$scope.setHeading("Work Management");

		$rootScope.setPrevState = {
			title: ('Work Management'),
			name: 'rover.workManagement.start',

		}

		$scope.selectEmployee = function(data) {
			$scope.multiSheetState.selectedEmployees = _.where($scope.employeeList, {
				ticked: true
			});
			$scope.multiSheetState.placeHolders = _.range(6 - $scope.multiSheetState.selectedEmployees.length);;

			/**
			 * Need to disable selection of more than 6 employees
			 */
			if ($scope.multiSheetState.selectedEmployees.length > 5) {
				var notTicked = _.where($scope.employeeList, {
					ticked: false
				});
				_.each(notTicked,function(d){
					d.checkboxDisabled = true;
				})
			} else{
				var disabledEntries = _.where($scope.employeeList, {
					checkboxDisabled : true
				});
				_.each(disabledEntries,function(d){
					d.checkboxDisabled = false;
				})
			}

		};

		$scope.multiSheetState = {
			selectedDate: $rootScope.businessDate,
			selectedEmployees: []
		}

		$scope.showCalendar = function(controller) {
			ngDialog.open({
				template: '/assets/partials/workManagement/popups/rvWorkManagementMultiDateFilter.html',
				controller: controller,
				className: 'ngdialog-theme-default single-date-picker',
				closeByDocument: true,
				scope: $scope
			});
		}

		$scope.showFilter = function() {
			ngDialog.open({
				template: '/assets/partials/workManagement/popups/rvWorkManagementFilterRoomsPopup.html',
				className: 'ngdialog-theme-default',
				closeByDocument: true,
				scope: $scope
			});
		}

		$scope.employeeList = [{
			name: "Maid 1",
			ticked: false,
			checkboxDisabled: false
		}, {
			name: "Maid 2",
			ticked: false,
			checkboxDisabled: false
		}, {
			name: "Maid 3",
			ticked: false,
			checkboxDisabled: false
		}, {
			name: "Maid 4",
			ticked: false,
			checkboxDisabled: false
		}, {
			name: "Maid 5",
			ticked: false,
			checkboxDisabled: false
		}, {
			name: "Maid 6",
			ticked: false,
			checkboxDisabled: false
		}, {
			name: "Maid 7",
			ticked: false,
			checkboxDisabled: true
		}, {
			name: "Maid 8",
			ticked: false,
			checkboxDisabled: false
		}, {
			name: "Maid 9",
			ticked: false,
			checkboxDisabled: false
		}, {
			name: "Maid 10",
			ticked: false,
			checkboxDisabled: false
		}];
	}
]);