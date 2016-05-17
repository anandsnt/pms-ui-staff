angular.module('sntRover')
    .controller('rvRateManagerRestrictionAndAmountPopupCtrl', [
        '$scope',
        '$rootScope',
        'rvRateManagerPopUpConstants',
        'rvUtilSrv',
        '$filter',
        'rvRateManagerCoreSrv',
        'rvRateManagerEventConstants',
        function($scope,
            $rootScope,
            rvRateManagerPopUpConstants,
            util,
            $filter,
            rvRateManagerCoreSrv,
            rvRateManagerEventConstants) {

        BaseCtrl.call(this, $scope);

        /**
         * IF YOU ARE HERE to DEBUG and NEW to here, start from initialization function in the bottom
         */
        
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
        * utility method for converting date object into api formated 'string' format
        * @param  {Object} date
        * @return {String}
        */
        const formatDate = (date, format) => $filter('date')(new tzIndependentDate(date), format);        
        
        /**
        * utility method for converting date object into api formated 'string' format
        * @param  {Object} date
        * @return {String}
        */
        const formatDateForAPI = (date) => formatDate(date, $rootScope.dateFormatForAPI);

        /**
        * utility method for converting date object into a top header formated 'string'
        * @param  {Object} date
        * @return {String}
        */
        const formatDateForTopHeader = (date) => formatDate(date, 'EEEE, dd MMMM yy');

        /**
         * list of price key used in tmeplates & controller
         * @type {Array}
         */
        const priceKeys = ['single', 'double', 'extra_adult', 'child'];

        /**
         * list of price overriding keys used in tmeplates & controller
         * @type {Array}
         */
        const priceOverridingKeys = ['child_overridden', 'double_overridden', 'extra_adult_overridden', 'single_overridden'];

        /**
         * week days, we use this to create default selection value
         * @type {Array}
         */
        const weekDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

        /**
         * to set the scrollers in the ui
         */
        const setScroller = () => {
            var scrollerOptions = {
                tap: true,
                preventDefault: false,
                deceleration: 0.0001,
                shrinkScrollbars: 'clip'
            };

            $scope.setScroller('scroller-restriction-list', scrollerOptions);
            $scope.setScroller('room-type-price-listing', scrollerOptions);
            $scope.setScroller('room-type-price-editing', scrollerOptions);
        };

        /**
         * utility methd to refresh all scrollers
         */
        const refreshScroller = () => {
            $scope.refreshScroller('scroller-restriction-list');
            $scope.refreshScroller('room-type-price-listing');
            $scope.refreshScroller('room-type-price-editing');
        };

        /**
         * to unselect the selected restriction
         */
        const deSelectAllRestriction = () => $scope.restrictionList.forEach(restriction => restriction.selected = false);
        
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
         * when the  restriciton update api call is success
         * @param  {Object} result
         */
        const onUpdateRateRestrictionData = (result) => {
            var dataFromPopupToParent = {
                dialogData: $scope.ngDialogData,
                isFromPopup: true
            }
            $scope.$emit(rvRateManagerEventConstants.RELOAD_RESULTS, dataFromPopupToParent);
            $scope.closeDialog();
        };

        /**
         * function to decide whether to show the applied price restriction checkbox
         * @return {Boolean}
         */
        $scope.shouldShowApplyPriceCheckbox = () => 
            [
                $scope.modeConstants.RM_SINGLE_RATE_SINGLE_ROOMTYPE_RESTRICTION_AMOUNT_MODE,
                $scope.modeConstants.RM_SINGLE_RATE_MULTIPLE_ROOMTYPE_RESTRICTION_AMOUNT_MODE
            ]
            .indexOf($scope.ngDialogData.mode) > -1 && 
            [   
                'SINGLE_RATE_SINGLE_ROOM_TYPE_NIGHTLY_AMOUNT_EDIT',
                'SINGLE_RATE_MULTIPLE_ROOM_TYPE_NIGHTLY_AMOUNT_EDIT',
                'SINGLE_RATE_SINGLE_ROOM_TYPE_HOURLY_AMOUNT_EDIT',
                'SINGLE_RATE_MULTIPLE_ROOM_TYPE_HOURLY_AMOUNT_EDIT'
            ]
            .indexOf($scope.contentMiddleMode) > -1 ;
        
        /**
         * to decide whether we need to show clear override button
         * @return {Boolean}
         */
        $scope.shouldShowClearOverrideButton = () => {
            var isThereAnyPriceOverride = false,
                isInIntendedMode = false;

            // CICO-27469
            // Needn't show clear overrides button for child rates
            if (!!$scope.ngDialogData.rate && !!$scope.ngDialogData.rate.based_on_rate_id){
                return false;
            }

            isInIntendedMode = [ $scope.modeConstants.RM_SINGLE_RATE_SINGLE_ROOMTYPE_RESTRICTION_AMOUNT_MODE ]
                .indexOf($scope.ngDialogData.mode) > -1;

            priceOverridingKeys.map(key => {
                if(_.has($scope.priceDetails, key) && $scope.priceDetails[key]) {
                    isThereAnyPriceOverride = true;
                }
            });

            return isInIntendedMode && isThereAnyPriceOverride;
        };

        /**
         * to goto default middle pane
         */
        const gotoDefaultMiddlePaneMode = () => {
            switch($scope.ngDialogData.mode) {
                case $scope.modeConstants.RM_SINGLE_RATE_RESTRICTION_MODE:
                    $scope.contentMiddleMode = 'ROOM_TYPE_PRICE_LISTING';
                    break;
                
                case $scope.modeConstants.RM_SINGLE_ROOMTYPE_RESTRICTION_MODE:
                    $scope.contentMiddleMode = 'SINGLE_ROOM_TYPE_CHOOSE_RATE';
                    break;

                case $scope.modeConstants.RM_MULTIPLE_RATE_RESTRICTION_MODE:
                    $scope.contentMiddleMode = 'MULTIPLE_RATE_CHOOSE_RATE';
                    break;

                case $scope.modeConstants.RM_MULTIPLE_ROOMTYPE_RESTRICTION_MODE:
                    $scope.contentMiddleMode = 'MULTIPLE_ROOM_TYPE_CHOOSE_RATE';
                    break;
                
                case $scope.modeConstants.RM_SINGLE_RATE_SINGLE_ROOMTYPE_RESTRICTION_AMOUNT_MODE:
                    initializeSingleRateRestrictionAndAmountMiddlePane();
                    break;

                case $scope.modeConstants.RM_SINGLE_RATE_MULTIPLE_ROOMTYPE_RESTRICTION_AMOUNT_MODE:
                    initializeSingleRateMultipleRoomTypeRestrictionAndAmountMiddlePane();
                    break;

                dafault:
                    break;
            }
        };

        /**
         * [description]
         * @param  {[type]} key [description]
         * @return {[type]}     [description]
         */
        $scope.priceStartedToCustomize = (key) => {
            switch($scope.ngDialogData.mode) {
                case $scope.modeConstants.RM_SINGLE_RATE_SINGLE_ROOMTYPE_RESTRICTION_AMOUNT_MODE:
                    if(util.isNumeric($scope.priceDetails[key + '_changing_value'])) {
                        $scope.priceDetails[key] = $scope.priceDetailsCopy[key];
                    }
                    else {
                        $scope.priceDetails[key + '_changing_value'] = '';
                    }
                    break;
            }
            refreshScroller();
        };

        /**
         * [description]
         * @param  {[type]} clickedAgainstKey [description]
         * @return {[type]}                   [description]
         */
        $scope.clickedOnApplyToAllOccupancies = (clickedAgainstKey) => {
            _.without(priceKeys, clickedAgainstKey).map(key => {
                $scope.priceDetails[key + '_changing_value'] = $scope.priceDetails[clickedAgainstKey + '_changing_value'];
                $scope.priceDetails[key + '_amount_operator'] = $scope.priceDetails[clickedAgainstKey + '_amount_operator'];
                $scope.priceDetails[key + '_amount_perc_cur_symbol'] = $scope.priceDetails[clickedAgainstKey + '_amount_perc_cur_symbol'];
            });
            //height will change with showing apply to all restrictin button showing
            refreshScroller();
        };

        /**
         * [description]
         * @return {[type]} [description]
         */
        $scope.clickedOnCancelRestrictionEditingButton = () => {
            deSelectAllRestriction();
            gotoDefaultMiddlePaneMode();
        };

        /**
         * on tapping the set button from restriction edit pane
         */
        $scope.clickedOnRestrictionSetButton = (event) => {
            event.stopPropagation();
            var restriction = _.findWhere($scope.restrictionList, {id: $scope.restrictionForShowingTheDetails.id});
            
            if($scope.restrictionForShowingTheDetails.hasInputField && 
                !util.isNumeric($scope.restrictionForShowingTheDetails.value)) {
                $scope.errorMessage = ['Please enter a number'];
                return;
            }

            restriction.value = $scope.restrictionForShowingTheDetails.value;
            restriction.edited = true;
            restriction.status = 'ON';
            deSelectAllRestriction();
            gotoDefaultMiddlePaneMode();
        };

        /**
         * on tapping the remove button from restriction edit pane
         */
        $scope.clickedOnRestrictionRemoveButton = () => {
            var restriction = _.findWhere($scope.restrictionList, {id: $scope.restrictionForShowingTheDetails.id});
            restriction.value = null;
            restriction.edited = true;
            restriction.status = 'OFF';
            deSelectAllRestriction();
            gotoDefaultMiddlePaneMode();
        };

        /**
         * the successcall back of clea ovveriding api
         * @param  {Object} response
         */
        const onSuccessOfClickedOnClearOverrideButtonAPICall = (response) => {
            $scope.$emit(rvRateManagerEventConstants.RELOAD_RESULTS);
            $scope.closeDialog();  
        };

        /**
         * when clciked on remove overriding icon
         */
        $scope.clickedOnClearOverrideButton = () => {
            var dialogData = $scope.ngDialogData;

            var params = {
                rate_id: dialogData.rate.id,
                room_type_id: dialogData.roomType.id,
                date: formatDateForAPI(dialogData.date)
            }
            var options = {
                params,
                onSuccess: onSuccessOfClickedOnClearOverrideButtonAPICall
            }
            $scope.callAPI(rvRateManagerCoreSrv.removeCustomRate, options);
        };

        /**
         * [description]
         * @return {[type]} [description]
         */
        const getEditedRestrictionsForAPI = () => {
            var editedRestrictions = _.where($scope.restrictionList, {edited:true});
            return editedRestrictions.map(restriction => ({
                action: restriction.status === 'ON' ? 'add' : 'remove',
                restriction_type_id: restriction.id,
                days: restriction.value
            }))
        };


        /**
         * utility method to form api param as it is same acroos apis's
         * modifiy the params's details
         * @param  {Object} params
         */
        const formRestrictionParamDetailForWeekDaysForAPI = (params) => {
            var dialogData = $scope.ngDialogData,
                editedRestrictions = getEditedRestrictionsForAPI();
            
            if(!editedRestrictions.length) {
                return false;
            }

            if($scope.applyRestrictionsToDates) {
                if($scope.untilDate === '') {
                    //$scope.errorMessage = ['Please choose until date'];
                    return;
                }
                params.details.push({
                    from_date: formatDateForAPI(util.addOneDay(tzIndependentDate(dialogData.date))),
                    to_date: formatDateForAPI($scope.untilDate),
                    restrictions: editedRestrictions
                });
                let index = params.details.length - 1;
                params.details[index].weekdays = {};
                $scope.weekDayRepeatSelection.filter(weekDay => weekDay.selected)
                    .map(weekDay => params.details[index].weekdays[weekDay.weekDay] = weekDay.selected);
            }           
        };

        /**
         * utility method to form day restriction param to api
         * modifiy the params's details
         * @param  {Object} params
         */
        const formDayRestrictionParamsForAPI = (params) => {
            var dialogData = $scope.ngDialogData,
                editedRestrictions = getEditedRestrictionsForAPI();
            
            if(!editedRestrictions.length) {
                return;
            }

            params.details.push({
                from_date: formatDateForAPI(dialogData.date),
                to_date: formatDateForAPI(dialogData.date),
                restrictions: editedRestrictions
            });
        };


        /**
         * utility method to form day amount param to api
         * modifiy the params's details
         * @param  {Object} params
         */
        const formDayAmountParamsForAPI = (params) => {
            var dialogData = $scope.ngDialogData;
            
            if(_.isEqual($scope.priceDetails, $scope.priceDetailsCopy)) {
                return;
            }

            params.details.push({
                from_date: formatDateForAPI(dialogData.date),
                to_date: formatDateForAPI(dialogData.date)
            });
            const index = params.details.length - 1;
            priceKeys.map( key => addAmountParamForAPI(key, params.details[index]));
        };

        /**
         * utility method to form weekday amount param to api
         * modifiy the params's details
         * @param  {Object} params
         */
        const formWeekDaysAmountParamsForAPI = (params) => {
            var dialogData = $scope.ngDialogData;

            if($scope.applyPriceToDates) {
                if($scope.untilDate === '') {
                    //$scope.errorMessage = ['Please choose until date'];
                    return;
                }
                params.details.push({
                    from_date: formatDateForAPI(util.addOneDay(tzIndependentDate(dialogData.date))),
                    to_date: formatDateForAPI($scope.untilDate)
                });
                let index = params.details.length - 1;

                priceKeys.map( key => addAmountParamForAPI(key, params.details[index]));

                params.details[index].weekdays = {};
                $scope.weekDayRepeatSelection.filter(weekDay => weekDay.selected)
                    .map(weekDay => params.details[index].weekdays[weekDay.weekDay] = weekDay.selected);
            }
        };

        /**
         * utility method to form day amount param to api
         * modifiy the params's details
         * @param  {Object} params
         */
        const addAmountParamForAPI = (key, paramDetail) => {
            if($scope.priceDetails[key] !== $scope.priceDetailsCopy[key]) {
                paramDetail[key] = {
                    type: 'amount_new',
                    value: parseFloat($scope.priceDetails[key])
                };
            }
            else {
                if(util.isNumeric($scope.priceDetails[key + '_changing_value'])) {
                    paramDetail[key] = {
                        type: $scope.priceDetails[key + '_amount_perc_cur_symbol'] === '%' ? 'percent_diff' : 'amount_diff',
                        value: parseFloat($scope.priceDetails[key + '_amount_operator'] + $scope.priceDetails[key + '_changing_value'])
                    };
                }                     
            }
        };
        /**
         * to update restriction rate
         */
        const callRateRestrictionUpdateAPI = () => {
            var params = {},
                dialogData = $scope.ngDialogData,
                mode = dialogData.mode;

            if(mode === $scope.modeConstants.RM_SINGLE_RATE_RESTRICTION_MODE) {
                params.rate_id = dialogData.rate.id;
            }
            else if(mode === $scope.modeConstants.RM_MULTIPLE_RATE_RESTRICTION_MODE) {
                params.rate_ids = _.pluck(dialogData.rates, 'id');
            }

            params.details = [];
            
            formDayRestrictionParamsForAPI(params);

            formRestrictionParamDetailForWeekDaysForAPI(params);

            const options = {
                params,
                onSuccess: onUpdateRateRestrictionData
            };
            $scope.callAPI(rvRateManagerCoreSrv.updateSingleRateRestrictionData, options);
        };

        /**
         * [description]
         * @return {[type]} [description]
         */
        const callRoomTypeRestrictionUpdateAPI = () => {
            var params = {},
                dialogData = $scope.ngDialogData,
                mode = dialogData.mode;

            if(mode === $scope.modeConstants.RM_SINGLE_ROOMTYPE_RESTRICTION_MODE) {
                params.room_type_id = dialogData.roomType.id;
            }

            params.details = [];
            
            formDayRestrictionParamsForAPI(params);

            formRestrictionParamDetailForWeekDaysForAPI(params);

            const options = {
                params,
                onSuccess: onUpdateRateRestrictionData
            };
            $scope.callAPI(rvRateManagerCoreSrv.updateSingleRateRestrictionData, options);
        };

        /**
         * [description]
         * @return {[type]} [description]
         */
        const callRateRoomTypeRestrictionAndAmountUpdateAPI = () => {
            var params = {},
                dialogData = $scope.ngDialogData,
                mode = dialogData.mode;

            params.rate_id = dialogData.rate.id;
            if(mode === $scope.modeConstants.RM_SINGLE_RATE_SINGLE_ROOMTYPE_RESTRICTION_AMOUNT_MODE) {
                params.room_type_id = dialogData.roomType.id;
            }

            params.details = [];
            
            formDayRestrictionParamsForAPI(params);

            formRestrictionParamDetailForWeekDaysForAPI(params);

            formDayAmountParamsForAPI(params);

            formWeekDaysAmountParamsForAPI(params);

            const options = {
                params,
                onSuccess: onUpdateRateRestrictionData
            };
            $scope.callAPI(rvRateManagerCoreSrv.updateSingleRateRestrictionData, options);
        };

        /**
         * on fetch rate details success (case when rate details not passed from controller/not found)
         * @param  {[type]} rateDetails [description]
         * @return {[type]}             [description]
         */
        const onFetchRateDetailsAndUpdateParentRateName = (rateDetails) => {
            $scope.parentRateName = rateDetails.name;
        };

        /**
         * to fetch missing rate name agains rate id
         * will come into matter if we not able to find in the rate list passing from rate manager ctrl
         * @param  {Integer} rate_id
         */
        const fetchRateDetailsAndUpdateParentRateName = (rate_id) => {
            const options = {
                params: { rate_id },
                onSuccess: onFetchRateDetailsAndUpdateParentRateName
            };
            $scope.callAPI(rvRateManagerCoreSrv.fetchRateDetails, options);            
        };

        /**
         * on tapping the set button
         */
        $scope.clickedOnSetButton = (event) => {
            event.stopPropagation();
            switch($scope.ngDialogData.mode) {
                case $scope.modeConstants.RM_SINGLE_RATE_RESTRICTION_MODE:
                case $scope.modeConstants.RM_MULTIPLE_RATE_RESTRICTION_MODE:
                    return callRateRestrictionUpdateAPI();

                case $scope.modeConstants.RM_SINGLE_ROOMTYPE_RESTRICTION_MODE:
                case $scope.modeConstants.RM_MULTIPLE_ROOMTYPE_RESTRICTION_MODE:
                    return callRoomTypeRestrictionUpdateAPI();

                case $scope.modeConstants.RM_SINGLE_RATE_SINGLE_ROOMTYPE_RESTRICTION_AMOUNT_MODE:
                case $scope.modeConstants.RM_SINGLE_RATE_MULTIPLE_ROOMTYPE_RESTRICTION_AMOUNT_MODE:
                    return callRateRoomTypeRestrictionAndAmountUpdateAPI();
                
                default:
                    break;
            }
        };

        /**
         * on tapping the switch button of restriction
         * @param  {Object} restriction
         */
        $scope.changeRestrictionStatus = (restriction) => {
            if (restriction.status === 'ON' && !restriction.hasInputField) {
                restriction.status = 'OFF';
                restriction.edited = true; //will be using while calling the api ;)
                return;
            }
            else if (restriction.status === 'OFF' && !restriction.hasInputField) {
                restriction.status = 'ON';
                restriction.edited = true; //will be using while calling the api ;)
                return;
            }
            else {
                $scope.contentMiddleMode = 'RESTRICTION_EDITING';
                //deselecting the previous ones
                deSelectAllRestriction();
                restriction.selected = true;
                $scope.restrictionForShowingTheDetails = util.deepCopy(restriction);
                return;
            }
        };

        /**
         * to get restriction displaying logic based upon the restriction listing
         * @param  {Object} restriction
         * @param  {array} individualRateRestrictionList
         * @return {Object}
         */
        const getDisplayingParamsForRestricion = (restriction, individualRateRestrictionList, commonRestrictions) => {
            const restrictionFoundInCommon = _.findWhere(commonRestrictions, {restriction_type_id: restriction.id});
            
            var returnable = {
                status: 'OFF',
                value: '',
                isDisabled: $scope.isPastDate || (!!restrictionFoundInCommon && restrictionFoundInCommon.is_on_rate)
            };

            if(restrictionFoundInCommon) {
                return {
                    ...returnable,
                    status: 'ON',
                    value: restrictionFoundInCommon.days,
                };
            }
            for(let i = 0; i < individualRateRestrictionList.length; i++ ) {
                let correspondingRestriction = _.findWhere(individualRateRestrictionList[i], { restriction_type_id: restriction.id });
                if(correspondingRestriction) {
                    return {
                        ...returnable,
                        status: 'VARIED',
                        value: RateManagerRestrictionTypes[restriction.value].hasInputField ? '??' : ''
                    };
                }
            }
            return returnable;
        };

        /**
         * to get the active and class and other configrtion added restriction list
         * @return {array}
         */
        const getRestrictionListForRateView = (restrictionTypes, restrictionSource, commonRestricitonSource) => {
            const individualRateRestrictionList = _.pluck(restrictionSource, 'restrictions');
            var restrictions = getValidRestrictionTypes(restrictionTypes)
                    .map(restrictionType => ({
                        ...restrictionType,
                        ...RateManagerRestrictionTypes[restrictionType.value],
                        ...getDisplayingParamsForRestricion(restrictionType, individualRateRestrictionList, commonRestricitonSource),
                        edited : false
                    }));

            restrictions = restrictions.map(restriciton => {
                if(restriciton.status === 'ON') {
                   restriciton.edited = true;
                }
                return restriciton;
            });

            return restrictions;
        };

        /**
         * to set the date picker
         */
        const setDatePicker = () => {
            var dialogData = $scope.ngDialogData;

            $scope.datePickerOptions = {
                dateFormat: $rootScope.jqDateFormat,
                numberOfMonths: 1,
                minDate: tzIndependentDate(util.addOneDay(tzIndependentDate(dialogData.date))),
                maxDate: tzIndependentDate(tzIndependentDate(dialogData.date).setFullYear(tzIndependentDate(dialogData.date).getFullYear() + 1)),
                defaultDate: tzIndependentDate(util.addOneDay(tzIndependentDate(dialogData.date))),
                onSelect:function(date, datePickerObj) {
                    $scope.untilDate = new tzIndependentDate(util.get_date_from_date_picker(datePickerObj));
                }
            };

            $scope.untilDate = '';
        };

        /**
         * to initialize the variabes on RM_SINGLE_RATE_RESTRICTION_MODE
         */
        const initializeSingleRateRestrictionMode = () => {
            var dialogData = $scope.ngDialogData,
                restrictionData = dialogData.restrictionData[0];

            $scope.header = dialogData.rate.name;
            
            $scope.headerBottomLeftLabel = formatDateForTopHeader(dialogData.date);

            $scope.headerBottomRightLabel = 'All Room types';

            $scope.restrictionList = getRestrictionListForRateView(dialogData.restrictionTypes,
                    restrictionData.room_types,
                    dialogData.commonRestrictions);

            $scope.roomTypeAndPrices = dialogData.roomTypesAndPrices;

            $scope.contentMiddleMode = 'ROOM_TYPE_PRICE_LISTING';
        };


        /**
         * to initialize the multiple rate restriction mode
         */
        const initializeMultipleRateRestrictionMode = () => {
            var dialogData = $scope.ngDialogData,
                restrictionData = dialogData.restrictionData[0];

            $scope.headerBottomLeftLabel = 'All Rates';
                    
            $scope.header = formatDateForTopHeader(tzIndependentDate(dialogData.date));

            $scope.headerBottomRightLabel = '';

            $scope.restrictionList = getRestrictionListForRateView(
                    dialogData.restrictionTypes,
                    restrictionData.rates,
                    dialogData.commonRestrictions);
            
            if(_.findWhere($scope.restrictionList, {status: 'VARIED'})) {
                $scope.headerNoticeOnRight = 'Restrictions vary across Rates!';
            }

            $scope.contentMiddleMode = 'MULTIPLE_RATE_CHOOSE_RATE';          
        };

        /**
         * to initialize the variabes on RM_SINGLE_ROOMTYPE_RESTRICTION_MODE
         */
        const initializeSingleRoomTypeRestrictionMode = () => {
            var dialogData = $scope.ngDialogData,
                restrictionData = dialogData.restrictionData[0],
                commonRestrictions = restrictionData.room_types[0].restrictions;
            $scope.header = dialogData.roomType.name;
            
            $scope.headerBottomLeftLabel = formatDateForTopHeader(dialogData.date);

            $scope.headerBottomRightLabel = '';

            $scope.restrictionList = getRestrictionListForRateView(
                    dialogData.restrictionTypes,
                    restrictionData.room_types,
                    commonRestrictions);

            $scope.roomTypeAndPrices = dialogData.roomTypesAndPrices;

            $scope.contentMiddleMode = 'SINGLE_ROOM_TYPE_CHOOSE_RATE';
        };

        /**
         * to initialize the multiple room type restriction mode
         */
        const initializeMultipleRoomTypeRestrictionMode = () => {
            var dialogData = $scope.ngDialogData,
                restrictionData = dialogData.restrictionData[0];
                    
            $scope.header = formatDateForTopHeader(dialogData.date);

            $scope.headerBottomLeftLabel = 'All Room types';

            $scope.headerBottomRightLabel = 'All Rates';

            $scope.restrictionList = getRestrictionListForRateView(
                    dialogData.restrictionTypes,
                    restrictionData.room_types,
                    dialogData.commonRestrictions);
            
            if(_.findWhere($scope.restrictionList, {status: 'VARIED'})) {
                $scope.headerNoticeOnRight = 'Restrictions vary across Room Types!';
            }

            $scope.contentMiddleMode = 'MULTIPLE_ROOM_TYPE_CHOOSE_RATE';
        };

        const initializeSingleRateRestrictionAndAmountMiddlePane = () => {
            var dialogData = $scope.ngDialogData,
                roomTypePricesAndRestrictions = dialogData.roomTypePricesAndRestrictions;
            
            if(dialogData.rate.is_hourly) {
                $scope.contentMiddleMode = 'SINGLE_RATE_SINGLE_ROOM_TYPE_HOURLY_AMOUNT_EDIT';
                $scope.priceDetails = {...roomTypePricesAndRestrictions.room_types[0]};
                
                //some defult values used in templates
                setDefaultPriceAdjustValues('single', $scope.priceDetails);

                $scope.priceDetailsCopy = {...$scope.priceDetails};         
            }
            else {
                $scope.contentMiddleMode = 'SINGLE_RATE_SINGLE_ROOM_TYPE_NIGHTLY_AMOUNT_EDIT';
                $scope.priceDetails = {...roomTypePricesAndRestrictions.room_types[0]};

                priceKeys.map(priceKey => setDefaultPriceAdjustValues(priceKey, $scope.priceDetails));

                $scope.priceDetailsCopy = {...$scope.priceDetails};
            }

            if(dialogData.rate.based_on_rate_id) {
                $scope.contentMiddleMode = 'SINGLE_RATE_ROOM_TYPE_CHILD_RATE';

                var parentRate = _.findWhere(dialogData.rates, {id:dialogData.rate.based_on_rate_id})
                if(parentRate) {
                    $scope.parentRateName = parentRate.name;
                }
                else {
                    fetchRateDetailsAndUpdateParentRateName(dialogData.rate.based_on_rate_id);
                }
            }
        };

        /**
         * [description]
         * @return {[type]} [description]
         */
        const initializeSingleRateSingleRoomTypeRestrictionAndAmountMode = () => {
            var dialogData = $scope.ngDialogData,
                roomTypePricesAndRestrictions = dialogData.roomTypePricesAndRestrictions,
                commonRestrictions = roomTypePricesAndRestrictions.room_types[0].restrictions;

            $scope.header = dialogData.roomType.name;

            $scope.headerBottomLeftLabel = formatDateForTopHeader(dialogData.date);

            $scope.headerBottomRightLabel = dialogData.rate.name;

            $scope.restrictionList = getRestrictionListForRateView(
                    dialogData.restrictionTypes,
                    roomTypePricesAndRestrictions.room_types,
                    commonRestrictions);
            
            if(_.findWhere($scope.restrictionList, { status: 'VARIED' })) {
                $scope.headerNoticeOnRight = 'Restrictions vary across Room Types!';
            }         

            initializeSingleRateRestrictionAndAmountMiddlePane();

            //if overriden, we need to notify in header (if it is not a child rate)
            if(!dialogData.rate.based_on_rate_id){
                let headerToAdd = '';
                
                priceOverridingKeys
                    .map(key => {
                        if($scope.priceDetails[key]) {
                            headerToAdd = 'Rate Amounts marked with * are edited!';
                        }
                    });

                if(headerToAdd !== '') {
                   $scope.headerNoticeOnRight = (!$scope.headerNoticeOnRight) ? headerToAdd :
                                $scope.headerNoticeOnRight + ', ' + headerToAdd; 
                }
            }
        };

        /**
         * utility method to set the default 
         * @param  {string} key
         * @param  {Object} priceDetails
         * will modify the price details passing
         */
        const setDefaultPriceAdjustValues = (key, priceDetails) => {
            //check the templates pls, you will get there, these are the model &it's values used in templates
            priceDetails[key + '_amount_operator'] = '+';
            priceDetails[key + '_amount_perc_cur_symbol'] = $rootScope.currencySymbol;
            priceDetails[key + '_changing_value'] =  '';
        };

        /**
         * to initialize the MIDDLE panel of single rate's expandable view's multiple room type
         */
        const initializeSingleRateMultipleRoomTypeRestrictionAndAmountMiddlePane = () => {
            var dialogData = $scope.ngDialogData,
                roomTypePricesAndRestrictions = dialogData.roomTypePricesAndRestrictions;
            
            if(dialogData.rate.is_hourly) {
                $scope.contentMiddleMode = 'SINGLE_RATE_MULTIPLE_ROOM_TYPE_HOURLY_AMOUNT_EDIT';
                
                $scope.priceDetails = {...roomTypePricesAndRestrictions.room_types[0]};
                
                //some defult values used in templates
                setDefaultPriceAdjustValues('single', $scope.priceDetails);

                $scope.priceDetailsCopy = {...$scope.priceDetails};                 
            }
            else {
                $scope.contentMiddleMode = 'SINGLE_RATE_MULTIPLE_ROOM_TYPE_NIGHTLY_AMOUNT_EDIT';
                $scope.priceDetails = {};
                
                //forming the default model key value pairs used in templates
                priceKeys.map(priceKey => setDefaultPriceAdjustValues(priceKey, $scope.priceDetails));

                $scope.priceDetailsCopy = {...$scope.priceDetails};
            }

            if(dialogData.rate.based_on_rate_id) {
                $scope.contentMiddleMode = 'SINGLE_RATE_ROOM_TYPE_CHILD_RATE';
                var parentRate = _.findWhere(dialogData.rates, {id:dialogData.rate.based_on_rate_id})
                if(parentRate) {
                    $scope.parentRateName = parentRate.name;
                }
                else {
                    fetchRateDetailsAndUpdateParentRateName(dialogData.rate.based_on_rate_id);
                }
            }
        };

        /**
         * AMOUNT & RESTRICTION SHOWING GRID - top header
         * ie., single rate's expandable view's top header
         * when clicked on top row of the grid (all room types)
         * this function used to initialize the popup on that mode
         */
        const initializeSingleRateMultipleRoomTypeRestrictionAndAmountMode = () => {
            var dialogData = $scope.ngDialogData,
                roomTypePricesAndRestrictions = dialogData.roomTypePricesAndRestrictions;

            $scope.header = formatDateForTopHeader(dialogData.date);

            $scope.headerBottomLeftLabel = 'All room types';

            $scope.headerBottomRightLabel = dialogData.rate.name;

            $scope.restrictionList = getRestrictionListForRateView(
                    dialogData.restrictionTypes,
                    roomTypePricesAndRestrictions.room_types,
                    dialogData.commonRestrictions);
            
            if(_.findWhere($scope.restrictionList, { status: 'VARIED' })) {
                $scope.headerNoticeOnRight = 'Restrictions vary across Room Types!';
            }         

            initializeSingleRateMultipleRoomTypeRestrictionAndAmountMiddlePane();
        };

        /**
         * to initialize Mode based values
         */
        const initializeModeBasedValues = () => {
            switch($scope.ngDialogData.mode) {
                //when we click a restriciton cell on rate view mode
                case $scope.modeConstants.RM_SINGLE_RATE_RESTRICTION_MODE:
                    initializeSingleRateRestrictionMode();
                    break;
                
                //when we click a header restriciton cell on rate view mode
                case $scope.modeConstants.RM_MULTIPLE_RATE_RESTRICTION_MODE:
                    initializeMultipleRateRestrictionMode();
                    break;

                //when we click a restriciton cell on room type view mode
                case $scope.modeConstants.RM_SINGLE_ROOMTYPE_RESTRICTION_MODE:
                    initializeSingleRoomTypeRestrictionMode();
                    break;

                case $scope.modeConstants.RM_MULTIPLE_ROOMTYPE_RESTRICTION_MODE:
                    initializeMultipleRoomTypeRestrictionMode();
                    break;

                case $scope.modeConstants.RM_SINGLE_RATE_SINGLE_ROOMTYPE_RESTRICTION_AMOUNT_MODE:
                    initializeSingleRateSingleRoomTypeRestrictionAndAmountMode();
                    break;

                case $scope.modeConstants.RM_SINGLE_RATE_MULTIPLE_ROOMTYPE_RESTRICTION_AMOUNT_MODE:
                    initializeSingleRateMultipleRoomTypeRestrictionAndAmountMode();
                    break;

                dafault:
                    break;
            }
        };

        /**
         * to initialize the data model
         */
        const initializeDataModels = () => {

            $scope.isPastDate = new tzIndependentDate($scope.ngDialogData.date) < new tzIndependentDate($rootScope.businessDate);

            $scope.header = '';
            
            $scope.headerBottomLeftLabel = '';
            
            $scope.headerBottomRightLabel = '';
            
            $scope.headerNoticeOnRight = '';

            $scope.roomTypeAndPrices = [];

            $scope.restrictionList =  [];

            $scope.contentMiddleMode = ''; //values possible: 'ROOM_TYPE_PRICE_LISTING', 'RESTRICTION_EDITING'

            $scope.modeConstants = rvRateManagerPopUpConstants;

            $scope.applyRestrictionsToDates = false;

            $scope.applyPriceToDates = false;

            $scope.weekDayRepeatSelection = weekDays.map(weekDay => ({
                weekDay: weekDay,
                selected: false
            }));
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