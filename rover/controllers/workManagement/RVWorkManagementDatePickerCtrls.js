angular.module('sntRover').controller('RVWorkManagementSearchDatePickerController', ['$scope', '$rootScope', 'ngDialog', 'dateFilter',
	function($scope, $rootScope, ngDialog, dateFilter) {

		$scope.setUpData = function() {
			$scope.dateOptions = {
				changeYear: true,
				changeMonth: true,
				yearRange: "-100:+0",
				minDate: tzIndependentDate($rootScope.businessDate),
				onSelect: function(dateText, inst) {
					$scope.onViewDateChanged();
					ngDialog.close();
				}

			};
		};
		$scope.setUpData();

	}
]);

angular.module('sntRover').controller('RVWorkManagementCreateDatePickerController', ['$scope', '$rootScope', 'ngDialog', 'dateFilter',
	function($scope, $rootScope, ngDialog, dateFilter) {

		$scope.setUpData = function() {
			$scope.dateOptions = {
				changeYear: true,
				changeMonth: true,
				minDate: tzIndependentDate($rootScope.businessDate),
				yearRange: "-100:+0",
				onSelect: function(dateText, inst) {
					ngDialog.close($scope.calendarDialog.id);
				}
			};
		};
		$scope.setUpData();

	}
]);


angular.module('sntRover').controller('RVWorkManagementMultiDatePickerController', ['$scope', '$rootScope', 'ngDialog', 'dateFilter',
	function($scope, $rootScope, ngDialog, dateFilter) {
		$scope.setUpData = function() {
			$scope.dateOptions = {
				changeYear: true,
				changeMonth: true,
				yearRange: "-100:+0",
				onSelect: function(dateText, inst) {
					$scope.onDateChanged();
					ngDialog.close();
				}
			};
		};
		$scope.setUpData();
	}
]);