admin.controller('promotionsDatesRangeCtrl', [
	'$scope',
	'$rootScope',
	'ngDialog',
	function ($scope, $rootScope, ngDialog) {
		BaseCtrl.call(this, $scope);

		var promo = $scope.state.promotions[$scope.state.current];

		$scope.datePickerDate = $scope.dateNeeded === 'FROM' ? promo.from_date : promo.to_date;

		$scope.dateOptions = {
			changeYear: true,
			changeMonth: true,
			minDate: tzIndependentDate($rootScope.businessDate),
			onSelect: function () {
				// emit choosen date back
				$scope.$emit('datepicker.update', $scope.datePickerDate);
				if ($scope.dateNeeded === 'FROM') {
					promo.from_date = $scope.datePickerDate;
				} else {
					promo.to_date = $scope.datePickerDate;
				}
				ngDialog.close();
			}
		};

		$scope.cancelClicked = function () {
			ngDialog.close();
		};

		$scope.resetDate = function () {
			// emit choosen date back
			$scope.$emit('datepicker.reset', $scope.datePickerDate);
			ngDialog.close();
		};
	}
]);