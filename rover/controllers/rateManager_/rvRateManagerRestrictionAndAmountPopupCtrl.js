angular.module('sntRover')
    .controller('rvRateManagerRestrictionAndAmountPopupCtrl', [
        '$scope',
        '$rootScope',
        'rvRateManagerPopUpConstants',
        '$filter',
        function($scope,
            $rootScope,
            rvRateManagerPopUpConstants,
            $filter) {

        BaseCtrl.call(this, $scope);
        
        /**
         * to set the scrollers in the ui
         */
        var setScroller = () => {
            $scope.setScroller('scroller-restriction-list');
            $scope.setScroller('room-type-price-listing', {scrollbars: true});
        };

        /**
         * utility methd to refresh all scrollers
         */
        var refreshScroller = () => {
            $scope.refreshScroller('scroller-restriction-list');
            $scope.refreshScroller('room-type-price-listing');
        };

        /**
         * when clicked on week day select all button
         */
        $scope.clickedOnWeekDaySelectAllButton = () => $scope.weekDayRepeatSelection.forEach(weekDay => weekDay.selected = true);
        
        /**
         * when clicked on week day select none button
         */
        $scope.clickedOnWeekDaySelectNoneButton = () => $scope.weekDayRepeatSelection.forEach(weekDay => weekDay.selected = false);

        /**
         * to show select none/select all for week days selection
         * @return {Boolean}
         */
        $scope.showSelectNoneForWeekDaySelection = () =>
            _.where($scope.weekDayRepeatSelection, {selected: true}).length === $scope.weekDayRepeatSelection.length;

        /**
         * to get restriction displaying logic based upon the restriction listing
         * @param  {Object} restriction
         * @param  {array} individualRateRestrictionList
         * @return {Object}
         */
        var getDisplayingParamsForRestricion = (restriction, individualRateRestrictionList, commonRestrictions) => {
            var restrictionFoundInCommon = _.findWhere(commonRestrictions, 
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
                        status: 'VARIED',
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
        var getRestrictionListForMultipleRateViewMode = () => {
            var individualRateRestrictionList = _.pluck($scope.ngDialogData.restrictionData[0].rates, 'restrictions');
            return getValidRestrictionTypes($scope.ngDialogData.restrictionTypes)
                .map(restrictionType => ({
                    ...restrictionType,
                    ...(RateManagerRestrictionTypes[restrictionType.value] ? RateManagerRestrictionTypes[restrictionType.value] : {}),
                    ...getDisplayingParamsForRestricion(restrictionType, individualRateRestrictionList, $scope.ngDialogData.restrictionData[0].all_rate_restrictions)
                }));
        }

        /**
         * to get the active and class and other configrtion added restriction list
         * @return {array}
         */
        var getRestrictionListForSingleRateViewMode = () => {
            var individualRateRestrictionList = _.pluck($scope.ngDialogData.restrictionData[0].room_types, 'restrictions');
            return getValidRestrictionTypes($scope.ngDialogData.restrictionTypes)
                .map(restrictionType => ({
                    ...restrictionType,
                    ...(RateManagerRestrictionTypes[restrictionType.value] ? RateManagerRestrictionTypes[restrictionType.value] : {}),
                    ...getDisplayingParamsForRestricion(restrictionType, individualRateRestrictionList, $scope.ngDialogData.restrictionData[0].rate_restrictions)
                }));
        }

        /**
         * initialization stuffs
         */
        (() => {

            $scope.headerNoticeOnRight = '';

            $scope.roomTypeAndPrices = [];

            $scope.contentMiddleMode = '';

            $scope.weekDayRepeatSelection = [{
                weekDay: 'MON',
                selected: false
            },
            {
                weekDay: 'TUE',
                selected: false
            },
            {
                weekDay: 'WED',
                selected: false
            },
            {
                weekDay: 'THU',
                selected: false
            },
            {
                weekDay: 'FRI',
                selected: false
            },
            {
                weekDay: 'SAT',
                selected: false
            },
            {
                weekDay: 'SUN',
                selected: false
            }];

            switch($scope.ngDialogData.mode) {
                //when we click a restriciton cell on rate view mode
                case rvRateManagerPopUpConstants.RM_SINGLE_RATE_RESTRICTION_MODE:
                    $scope.header = $scope.ngDialogData.rate.name;
                    
                    $scope.headerBottomLeftLabel = $filter('date')(new tzIndependentDate($scope.ngDialogData.restrictionData[0].date), 
                        $rootScope.dateFormat);

                    $scope.headerBottomRightLabel = 'All Room types';

                    $scope.restrictionList = getRestrictionListForSingleRateViewMode();

                    $scope.roomTypeAndPrices = $scope.ngDialogData.roomTypesAndPrices;

                    $scope.contentMiddleMode = 'ROOM_TYPE_PRICE_LISTING';
                    
                    break;
                
                //when we click a header restriciton cell on rate view mode
                case rvRateManagerPopUpConstants.RM_MULTIPLE_RATE_RESTRICTION_MODE:
                    $scope.headerBottomLeftLabel = 'All Rates';
                    
                    $scope.header = $filter('date')(new tzIndependentDate($scope.ngDialogData.restrictionData[0].date), 
                        'EEEE, MMMM yy');

                    $scope.headerBottomRightLabel = '';

                    $scope.restrictionList = getRestrictionListForMultipleRateViewMode();

                    break;
                dafault:
                    break;
            }
            setScroller();
        })();
}]);