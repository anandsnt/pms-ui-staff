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
        const formatDateForTopHeader = (date) => formatDate(date, 'EEEE, MMMM yy');

        /**
         * to set the scrollers in the ui
         */
        const setScroller = () => {
            $scope.setScroller('scroller-restriction-list');
            $scope.setScroller('room-type-price-listing');
            $scope.setScroller('room-type-price-editing');
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
         * to goto default middle pane
         */
        const gotoDefaultMiddlePaneMode = () => {
            switch($scope.ngDialogData.mode) {
                case $scope.modeConstants.RM_SINGLE_RATE_RESTRICTION_MODE:
                    $scope.contentMiddleMode = 'ROOM_TYPE_PRICE_LISTING';
                    break;
                
                case $scope.modeConstants.RM_MULTIPLE_RATE_RESTRICTION_MODE:
                case $scope.modeConstants.RM_SINGLE_ROOMTYPE_RESTRICTION_MODE:
                case $scope.modeConstants.RM_MULTIPLE_ROOMTYPE_RESTRICTION_MODE:
                    $scope.contentMiddleMode = '';
                    break;
                
                case $scope.modeConstants.RM_SINGLE_RATE_RESTRICTION_AMOUNT_MODE:
                    initializeSingleRateRestrictionAndAmountMiddlePane();
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
                case $scope.modeConstants.RM_SINGLE_RATE_RESTRICTION_AMOUNT_MODE:
                    if(util.isNumeric($scope.priceDetails[key + '_changing_value'])) {
                        $scope.priceDetails[key] = $scope.priceDetailsCopy[key];
                    }
                    else {
                        $scope.priceDetails[key + '_changing_value'] = '';
                    }
                    refreshScroller();
                    break;
            }
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
         * to update restriction rate
         */
        const callRateRestrictionUpdateAPI = () => {
            var params = {},
                dialogData = $scope.ngDialogData,
                mode = dialogData.mode,
                restrictionToApply = [];

            if(mode === $scope.modeConstants.RM_SINGLE_RATE_RESTRICTION_MODE) {
                params.rate_id = dialogData.rate.id;
            }
            else if(mode === $scope.modeConstants.RM_MULTIPLE_RATE_RESTRICTION_MODE) {
                params.rate_ids = _.pluck(dialogData.rates, 'id');
            }

            restrictionToApply = getEditedRestrictionsForAPI();

            params.details = [];
            params.details.push({
                from_date: formatDateForAPI(dialogData.date),
                to_date: formatDateForAPI(dialogData.date),
                restrictions: restrictionToApply
            });

            if($scope.applyRestrictionsToDates) {
                if($scope.untilDate === '') {
                    $scope.errorMessage = ['Please choose until date'];
                    return;
                }
                params.details.push({
                    from_date: formatDateForAPI(util.addOneDay(tzIndependentDate(dialogData.date))),
                    to_date: formatDateForAPI($scope.untilDate),
                    restrictions: restrictionToApply
                });
                params.details[1].weekdays = {};
                $scope.weekDayRepeatSelection.filter(weekDay => weekDay.selected)
                    .map(weekDay => params.details[1].weekdays[weekDay.weekDay] = weekDay.selected);
            }
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
                mode = dialogData.mode,
                restrictionToApply = [];

            if(mode === $scope.modeConstants.RM_SINGLE_ROOMTYPE_RESTRICTION_MODE) {
                params.room_type_id = dialogData.roomType.id;
            }

            restrictionToApply = getEditedRestrictionsForAPI();

            params.details = [];
            params.details.push({
                from_date: formatDateForAPI(dialogData.date),
                to_date: formatDateForAPI(dialogData.date),
                restrictions: restrictionToApply
            });

            if($scope.applyRestrictionsToDates) {
                if($scope.untilDate === '') {
                    $scope.errorMessage = ['Please choose until date'];
                    return;
                }
                params.details.push({
                    from_date: formatDateForAPI(util.addOneDay(tzIndependentDate(dialogData.date))),
                    to_date: formatDateForAPI($scope.untilDate),
                    restrictions: restrictionToApply
                });
                params.details[1].weekdays = {};
                $scope.weekDayRepeatSelection.filter(weekDay => weekDay.selected)
                    .map(weekDay => params.details[1].weekdays[weekDay.weekDay] = weekDay.selected);
            }
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
                mode = dialogData.mode,
                restrictionToApply = [];

            if(mode === $scope.modeConstants.RM_SINGLE_RATE_RESTRICTION_AMOUNT_MODE) {
                params.room_type_id = dialogData.roomType.id;
            }

            restrictionToApply = getEditedRestrictionsForAPI();

            params.details = [];
            params.details.push({
                from_date: formatDateForAPI(dialogData.date),
                to_date: formatDateForAPI(dialogData.date),
                restrictions: restrictionToApply
            });

            if($scope.applyRestrictionsToDates) {
                if($scope.untilDate === '') {
                    $scope.errorMessage = ['Please choose until date'];
                    return;
                }
                params.details.push({
                    from_date: formatDateForAPI(util.addOneDay(tzIndependentDate(dialogData.date))),
                    to_date: formatDateForAPI($scope.untilDate),
                    restrictions: restrictionToApply
                });
                params.details[1].weekdays = {};
                $scope.weekDayRepeatSelection.filter(weekDay => weekDay.selected)
                    .map(weekDay => params.details[1].weekdays[weekDay.weekDay] = weekDay.selected);
            }

            if($scope.applyPriceToDates) {
                if($scope.untilDate === '') {
                    $scope.errorMessage = ['Please choose until date'];
                    return;
                }
                params.details.push({
                    from_date: formatDateForAPI(util.addOneDay(tzIndependentDate(dialogData.date))),
                    to_date: formatDateForAPI($scope.untilDate)
                });
                params.details[params.details.length - 1].weekdays = {};
                $scope.weekDayRepeatSelection.filter(weekDay => weekDay.selected)
                    .map(weekDay => params.details[1].weekdays[weekDay.weekDay] = weekDay.selected);
            }


            const options = {
                params,
                onSuccess: onUpdateRateRestrictionData
            };
            $scope.callAPI(rvRateManagerCoreSrv.updateSingleRateRestrictionData, options);
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

                case $scope.modeConstants.RM_SINGLE_RATE_RESTRICTION_AMOUNT_MODE:
                    return callRateRoomTypeRestrictionAndAmountUpdateAPI();
                
                default:
                    break;
            }
        };

        /**
         * when the  restriciton update api call is success
         * @param  {Object} result
         */
        const onUpdateRateRestrictionData = (result) => {  
            $scope.$emit(rvRateManagerEventConstants.RELOAD_RESULTS);
            $scope.closeDialog();
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
        const getRestrictionListForRateView = (restrictionTypes, restrictionSource, commonRestricitonSource) => {
            const individualRateRestrictionList = _.pluck(restrictionSource, 'restrictions');
            return getValidRestrictionTypes(restrictionTypes)
                    .map(restrictionType => ({
                        ...restrictionType,
                        ...RateManagerRestrictionTypes[restrictionType.value],
                        ...getDisplayingParamsForRestricion(restrictionType, individualRateRestrictionList, commonRestricitonSource),
                        edited : false
                    }));
        };

        /**
         * to set the date picker
         */
        const setDatePicker = () => {
            $scope.datePickerOptions = {
                dateFormat: $rootScope.jqDateFormat,
                numberOfMonths: 1,
                minDate: tzIndependentDate(util.addOneDay(tzIndependentDate($scope.ngDialogData.date))),
                onSelect:function(date, datePickerObj) {
                    $scope.untilDate = new tzIndependentDate(util.get_date_from_date_picker(datePickerObj));
                }
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

            $scope.contentMiddleMode = ''; //values possible: 'ROOM_TYPE_PRICE_LISTING', 'RESTRICTION_EDITING'

            $scope.modeConstants = rvRateManagerPopUpConstants;

            $scope.applyRestrictionsToDates = false;

            $scope.applyPriceToDates = false;

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
            var dialogData = $scope.ngDialogData,
                restrictionData = dialogData.restrictionData[0];

            $scope.header = dialogData.rate.name;
            
            $scope.headerBottomLeftLabel = formatDateForTopHeader(dialogData.date);

            $scope.headerBottomRightLabel = 'All Room types';

            $scope.restrictionList = getRestrictionListForRateView(dialogData.restrictionTypes,
                    restrictionData.room_types,
                    restrictionData.rate_restrictions);

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
                    restrictionData.all_rate_restrictions);
            
            if(_.findWhere($scope.restrictionList, {status: 'VARIED'})) {
                $scope.headerNoticeOnRight = 'Restrictions vary across Rates!';
            }            
        };

        /**
         * to initialize the variabes on RM_SINGLE_ROOMTYPE_RESTRICTION_MODE
         */
        const initializeSingleRoomTypeRestrictionMode = () => {
            var dialogData = $scope.ngDialogData,
                restrictionData = dialogData.restrictionData[0];
            $scope.header = dialogData.roomType.name;
            
            $scope.headerBottomLeftLabel = formatDateForTopHeader(dialogData.date);

            $scope.headerBottomRightLabel = '';

            $scope.restrictionList = getRestrictionListForRateView(
                    dialogData.restrictionTypes,
                    restrictionData.room_types,
                    restrictionData.all_room_type_restrictions);

            $scope.roomTypeAndPrices = dialogData.roomTypesAndPrices;

            $scope.contentMiddleMode = '';
        };

        /**
         * to initialize the multiple room type restriction mode
         */
        const initializeMultipleRoomTypeRestrictionMode = () => {
            var dialogData = $scope.ngDialogData,
                restrictionData = dialogData.restrictionData[0];
                    
            $scope.header = formatDateForTopHeader(dialogData.date);

            $scope.headerBottomLeftLabel = 'All Room types';

            $scope.headerBottomRightLabel = '';

            $scope.restrictionList = getRestrictionListForRateView(
                    dialogData.restrictionTypes,
                    restrictionData.room_types,
                    restrictionData.all_room_type_restrictions);
            
            if(_.findWhere($scope.restrictionList, {status: 'VARIED'})) {
                $scope.headerNoticeOnRight = 'Restrictions vary across Room Types!';
            }
        };

        const initializeSingleRateRestrictionAndAmountMiddlePane = () => {
            var dialogData = $scope.ngDialogData,
                roomTypePricesAndRestrictions = dialogData.roomTypePricesAndRestrictions;
            
            if(dialogData.rate.is_hourly) {
                $scope.contentMiddleMode = 'SINGLE_RATE_ROOM_TYPE_HOURLY_AMOUNT_EDIT';
            }
            else {
                $scope.contentMiddleMode = 'SINGLE_RATE_ROOM_TYPE_NIGHTLY_AMOUNT_EDIT';
                $scope.priceDetails = {...roomTypePricesAndRestrictions.room_types[0]};
                
                $scope.priceDetails.single_amount_operator = '+';
                $scope.priceDetails.single_amount_perc_cur_symbol = '%';
                $scope.priceDetails.single_changing_value = '';

                $scope.priceDetails.double_amount_operator = '+';
                $scope.priceDetails.double_amount_perc_cur_symbol = '%';
                $scope.priceDetails.double_changing_value = '';

                $scope.priceDetails.child_amount_operator = '+';
                $scope.priceDetails.child_amount_perc_cur_symbol = '%';
                $scope.priceDetails.child_changing_value = '';

                $scope.priceDetails.extra_adult_amount_operator = '+';
                $scope.priceDetails.extra_adult_amount_perc_cur_symbol = '%';
                $scope.priceDetails.extra_adult_changing_value = '';

                $scope.priceDetailsCopy = {...$scope.priceDetails};
            }

            if(dialogData.rate.based_on_rate_id) {
               $scope.contentMiddleMode = 'SINGLE_RATE_ROOM_TYPE_CHILD_RATE';
            }
        };

        /**
         * [description]
         * @return {[type]} [description]
         */
        const initializeSingleRateRestrictionAndAmountMode = () => {
            var dialogData = $scope.ngDialogData,
                roomTypePricesAndRestrictions = dialogData.roomTypePricesAndRestrictions;

            $scope.header = dialogData.roomType.name;

            $scope.headerBottomLeftLabel = formatDateForTopHeader(dialogData.date);

            $scope.headerBottomRightLabel = dialogData.rate.name;

            $scope.restrictionList = getRestrictionListForRateView(
                    dialogData.restrictionTypes,
                    roomTypePricesAndRestrictions.room_types,
                    roomTypePricesAndRestrictions.rate_restrictions);
            
            if(_.findWhere($scope.restrictionList, { status: 'VARIED' })) {
                $scope.headerNoticeOnRight = 'Restrictions vary across Room Types!';
            }            

            initializeSingleRateRestrictionAndAmountMiddlePane();
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

                case $scope.modeConstants.RM_SINGLE_RATE_RESTRICTION_AMOUNT_MODE:
                    initializeSingleRateRestrictionAndAmountMode();
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