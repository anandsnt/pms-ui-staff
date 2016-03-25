angular.module('sntRover')
    .controller('rvRateManagerRestrictionAndAmountPopupCtrl', [
        '$scope',
        '$rootScope',
        'rvRateManagerPopUpConstants',
        'rvUtilSrv',
        '$filter',
        function($scope,
            $rootScope,
            rvRateManagerPopUpConstants,
            util,
            $filter) {

        BaseCtrl.call(this, $scope);

        /**
         * util function to check whether a string is empty
         * we are assigning it as util's isEmpty function since it is using in html
         * @param {String/Object}
         * @return {boolean}
         */
        $scope.isEmpty = util.isEmpty;
        
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
         * to get restriction displaying logic based upon the restriction listing
         * @param  {Object} restriction
         * @param  {array} individualRateRestrictionList
         * @return {Object}
         */
        const getDisplayingParamsForRestricion = (restriction, individualRateRestrictionList, commonRestrictions) => {
            const restrictionFoundInCommon = _.findWhere(commonRestrictions, {restriction_type_id: restriction.id});
            
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
            const dialogData = $scope.ngDialogData,
                restrictionData = dialogData.restrictionData[0];
            return getRestrictionListForRateView(dialogData.restrictionTypes,
                    restrictionData.room_types,
                    restrictionData.rate_restrictions);
        }

        /**
         * to run angular digest loop,
         * will check if it is not running
         */
        const runDigestCycle = () => {
            if (!$scope.$$phase) {
                $scope.$digest();
            }
        };

        /**
         * Function to clear from until Date
         */
        $scope.clearUntilDate = () => {
            $scope.untilDate = '';
            runDigestCycle();
        };

        /**
         * to set the date picker
         */
        const setDatePicker = () => {
            $scope.datePickerOptions = {
                dateFormat: $rootScope.jqDateFormat,
                numberOfMonths: 1,
                minDate: new tzIndependentDate($rootScope.businessDate)
            };

            $scope.untilDate = '';
        };

        /**
         * to initialize the data model
         */
        const initializeDataModels = () => {
            $scope.header = '';
            
            $scope.headerBottomLeftLabel = '';
            
            $scope.headerBottomRightLabel = '';
            
            $scope.headerNoticeOnRight = '';

            $scope.roomTypeAndPrices = [];

            $scope.restrictionList =  [];

            $scope.contentMiddleMode = '';

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
        };

        /**
         * to initialize the variabes on RM_SINGLE_RATE_RESTRICTION_MODE
         */
        const initializeSingleRateRestrictionMode = () => {
            $scope.header = $scope.ngDialogData.rate.name;
            
            $scope.headerBottomLeftLabel = $filter('date')(new tzIndependentDate($scope.ngDialogData.restrictionData[0].date), 
                $rootScope.dateFormat);

            $scope.headerBottomRightLabel = 'All Room types';

            $scope.restrictionList = getRestrictionListForSingleRateViewMode();

            $scope.roomTypeAndPrices = $scope.ngDialogData.roomTypesAndPrices;

            $scope.contentMiddleMode = 'ROOM_TYPE_PRICE_LISTING';
        };

        /**
         * to initialize the multiple rate restriction mode
         */
        const initializeMultipleRateRestrictionMode = () => {
            $scope.headerBottomLeftLabel = 'All Rates';
                    
            $scope.header = $filter('date')(new tzIndependentDate($scope.ngDialogData.restrictionData[0].date), 
                'EEEE, MMMM yy');

            $scope.headerBottomRightLabel = '';

            $scope.restrictionList = getRestrictionListForMultipleRateViewMode();
        };

        /**
         * to initialize Mode based values
         */
        const initializeModeBasedValues = () => {
            switch($scope.ngDialogData.mode) {
                //when we click a restriciton cell on rate view mode
                case rvRateManagerPopUpConstants.RM_SINGLE_RATE_RESTRICTION_MODE:
                    
                    initializeSingleRateRestrictionMode();
                    
                    break;
                
                //when we click a header restriciton cell on rate view mode
                case rvRateManagerPopUpConstants.RM_MULTIPLE_RATE_RESTRICTION_MODE:
                    
                    initializeMultipleRateRestrictionMode();

                    break;
                
                dafault:
                    break;
            }
        };

        /**
         * initialization stuffs
         */
        (() => {
            //variables
            initializeDataModels();

            //mode base setup values
            initializeModeBasedValues();

            //setting the scroller
            setScroller();

            //datepicker
            setDatePicker();
        })();
}]);