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
		 * to set the scrollers in the ui
		 */
		var setScroller = () => {
			$scope.setScroller('scroller-restriction-list');
		};

		/**
		 * to get the active and class and other configrtion added restriction list
		 * @return {array}
		 */
		var getRestrictionList = () =>
			getValidRestrictionTypes(dialogData.restrictionTypes)
				.map(restrictionType => ({
					...restrictionType,
					...(RateManagerRestrictionTypes[restrictionType.value] ? RateManagerRestrictionTypes[restrictionType.value] : {})
				}));


		/**
		 * initialization stuffs
		 */
		(() => {
			dialogData = $scope.ngDialogData;

			$scope.restrictionList = getRestrictionList();

			$scope.headerNoticeOnRight = '';

			//when we click a rate cell on rate view mode
			if(dialogData.mode === rvRateManagerPopUpConstants.RM_SINGLE_RATE_RESTRICTION_MODE) {
				$scope.header = dialogData.rates[0].name;
				
				$scope.headerBottomLeftLabel = $filter('date')(new tzIndependentDate(dialogData.restrictionData[0].date), 
					$rootScope.dateFormat);

				$scope.headerBottomRightLabel = 'All room types';
			}

			setScroller();
		})();
}]);