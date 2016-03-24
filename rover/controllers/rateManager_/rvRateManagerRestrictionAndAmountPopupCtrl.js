angular.module('sntRover')
	.controller('rvRateManagerRestrictionAndAmountPopupCtrl', [
		'$scope',
		'$rootScope',
		'rvRateManagerPopUpConstants',
		'$filter',
		($scope,
		$rootScope,
		rvRateManagerPopUpConstants,
		$filter) => {

		BaseCtrl.call(this, $scope);

		var dialogData;


		/**
		 * initialization stuffs
		 */
		(() => {
			dialogData = $scope.ngDialogData;
			

			//when we click a rate cell on rate view mode
			if(dialogData.mode === rvRateManagerPopUpConstants.RM_SINGLE_RATE_RESTRICTION_MODE) {
				$scope.header = dialogData.rates[0].name;
				
				$scope.headerBottomLeftLabel = $filter('date')(new tzIndependentDate(dialogData.restrictionData[0].date), 
					$rootScope.dateFormat);

				$scope.headerBottomRightLabel = 'All room types';
			}


		})();
}]);