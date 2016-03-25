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
        const setScroller = () => {
            $scope.setScroller('scroller-restriction-list');
            $scope.setScroller('room-type-price-listing');
        };

        /**
         * utility methd to refresh all scrollers
         */
        const refreshScroller = () => {
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
        const getDisplayingParamsForRestricion = (restriction, individualRateRestrictionList, commonRestrictions) => {
            const restrictionFoundInCommon = _.findWhere(commonRestrictions, 
                    {restriction_type_id: restriction.id}),
                foundInRestrictionList = false;
            
            if(restrictionFoundInCommon) {
                return {
                    status: 'ON',
                    value: restrictionFoundInCommon.days
                };
            }
            for(let i = 0; i < individualRateRestrictionList.length; i++ ) {
                let correspondingRestriction = _.findWhere(individualRateRestrictionList[i], { restriction_type_id: restriction.id });
                if(correspondingRestriction) {
                    return {
                        status: 'VARIED',
                        value: RateManagerRestrictionTypes[restriction.value].hasInputField ? '??' : ''
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
        const getRestrictionListForMultipleRateViewMode = () => {
            const dialogData = $scope.ngDialogData,
                restrictionData = dialogData.restrictionData[0];
            return getRestrictionListForRateView(dialogData.restrictionTypes,
                    restrictionData.rates,
                    restrictionData.all_rate_restrictions);
        }

        /**
         * to get the active and class and other configrtion added restriction list
         * @return {array}
         */
        const getRestrictionListForRateView = (restrictionTypes, restrictionSource, commonRestricitonSource) => {
            const individualRateRestrictionList = _.pluck(restrictionSource, 'restrictions');
            return getValidRestrictionTypes(restrictionTypes)
                .map(restrictionType => ({
                    ...restrictionType,
                    ...RateManagerRestrictionTypes[restrictionType.value],
                    ...getDisplayingParamsForRestricion(restrictionType, individualRateRestrictionList, commonRestricitonSource)
                }));
        };

        /**
         * to get the active and class and other configrtion added restriction list
         * @return {array}
         */
        const getRestrictionListForSingleRateViewMode = () => {
            var dialogData = $scope.ngDialogData,
                restrictionData = dialogData.restrictionData[0];
            return getRestrictionListForRateView(dialogData.restrictionTypes,
                    restrictionData.room_types,
                    restrictionData.rate_restrictions);
        }

        const setDatePicker = () => {
            
        };
        
        /**
         * initialization stuffs
         */
        (() => {

            $scope.headerNoticeOnRight = '';

            $scope.roomTypeAndPrices = [];

            $scope.contentMiddleMode = '';

            $scope.untilDate = '';

            $scope.weekDayRepeatSelection = [{
                weekDay: 'mon',
                selected: false
            },
            {
                weekDay: 'tue',
                selected: false
            },
            {
                weekDay: 'wed',
                selected: false
            },
            {
                weekDay: 'thu',
                selected: false
            },
            {
                weekDay: 'fri',
                selected: false
            },
            {
                weekDay: 'sat',
                selected: false
            },
            {
                weekDay: 'sun',
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