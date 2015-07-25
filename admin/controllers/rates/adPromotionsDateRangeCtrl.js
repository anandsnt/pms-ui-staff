admin.controller('promotionsDatesRangeCtrl', [
	'$scope', '$rootScope', 'ngDialog', '$filter',
	function($scope, $rootScope, ngDialog, $filter) {
		BaseCtrl.call(this, $scope);

		var promo = $scope.state.current === 'NEW' ? $scope.state.newPromo : $scope.state.promotions[$scope.state.current],
			TZIDate = tzIndependentDate;

		$scope.datePickerDate = $scope.dateNeeded === 'FROM' ? promo.from_date : promo.to_date;

		$scope.dateOptions = {
			changeYear: true,
			changeMonth: true,
			minDate: tzIndependentDate($rootScope.businessDate),
			onSelect: function() {
				$scope.$emit('datepicker.update', $scope.datePickerDate);
				if ($scope.dateNeeded === 'FROM') {
					promo.from_date = $scope.datePickerDate;
					if (new TZIDate(promo.from_date) > new TZIDate(promo.to_date)) { //Just ensure that the date range is correct FROM <= TO
						promo.to_date = promo.from_date;
					}
				} else {
					promo.to_date = $scope.datePickerDate;
					if (new TZIDate(promo.to_date) < new TZIDate(promo.from_date)) { //Just ensure that the date range is correct FROM <= TO
						promo.from_date = promo.to_date;
					}
				}
				$scope.filterRates(promo);
				$scope.state.from_date_display = $filter('date')(promo.from_date, $rootScope.dateFormat);
				$scope.state.to_date_display = $filter('date')(promo.to_date, $rootScope.dateFormat);
				ngDialog.close();
			}
		};

		$scope.cancelClicked = function() {
			ngDialog.close();
		};

		$scope.resetDate = function() {
			// emit choosen date back
			$scope.$emit('datepicker.reset', $scope.datePickerDate);
			ngDialog.close();
		};
	}
]);