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
		 * to get restriction displaying logic based upon the restriction listing
		 * @param  {Object} restriction
		 * @param  {array} individualRateRestrictionList
		 * @return {Object}
		 */
		var getDisplayingParamsForRestricion = (restriction, individualRateRestrictionList) => {
			var restrictionFoundInCommon = _.findWhere(dialogData.restrictionData[0].all_rate_restrictions, 
					{restriction_type_id: restriction.id}),
				foundInRestrictionList = false;
			
			if(restrictionFoundInCommon) {
				return {
					status: 'ON',
					value: restrictionFoundInCommon.days
				};
			}
			for(let i = 0; i < individualRateRestrictionList.length; i++ ) {
    			if(_.findWhere(individualRateRestrictionList[i], { restriction_type_id: restriction.id })) {
    				return {
    					status: 'MIXED',
    					value: '??'
    				};
    			}
    		}
    		return {
    			status: 'OFF',
    			value: ''
    		};
		};

		/**
		 * to get the active and class and other configrtion added restriction list
		 * @return {array}
		 */
		var getRestrictionList = () => {
			var individualRateRestrictionList = _.pluck(dialogData.restrictionData[0].rates, 'restrictions');
			return getValidRestrictionTypes(dialogData.restrictionTypes)
				.map(restrictionType => ({
					...restrictionType,
					...(RateManagerRestrictionTypes[restrictionType.value] ? RateManagerRestrictionTypes[restrictionType.value] : {}),
					...getDisplayingParamsForRestricion(restrictionType, individualRateRestrictionList)
				}));
		}

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