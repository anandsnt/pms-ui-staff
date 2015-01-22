sntRover.controller('rvHkServiceStatusDateSelectorCtrl', ['$scope', '$rootScope', 'ngDialog', 'dateFilter',
	function($scope, $rootScope, ngDialog, dateFilter) {

		$scope.setUpData = function() {
			$scope.dateOptions = {
				changeYear: true,
				changeMonth: true,
				yearRange: "-100:+0",
				onSelect: function(dateText, inst) {
					$scope.onViewDateChanged();
					ngDialog.close();
				},
				beforeShowDay: function() {
					return [true, 'newClass', 'Sam Rocks'];
				},
				onChangeMonthYear: function(year, month, instance) {
					console.log({
						year: year,
						month: month,
						instance: instance
					});
				}
			}
		};
		$scope.setUpData();

	}
]);