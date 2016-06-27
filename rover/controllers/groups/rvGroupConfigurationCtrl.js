angular.module('sntRover').controller('rvGroupConfigurationCtrl', [
    '$scope',
    '$rootScope',
    'rvGroupSrv',
    '$filter',
    '$stateParams',
    'rvGroupConfigurationSrv',
    'summaryData',
    'holdStatusList',
    '$state',
    'rvPermissionSrv',
    '$timeout',
    'rvAccountTransactionsSrv',
    'ngDialog',
    function($scope, $rootScope, rvGroupSrv, $filter, $stateParams, rvGroupConfigurationSrv, summaryData, holdStatusList, $state, rvPermissionSrv, $timeout, rvAccountTransactionsSrv, ngDialog) {

        BaseCtrl.call(this, $scope);

        /**
         * to run angular digest loop,
         * will check if it is not running
         * return - None
         */
        var runDigestCycle = function() {
            if (!$scope.$$phase) {
                $scope.$digest();
            }
        };

        var roomAndRatesState = 'rover.reservation.staycard.mainCard.room-rates';
        

        /**
         * whether current screen is in Add Mode
         * @return {Boolean}
         */
        $scope.isInAddMode = function() {
            return ($stateParams.id === "NEW_GROUP");
        };

        /**
         * Check if selecting Addons
         * @return {Boolean}
         */
        $scope.isInAddonSelectionMode = function() {
            return $scope.groupConfigData.selectAddons;
        }

        /**
         * function to set title and things
         * @return - None
         */
        var setTitle = function() {
            var title = $filter('translate')('GROUP_DETAILS');

            // we are changing the title if we are in Add Mode
            if ($scope.isInAddMode()) {
                title = $filter('translate')('NEW_GROUP');
            }

            //yes, we are setting the headting and title
            $scope.setHeadingTitle(title);
        };



        /**
         * Function to check the mandatory values while saving the reservation
         * Handling in client side owing to alleged issues on import if handled in the server side
         * @return boolean [true if all the mandatory values are present]
         */
        var ifMandatoryValuesEntered = function() {
            var summary = $scope.groupConfigData.summary;
            return !!summary.group_name && !!summary.hold_status && !!summary.block_from && !!summary.block_to && !!summary.release_date;
        }

        /**
         * shouldShowRoomingListTab whether to show rooming list tab
         * @return {Boolean} [description]
         */
        $scope.shouldShowRoomingListTab = function() {
            //we will not show it in add mode
            return (!$scope.isInAddMode());
        };

        /**
         * API requires a specific formatted date
         * @param {String/DateObject}
         * @return {String}
         */
        var formatDateForAPI = function(date_) {
            var type_ = typeof date_,
                returnString = '';
            switch (type_) {
                //if date string passed
                case 'string':
                    returnString = $filter('date')(new tzIndependentDate(date_), $rootScope.dateFormatForAPI);
                    break;

                    //if date object passed
                case 'object':
                    returnString = $filter('date')(date_, $rootScope.dateFormatForAPI);
                    break;
            }
            return (returnString);
        };

        /**
         * we want to display date in what format set from hotel admin
         * @param {String/DateObject}
         * @return {String}
         */
        $scope.formatDateForUI = function(date_) {
            var type_ = typeof date_,
                returnString = '';
            switch (type_) {
                //if date string passed
                case 'string':
                    returnString = $filter('date')(new tzIndependentDate(date_), $rootScope.dateFormat);
                    break;

                    //if date object passed
                case 'object':
                    returnString = $filter('date')(date_, $rootScope.dateFormat);
                    break;
            }
            return (returnString);
        };

        //Move date, from date, end date change
        (function(){

            var activeMode = null,
                lastSuccessCallback = null,
                lastFailureCallback = null,
                lastApiFnParams     = null;

            /**
             * to set current move
             * @param {String} mode [description]
             * @return {undefined}
             */
            var setMode = function(mode) {
                var modesAvailable = ["DEFAULT", "CHANGE_DATES", "COMPLETE_MOVE"];

                if (mode && mode !== null) {
                    mode        = mode.toString().toUpperCase();
                    activeMode  = ( modesAvailable.indexOf(mode) >=0 ) ? mode : null;
                }
            };

            /**
             * whether arrival date left change allowed
             * @return {Boolean}
             */
            var arrDateLeftChangeAllowed = function(){
                var sumryData                   = $scope.groupConfigData.summary,
                    roomBlockExist              = (parseInt(sumryData.rooms_total) > 0),
                    notAPastGroup               = !sumryData.is_a_past_group,
                    fromDateleftMovedAllowed    = sumryData.is_from_date_left_move_allowed;

                return (roomBlockExist &&
                        notAPastGroup &&
                        fromDateleftMovedAllowed);
            };

            /**
             * whether arrival date left change allowed
             * @return {Boolean}
             */
            var arrDateRightChangeAllowed = function(){
                var sumryData                   = $scope.groupConfigData.summary,
                    roomBlockExist              = (parseInt(sumryData.rooms_total) > 0),
                    noInHouseReservationExist   = (parseInt(sumryData.total_checked_in_reservations) === 0),
                    notAPastGroup               = !sumryData.is_a_past_group,
                    fromDateRightMovedAllowed   = sumryData.is_from_date_right_move_allowed;

                return (roomBlockExist &&
                        noInHouseReservationExist &&
                        notAPastGroup &&
                        fromDateRightMovedAllowed);
            };

            /**
             * in order to show the move confirmation popup
             * @param {Object}
             * @return {undefined}
             */
            var showEarlierArrivalDateMoveConfirmationPopup = function (data) {
                ngDialog.open(
                {
                    template        : '/assets/partials/groups/summary/popups/changeDates/arrivalDate/rvConfirmArrivalDateChangeToEarlier.html',
                    className       : '',
                    closeByDocument : false,
                    closeByEscape   : false,
                    scope           : $scope,
                    data            : JSON.stringify(data)
                });
            };

            /**
             * in order to show the move confirmation popup
             * @param {Object}
             * @return {undefined}
             */
            var showLaterArrivalDateMoveConfirmationPopup = function (data) {
                ngDialog.open(
                {
                    template        : '/assets/partials/groups/summary/popups/changeDates/arrivalDate/rvConfirmArrivalDateChangeLater.html',
                    className       : '',
                    closeByDocument : false,
                    closeByEscape   : false,
                    scope           : $scope,
                    data            : JSON.stringify(data)
                });
            };

            /**
             * [clickedOnMoveSaveButton description]
             * @return {[type]} [description]
             */
            var triggerEarlierArrivalDateChange = function(options) {
                lastSuccessCallback = options["successCallBack"] ? options["successCallBack"] : null;
                lastFailureCallback = options["failureCallBack"] ? options["failureCallBack"] : null;
                lastCancelCallback  = options["cancelPopupCallBack"] ? options["cancelPopupCallBack"] : null;

                var dataForPopup = {
                    dataset:
                        {
                            fromDate    : options["fromDate"]   ? options["fromDate"] : null,
                            oldFromDate : options["oldFromDate"]? options["oldFromDate"] : null,
                            changeInArr : true
                        }
                };

                showEarlierArrivalDateMoveConfirmationPopup(dataForPopup);
            };

            /**
             * [clickedOnMoveSaveButton description]
             * @return {[type]} [description]
             */
            var triggerLaterArrivalDateChange = function(options) {
                lastSuccessCallback = options["successCallBack"] ? options["successCallBack"] : null;
                lastFailureCallback = options["failureCallBack"] ? options["failureCallBack"] : null;
                lastCancelCallback  = options["cancelPopupCallBack"] ? options["cancelPopupCallBack"] : null;

                var dataForPopup = {
                    dataset:
                        {
                            fromDate    : options["fromDate"]   ? options["fromDate"] : null,
                            oldFromDate : options["oldFromDate"]? options["oldFromDate"] : null,
                            changeInArr : true
                        }
                };

                showLaterArrivalDateMoveConfirmationPopup(dataForPopup);
            };

            /**
             * whether departure date left change allowed
             * @return {Boolean}
             */
            var depDateLeftChangeAllowed = function(){
                var sumryData                   = $scope.groupConfigData.summary,
                    roomBlockExist              = (parseInt(sumryData.rooms_total) > 0),
                    noInHouseReservationExist   = (parseInt(sumryData.total_checked_in_reservations) === 0);

                return (roomBlockExist &&
                        sumryData.is_to_date_left_move_allowed);
            };

            /**
             * whether departure date right change allowed
             * @return {Boolean}
             */
            var depDateRightChangeAllowed = function(){
                var sumryData                   = $scope.groupConfigData.summary,
                    roomBlockExist              = (parseInt(sumryData.rooms_total) > 0),
                    noInHouseReservationExist   = (parseInt(sumryData.total_checked_in_reservations) === 0);

                return (roomBlockExist &&
                        sumryData.is_to_date_right_move_allowed);
            };

            /**
             * in order to show the move confirmation popup
             * @param {Object}
             * @return {undefined}
             */
            var showEarlierDepartureDateMoveConfirmationPopup = function (data) {
                ngDialog.open(
                {
                    template        : '/assets/partials/groups/summary/popups/changeDates/departureDate/rvConfirmDepartureDateChangeToEarlier.html',
                    className       : '',
                    closeByDocument : false,
                    closeByEscape   : false,
                    scope           : $scope,
                    data            : JSON.stringify(data)
                });
            };

            /**
             * in order to show the move confirmation popup
             * @param {Object}
             * @return {undefined}
             */
            var showLaterDepartureDateMoveConfirmationPopup = function (data) {
                ngDialog.open(
                {
                    template        : '/assets/partials/groups/summary/popups/changeDates/departureDate/rvConfirmDepartureDateChangeLater.html',
                    className       : '',
                    closeByDocument : false,
                    closeByEscape   : false,
                    scope           : $scope,
                    data            : JSON.stringify(data)
                });
            };

            /**
             * [clickedOnMoveSaveButton description]
             * @return {[type]} [description]
             */
            var triggerEarlierDepartureDateChange = function(options) {
                lastSuccessCallback = options["successCallBack"] ? options["successCallBack"] : null;
                lastFailureCallback = options["failureCallBack"] ? options["failureCallBack"] : null;
                lastCancelCallback  = options["cancelPopupCallBack"] ? options["cancelPopupCallBack"] : null;

                var dataForPopup = {
                    dataset:
                        {
                            toDate      : options["toDate"]   ? options["toDate"] : null,
                            oldToDate   : options["oldToDate"]? options["oldToDate"] : null,
                            changeInDep : true
                        }
                };

                showEarlierDepartureDateMoveConfirmationPopup (dataForPopup);
            };

            /**
             * [clickedOnMoveSaveButton description]
             * @return {[type]} [description]
             */
            var triggerLaterDepartureDateChange = function(options) {
                lastSuccessCallback = options["successCallBack"] ? options["successCallBack"] : null;
                lastFailureCallback = options["failureCallBack"] ? options["failureCallBack"] : null;
                lastCancelCallback  = options["cancelPopupCallBack"] ? options["cancelPopupCallBack"] : null;

                var dataForPopup = {
                    dataset:
                        {
                            toDate      : options["toDate"]   ? options["toDate"] : null,
                            oldToDate   : options["oldToDate"]? options["oldToDate"] : null,
                            changeInDep : true
                        }
                };

                showLaterDepartureDateMoveConfirmationPopup(dataForPopup);
            };

            /**
             * Show warning if date picked is invalid
             * @param {object} options for popup
             */
            var showDateChangeInvalidWarning = function(options) {
                lastSuccessCallback = options["successCallBack"] ? options["successCallBack"] : null;
                lastFailureCallback = options["failureCallBack"] ? options["failureCallBack"] : null;
                lastCancelCallback  = options["cancelPopupCallBack"] ? options["cancelPopupCallBack"] : null;

                var dataForPopup = {
                    dataset:
                        {
                            message: options["message"] ? options["message"] : ""
                        }
                };

                showDateChangeInvalidWarningPopup(dataForPopup);
            };

            /**
             * in order to show the change date invalid popup
             * @param {Object}
             * @return {undefined}
             */
            var showDateChangeInvalidWarningPopup = function (data) {
                ngDialog.open(
                {
                    template        : '/assets/partials/groups/summary/popups/changeDates/rvGroupChangeDatesInvalidWarningPopup.html',
                    className       : '',
                    closeByDocument : false,
                    closeByEscape   : false,
                    scope           : $scope,
                    data            : JSON.stringify(data)
                });
            };


            /**
             * [successCallBackOfMoveDatesAPI description]
             * @param  {[type]} data [description]
             * @return {[type]}      [description]
             */
            var successCallBackOfChangeDatesAPI = function (data) {
                $scope.closeDialog ();
                lastSuccessCallback ();
            };

            /**
             * if the user has enough permission to over book room type
             * @return {Boolean}
             */
            var hasPermissionToOverBook = function () {
                return rvPermissionSrv.getPermissionValue('OVERBOOK_ROOM_TYPE');
            };

            /**
             * should show proceed button
             * @return {Boolean}
             */
            $scope.shouldShowProceedButtonInNoAvailaility = function () {
                return hasPermissionToOverBook ();
            };

            /**
             * when user say 'proceed' from no availbility popup
             * @return {undefined}
             */
            $scope.forcefullyOverbook = function() {
                var args = lastApiFnParams;

                if (!_.isObject(args)) {
                    console.log ('there is something wrong in the flow');
                    return false;
                }

                //is in move mode
                if (isInCompleteMoveMode()) {
                    $scope.callMoveDatesAPI (args[0], true);
                }

                //is in left/right date change
                else {
                    $scope.callChangeDatesAPI (args[0], args[1], true);
                }
            };

            /**
             * [openNoAvailabilityPopup description]
             * @return {[type]} [description]
             */
            var openNoAvailabilityPopup = function () {
                ngDialog.open(
                {
                    template        : '/assets/partials/groups/summary/popups/changeDates/rvGroupChangeDatesNoAvailabilityPopup.html',
                    className       : '',
                    closeByDocument : false,
                    closeByEscape   : false,
                    scope           : $scope
                });
            };

            /**
             * [failureCallBackOfMoveDatesAPI description]
             * @param  {[type]} errorMessage [description]
             * @return {[type]}              [description]
             */
            var failureCallBackOfChangeDatesAPI= function (error) {
                $scope.closeDialog ();

                //since we are expecting some custom http error status in the response
                //and we are using that to differentiate among errors
                if(error.hasOwnProperty ('httpStatus')) {
                    switch (error.httpStatus) {
                        case 470:
                            $timeout(
                                function(){
                                    openNoAvailabilityPopup ();
                                },
                            750);
                            break;
                        default:
                            $scope.errorMessage = error;
                            lastFailureCallback (error);
                            break;
                    }
                }

                else {
                    $scope.errorMessage = error;
                    lastFailureCallback (error);
                }
            };

            /**
             * function explicitly for calling the move API
             * @param  {[type]} options [description]
             * @return {[type]}         [description]
             */
            $scope.callChangeDatesAPI = function (options, changeReservationDates, forcefullyOverbook) {
                var dataSet         = options && options["dataset"],
                    successCallBack = lastSuccessCallback,
                    failureCallBack = lastFailureCallback,
                    arrChangeOnly   = 'changeInArr' in dataSet && dataSet['changeInArr'],
                    depChangeOnly   = 'changeInDep' in dataSet && dataSet['changeInDep'],
                    conditnalParams = {},
                    forcefullyOverbook = typeof forcefullyOverbook === "undefined" ? false : forcefullyOverbook;

                lastApiFnParams = _.extend({}, arguments);

                var params = {
                    group_id                : $scope.groupConfigData.summary.group_id,
                    change_reservation_dates: changeReservationDates,
                    force_fully_over_book   : forcefullyOverbook
                };

                if (arrChangeOnly) {
                    conditnalParams = {
                        from_date               : dataSet["fromDate"] ? formatDateForAPI(dataSet["fromDate"]) : null,
                        is_change_in_from_date  : true
                    };
                }
                else if (depChangeOnly) {
                    conditnalParams = {
                        to_date                : dataSet["toDate"] ? formatDateForAPI(dataSet["toDate"]) : null,
                        is_change_in_to_date   : true
                    };
                }

                _.extend(params, conditnalParams);

                var options = {
                    params          : params,
                    successCallBack : successCallBackOfChangeDatesAPI, //null case will be handled from baseCtrl
                    failureCallBack : failureCallBackOfChangeDatesAPI //null case will be handled from baseCtrl
                };
                $scope.callAPI(rvGroupConfigurationSrv.changeDates, options);
            };

            /**
             * wanted to show the Move button in screen
             * @return {Boolean}
             */
            var shouldShowMoveButton = function () {
                var sumryData                       = $scope.groupConfigData.summary,
                    roomBlockExist                  = (parseInt(sumryData.rooms_total) > 0),
                    noInHouseReservationExist       = (parseInt(sumryData.total_checked_in_reservations) === 0),
                    notAPastGroup                   = !sumryData.is_a_past_group;

                return (roomBlockExist &&
                        noInHouseReservationExist &&
                        notAPastGroup &&
                        !isInCompleteMoveMode());
            };

            /**
             * in order to show the move confirmation popup
             * @param {Object}
             * @return {undefined}
             */
            var showMoveConfirmationPopup = function (data) {
                ngDialog.open(
                {
                    template        : '/assets/partials/groups/summary/popups/changeDates/moveDates/rvGroupMoveDatesConfirmationPopup.html',
                    className       : '',
                    closeByDocument : false,
                    closeByEscape   : false,
                    scope           : $scope,
                    data            : JSON.stringify(data)
                });
            };

            /**
             * [clickedOnMoveSaveButton description]
             * @return {[type]} [description]
             */
            var clickedOnMoveSaveButton = function(options) {
                lastSuccessCallback = options["successCallBack"] ? options["successCallBack"] : null;
                lastFailureCallback = options["failureCallBack"] ? options["failureCallBack"] : null;
                lastCancelCallback  = options["cancelPopupCallBack"] ? options["cancelPopupCallBack"] : null;

                var dataForPopup = {
                    dataset:
                        {
                            fromDate    : options["fromDate"]   ? options["fromDate"] : null,
                            toDate      : options["toDate"]     ? options["toDate"] : null,
                            oldFromDate : options["oldFromDate"]? options["oldFromDate"] : null,
                            oldToDate   : options["oldToDate"]  ? options["oldToDate"] : null
                        }
                };

                showMoveConfirmationPopup(dataForPopup);
            };

            /**
             * [successCallBackOfMoveDatesAPI description]
             * @param  {[type]} data [description]
             * @return {[type]}      [description]
             */
            var successCallBackOfMoveDatesAPI = function (data) {
                $scope.closeDialog ();
                lastSuccessCallback ();
            };

            /**
             * [failureCallBackOfMoveDatesAPI description]
             * @param  {[type]} errorMessage [description]
             * @return {[type]}              [description]
             */
            var failureCallBackOfMoveDatesAPI= function (error) {
                $scope.closeDialog ();

                //since we are expecting some custom http error status in the response
                //and we are using that to differentiate among errors
                if(error.hasOwnProperty ('httpStatus')) {
                    switch (error.httpStatus) {
                        case 470:
                            $timeout(
                                function(){
                                    openNoAvailabilityPopup ();
                                },
                            750);
                            break;
                        default:
                            $scope.errorMessage = error;
                            lastFailureCallback (error);
                            break;
                    }
                }

                else {
                    $scope.errorMessage = error;
                    lastFailureCallback (error);
                }
            };

            /**
             * function explicitly for calling the move API
             * @param  {[type]} options [description]
             * @return {[type]}         [description]
             */
            $scope.callMoveDatesAPI = function (options, forcefullyOverbook) {
                var dataSet         = options && options["dataset"],
                    newFromDate     = dataSet["fromDate"] ? formatDateForAPI(dataSet["fromDate"]) : null,
                    newToDate       = dataSet["toDate"] ? formatDateForAPI(dataSet["toDate"]) : null,
                    sumryData       = $scope.groupConfigData.summary,
                    forcefullyOverbook = typeof forcefullyOverbook === "undefined" ? false : forcefullyOverbook;

                lastApiFnParams = _.extend({}, arguments);

                var params = {
                    group_id                : sumryData.group_id,
                    from_date               : newFromDate,
                    to_date                 : newToDate,
                    force_fully_over_book   : forcefullyOverbook
                };

                var options = {
                    params          : params,
                    successCallBack : successCallBackOfMoveDatesAPI,
                    failureCallBack : failureCallBackOfMoveDatesAPI
                };
                $scope.callAPI(rvGroupConfigurationSrv.completeMoveGroup, options);
            };

            /**
             * When clicked on move button
             * @return {undefined}
             */
            var clickedOnMoveButton = function () {
                setMode ("COMPLETE_MOVE");
            };

            var triggerdChangeDateActions = function() {
                setMode ("CHANGE_DATES");
            };

            /**
             * to set to default mode
             * @return {undefined}
             */
            var setToDefaultMode = function () {
                setMode ("DEFAULT");
            };

            /**
             * whether date change is in default mode
             * @return {Boolean} [description]
             */
            var isInDefaultMode = function () {
                return (_.indexOf(["DEFAULT", null], activeMode) >= 0);
            }

            /**
             * Returns true if in move group mode.
             * @return {Boolean} True for move mode.
             */
            var isInCompleteMoveMode = function() {
                return (activeMode === "COMPLETE_MOVE");
            };

            /**
             * Returns true if in arr/dept date left/right change mode.
             * @return {Boolean} True for date change mode.
             */
            var isInChangeDatesMode = function() {
                return (activeMode === "CHANGE_DATES");
            };

            /**
             * [cancelMoveAction description]
             * @return {[type]} [description]
             */
            var cancelMoveAction = function() {
                // time out to prevent outside click event firing.
                $timeout(function(){
                    setToDefaultMode ();
                }, 100);
            };

            /**
             * Called when user cancels a change date popup
             * @return {undefined}
             */
            $scope.cancelChangeDatesAction = function() {
                $scope.closeDialog ();
                if (lastCancelCallback)
                    lastCancelCallback();

                // time out to prevent outside click event firing.
                $timeout(function(){
                    setToDefaultMode ();
                }, 100);
             };

            /**
             * to get various move dates from child controllers
             * @return {Object} options [description]
             */
            $scope.getMoveDatesActions = function () {
                return {
                    shouldShowMoveButton         : shouldShowMoveButton,
                    clickedOnMoveButton          : clickedOnMoveButton,
                    triggerEarlierArrDateChange  : triggerEarlierArrivalDateChange,
                    triggerLaterArrDateChange    : triggerLaterArrivalDateChange,
                    arrDateLeftChangeAllowed     : arrDateLeftChangeAllowed,
                    arrDateRightChangeAllowed    : arrDateRightChangeAllowed,
                    triggerEarlierDepDateChange  : triggerEarlierDepartureDateChange,
                    triggerLaterDepDateChange    : triggerLaterDepartureDateChange,
                    depDateLeftChangeAllowed     : depDateLeftChangeAllowed,
                    depDateRightChangeAllowed    : depDateRightChangeAllowed,
                    showDateChangeInvalidWarning : showDateChangeInvalidWarning,
                    isInCompleteMoveMode         : isInCompleteMoveMode,
                    isInChangeDatesMode          : isInChangeDatesMode,
                    clickedOnMoveSaveButton      : clickedOnMoveSaveButton,
                    cancelMoveAction             : cancelMoveAction,
                    setToDefaultMode             : setToDefaultMode,
                    triggerdChangeDateActions    : triggerdChangeDateActions
                };
            };
        }());

        /**
         * we will update the summary data, when we got this one
         * @return undefined
         */
        var fetchSuccessOfSummaryData = function(data) {
            var summaryData = $scope.groupConfigData.summary; // ref for group summary
            summaryData = _.extend(summaryData, data.groupSummary);
            if (!summaryData.release_date) {
                summaryData.release_date = summaryData.block_from;
            }

            if (!$scope.isInAddMode()) {
                summaryData.block_from = new tzIndependentDate(summaryData.block_from);
                summaryData.block_to = new tzIndependentDate(summaryData.block_to);
            }

            // let others know we have refreshed summary data
            $scope.$broadcast("UPDATED_GROUP_INFO");
        };

        /**
         * method to fetch summary data
         * @return undefined
         */
        var fetchSummaryData = function() {
            var params = {
                "groupId": $scope.groupConfigData.summary.group_id
            };
            var options = {
                successCallBack: fetchSuccessOfSummaryData,
                params: params
            };

            $scope.callAPI(rvGroupConfigurationSrv.getGroupSummary, options);
        };

        /**
         * Refresh the group summary data when we get this event
         */
        $scope.$on("FETCH_SUMMARY", function(event) {
            event.stopPropagation();
            fetchSummaryData();
        });

        /**
         * function to form data model for add/edit mode
         * @return - None
         */
        $scope.initializeDataModelForSummaryScreen = function() {
            $scope.groupConfigData = {
                activeTab: $stateParams.activeTab, // Possible values are SUMMARY, ROOM_BLOCK, ROOMING, ACCOUNT, TRANSACTIONS, ACTIVITY
                summary: summaryData.groupSummary,
                holdStatusList: holdStatusList.data.hold_status,
                selectAddons: false, // To be set to true while showing addons full view
                addons: {},
                selectedAddons: [],
                activeScreen: 'GROUP_ACTUAL'
            };
            var groupSummary = $scope.groupConfigData.summary;

            $timeout(function() {
                $scope.groupSummaryMemento = angular.copy(groupSummary);
            }, 500);


            $scope.accountConfigData = {
                summary: summaryData.accountSummary
            }
            if (!groupSummary.release_date) {
               groupSummary.release_date = groupSummary.block_from;
            }

            if (!$scope.isInAddMode()) {
                groupSummary.block_from = new tzIndependentDate(groupSummary.block_from);
                groupSummary.block_to = new tzIndependentDate(groupSummary.block_to);
            }


            // if we searched a group name that wasnt in the db
            // pass over that search term here
            if ( !!$stateParams.newGroupName ) {
                groupSummary.group_name = $stateParams.newGroupName
            };

        };

        /**
         * function to check whether the user has permission
         * to make view the transactions tab
         * @return {Boolean}
         */
        $scope.hasPermissionToViewTransactionsTab = function() {
            return rvPermissionSrv.getPermissionValue('ACCESS_GROUP_ACCOUNT_TRANSACTIONS');
        };

        /**
         * TAB - to swicth tab
         * @return - None
         */
        $scope.switchTabTo = function(tab) {

            //if there was any error message there, we are clearing
            $scope.errorMessage = '';

            //allow to swith to "transactions" tab only if the user has its permission
            if (tab === "TRANSACTIONS" && !$scope.hasPermissionToViewTransactionsTab()) {
                $scope.errorMessage = ["Sorry, you don't have the permission to access the transactions"];
                return;
            }

            var isInSummaryTab = $scope.groupConfigData.activeTab === "SUMMARY";

            // we will restrict tab swithing if we are in add mode
            var tryingFromSummaryToOther = isInSummaryTab && tab !== 'SUMMARY';
            if ($scope.isInAddMode() && tryingFromSummaryToOther) {
                $scope.errorMessage = ['Sorry, Please save the entered information and try to switch the tab'];
                return;
            }

            $scope.groupConfigData.activeTab = tab;

            //propogating an event that next clients are
            $timeout(function() {
                $scope.$broadcast('GROUP_TAB_SWITCHED', $scope.groupConfigData.activeTab);
            }, 100);

        };

        var preLoadTransactionsData = function() {
            var onTransactionFetchSuccess = function(data) {

                $scope.$emit('hideloader');
                $scope.transactionsDetails = data;
                $scope.groupConfigData.activeTab = 'TRANSACTIONS';

                /*
                 * Adding billValue and oldBillValue with data. Adding with each bills fees details
                 * To handle move to bill action
                 * Added same value to two different key because angular is two way binding
                 * Check in HTML moveToBillAction
                 */
                angular.forEach($scope.transactionsDetails.bills, function(value, key) {
                    angular.forEach(value.total_fees.fees_details, function(feesValue, feesKey) {

                        feesValue.billValue = value.bill_number; //Bill value append with bill details
                        feesValue.oldBillValue = value.bill_number; // oldBillValue used to identify the old billnumber
                    });
                });

            }
            var params = {
                "account_id": $scope.accountConfigData.summary.posting_account_id
            }
            $scope.callAPI(rvAccountTransactionsSrv.fetchTransactionDetails, {
                successCallBack: onTransactionFetchSuccess,
                params: params
            });

        };

        /**
         * Refresh group page.
         * @param {string} TAB: Set to this tab. default is SUMMARY
         * @return {undefined}
         */
        $scope.reloadPage = function(tab) {
            tab = tab || "SUMMARY";
            $state.go('rover.groups.config', {
                id: $scope.groupConfigData.summary.group_id,
                activeTab: tab
            }, {
                reload: true
            });
        }

        /**
         * Handle closing of addons screen
         * @return undefined
         */
        $scope.closeGroupAddonsScreen = function() {
            $scope.groupConfigData.selectAddons = false;
            $scope.reloadPage();
        }

        /**
         * Handle opening the addons Management screen
         * @return undefined
         */
        $scope.openGroupAddonsScreen = function() {
            $scope.groupConfigData.selectAddons = true;
        }

        /**
         * to get the current tab url
         * @return {String}
         */
        $scope.getCurrentTabUrl = function() {
            var tabAndUrls = {
                'SUMMARY': '/assets/partials/groups/summary/rvGroupConfigurationSummaryTab.html',
                'ROOM_BLOCK': '/assets/partials/groups/roomBlock/rvGroupConfigurationRoomBlockTab.html',
                'ROOMING': '/assets/partials/groups/rooming/rvGroupRoomingListTab.html',
                'ACCOUNT': '/assets/partials/accounts/accountsTab/rvAccountsSummary.html',
                'TRANSACTIONS': '/assets/partials/accounts/transactions/rvAccountTransactions.html',
                'ACTIVITY': '/assets/partials/groups/activity/rvGroupConfigurationActivityTab.html'
            };

            return tabAndUrls[$scope.groupConfigData.activeTab];
        };

        /**
         * Save the new Group
         * @return undefined
         */
        $scope.saveNewGroup = function() {
            $scope.errorMessage = "";
            if (rvPermissionSrv.getPermissionValue('CREATE_GROUP_SUMMARY') && !$scope.groupConfigData.summary.group_id) {
                if (ifMandatoryValuesEntered()) {
                    var onGroupSaveSuccess = function(data) {
                            $scope.groupConfigData.summary.group_id = data.group_id;
                            $state.go('rover.groups.config', {
                                id: data.group_id
                            })
                            $stateParams.id = data.group_id;
                        },
                        onGroupSaveFailure = function(errorMessage) {
                            $scope.errorMessage = errorMessage;
                        };

                    if (!$scope.groupConfigData.summary.rate) {
                        $scope.groupConfigData.summary.rate = -1;
                    }

                    $scope.callAPI(rvGroupConfigurationSrv.saveGroupSummary, {
                        successCallBack: onGroupSaveSuccess,
                        failureCallBack: onGroupSaveFailure,
                        params: {
                            summary: $scope.groupConfigData.summary
                        }
                    });
                } else {
                    $scope.errorMessage = ["Group's name, from date, to date, room release date and hold status are mandatory"];
                }
            } else {
                $scope.$emit("showErrorMessage", ["Sorry, you don\'t have enough permission to save the details"])
            }

        }
        /** CICO-20270: a 470 failure response indicates that transactions exist
         * in bill routing. we need to show user a warning in this case.
         * @param {object} API response object.
         */
        var showRemoveCardsAPIErrorPopup = function(errors) {
            var data = {
                errorMessages: errors.errorMessage
            };
            $timeout(function(){
                ngDialog.open({
                    template: '/assets/partials/groups/summary/popups/detachCardsAPIErrorPopup.html',
                    className: 'ngdialog-theme-default stay-card-alerts',
                    scope: $scope,
                    closeByDocument: false,
                    closeByEscape: false,
                    data: JSON.stringify(data)
                });
            }, 500);
        };

        /**
         * Update the group data
         * @return boolean
         */
        $scope.updateGroupSummary = function() {

            if (rvPermissionSrv.getPermissionValue('EDIT_GROUP_SUMMARY')) {
                if (angular.equals($scope.groupSummaryMemento, $scope.groupConfigData.summary)) {
                    return false;
                }
                var onGroupUpdateSuccess = function(data) {
                        //client controllers should get an infromation whether updation was success
                        $scope.$broadcast("UPDATED_GROUP_INFO", angular.copy($scope.groupConfigData.summary));
                        $scope.groupSummaryMemento = angular.copy($scope.groupConfigData.summary);
                        return true;
                    },
                    onGroupUpdateFailure = function(error) {
                        /* CICO-20270: Since we are expecting some custom http error status in the response
                         * and we are using that to acknowledge error with card detaching.*/
                        if(error.hasOwnProperty ('httpStatus')) {
                            switch (error.httpStatus) {
                                case 470:
                                    showRemoveCardsAPIErrorPopup(error);
                                    break;
                                default:
                                    $scope.errorMessage = error.errorMessage;
                                    break;
                            }
                        }

                        else {
                            //client controllers should get an infromation whether updation was a failure
                            $scope.$broadcast("FAILED_TO_UPDATE_GROUP_INFO", error);
                            $scope.errorMessage = error;
                            return false;
                        }
                    };

                var summaryData = _.extend({}, $scope.groupConfigData.summary);
                summaryData.block_from = $filter('date')(summaryData.block_from, $rootScope.dateFormatForAPI);
                summaryData.block_to = $filter('date')(summaryData.block_to, $rootScope.dateFormatForAPI);
                summaryData.release_date = $filter('date')(summaryData.release_date, $rootScope.dateFormatForAPI);
                if (!summaryData.rate) {
                    summaryData.rate = -1;
                }
                $scope.callAPI(rvGroupConfigurationSrv.updateGroupSummary, {
                    successCallBack: onGroupUpdateSuccess,
                    failureCallBack: onGroupUpdateFailure,
                    params: {
                        summary: summaryData
                    }
                });
            } else {
                $scope.$emit("showErrorMessage", ["Sorry, the changes will not get saved as you don\'t have enough permission to update the details"])
            }
        }

        /**
         * Code to duplicate group
         * Future functionality
         * @return undefined
         */
        $scope.duplicateGroup = function() {
            //TODO: Duplicate Group - Future functionality
        }

        /**
         * Discard the new Group
         * @return undefined
         */
        $scope.discardNewGroup = function() {
            $scope.groupConfigData.summary = angular.copy(rvGroupConfigurationSrv.baseConfigurationSummary);
            $scope.groupConfigData.summary.selected_room_types_and_bookings = [];
            $scope.groupConfigData.summary.selected_room_types_and_rates = [];
            $scope.groupConfigData.summary.selected_room_types_and_occupanies = [];
            $scope.groupConfigData.summary.release_date = '';
        }

        $scope.onCompanyCardChange = function() {
            if ($scope.groupConfigData.summary.company && $scope.groupConfigData.summary.company.name === "") {
                $scope.groupConfigData.summary.company = null
            }
        }

        $scope.onTravelAgentCardChange = function() {
            if ($scope.groupConfigData.summary.travel_agent && $scope.groupConfigData.summary.travel_agent.name === "") {
                $scope.groupConfigData.summary.travel_agent = null
            }
        }

        $scope.detachCardFromGroup = function(card) {
            // warn about billing info
            var dataForPopup = {
                cardType: card
            }
            ngDialog.open({
                template: '/assets/partials/groups/summary/popups/detachCardWarningPopup.html',
                scope: $scope,
                closeByDocument: false,
                closeByEscape: false,
                data: JSON.stringify(dataForPopup)
            });
        };

        /**
         * Autocompletions for company/travel agent
         * @return {None}
         */
        var initializeAutoCompletions = function() {
            //this will be common for both company card & travel agent
            var cardsAutoCompleteCommon = {

                focus: function(event, ui) {
                    return false;
                }
            }

            //merging auto complete setting for company card with common auto cmplt options
            $scope.companyAutoCompleteOptions = angular.extend({
                source: function(request, response) {
                    rvGroupConfigurationSrv.searchCompanyCards(request.term)
                        .then(function(data) {
                            var list = [];
                            var entry = {}
                            $.map(data, function(each) {
                                entry = {
                                    label: each.account_name,
                                    value: each.id,
                                    type: each.account_type
                                };
                                list.push(entry);
                            });

                            response(list);
                        });
                },
                select: function(event, ui) {
                    this.value = ui.item.label;
                    $scope.groupConfigData.summary.company.name = ui.item.label;
                    $scope.groupConfigData.summary.company.id = ui.item.value;
                    if (!$scope.isInAddMode()) {
                        $scope.updateGroupSummary();
                    }
                    $scope.$broadcast("COMPANY_CARD_CHANGED");
                    runDigestCycle();
                    return false;
                },
                change: function() {
                    if (!$scope.isInAddMode() && (!$scope.groupConfigData.summary.company || !$scope.groupConfigData.summary.company.name)) {
                        $scope.groupConfigData.summary.company = {
                            id: ""
                        }
                        $scope.detachCardFromGroup('company');
                    }
                    $scope.$broadcast("COMPANY_CARD_CHANGED");
                }
            }, cardsAutoCompleteCommon);

            //merging auto complete setting for travel agent with common auto cmplt options
            $scope.travelAgentAutoCompleteOptions = angular.extend({
                source: function(request, response) {
                    rvGroupConfigurationSrv.searchTravelAgentCards(request.term)
                        .then(function(data) {
                            var list = [];
                            var entry = {}
                            $.map(data, function(each) {
                                entry = {
                                    label: each.account_name,
                                    value: each.id,
                                    type: each.account_type
                                };
                                list.push(entry);
                            });

                            response(list);
                        });
                },
                select: function(event, ui) {
                    this.value = ui.item.label;
                    $scope.groupConfigData.summary.travel_agent.name = ui.item.label;
                    $scope.groupConfigData.summary.travel_agent.id = ui.item.value;
                    if (!$scope.isInAddMode()) {
                        $scope.updateGroupSummary();
                    }
                    $scope.$broadcast("TA_CARD_CHANGED");
                    runDigestCycle();
                    return false;
                },
                change: function() {
                    if (!$scope.isInAddMode() && (!$scope.groupConfigData.summary.travel_agent || !$scope.groupConfigData.summary.travel_agent.name)) {
                        $scope.groupConfigData.summary.travel_agent = {
                            id: ""
                        }
                        $scope.detachCardFromGroup('travel_agent');
                    }
                    $scope.$broadcast("TA_CARD_CHANGED");
                }
            }, cardsAutoCompleteCommon);
        };

        /**
         * method to set groupConfigData.summary.addons_count
         */
        $scope.computeAddonsCount = function() {
            var count = 0;
            angular.forEach($scope.groupConfigData.selectedAddons, function(addon) {
                count += parseInt(addon.addon_count);
            })
            if (count > 0) {
                $scope.groupConfigData.summary.addons_count = count;
            } else {
                $scope.groupConfigData.summary.addons_count = null;
            }

        }



        /**
         * THIS IS SELF EXECUTED FUNCTIONS VALUE
         * decide what the title, name and param of back button
         * @param {Object} $r  shorthand ref to $rootScoop
         */
        var resolvedBackBtn = (function ($r) {

            /** the default state which should be used if all checks fails */
            var title = 'GROUPS',
                name  = 'rover.groups.search',
                param = {};

            /**
             * @type {String} the previous state title
             * @type {String} the previous state name
             */
            var prevTitle = $r.getPrevStateTitle(),
                prevName  = $r.getPrevStateName(),
                prevParam = $r.getPrevStateParam() || {};

            /** @type {Object} states that are part of reservation flow */
            var reservationFlow = {
                forRoutes: [
                    roomAndRatesState,
                    'rover.reservation.staycard.mainCard.addons',
                    'rover.reservation.staycard.mainCard.summaryAndConfirm',
                    'rover.reservation.staycard.mainCard.reservationConfirm'
                ],
                goBackTo: 'rover.reservation.search',
                backTitle: 'FIND RESERVATION'
            }

            /** @type {Array} states that are part of a proper flow */
            var flowStates = [
                'rover.reservation.staycard.reservationcard.reservationdetails'
            ];

            // if its part of reservation flow
            // else if its part of proper flow
            if ( _.indexOf(reservationFlow.forRoutes, prevName) >= 0 ) {
                title = reservationFlow.backTitle;
                name  = reservationFlow.goBackTo;
            } else if ( _.indexOf(flowStates, prevName) >= 0 ) {
                title = prevTitle;
                name  = prevName;
                param = prevParam;
            };

            return {
                'title' : title,
                'name'  : name,
                'param' : param
            };
        })( $rootScope );

        $scope.updateAndBack = function() {
            if ( !$scope.isInAddMode() && 'SUMMARY' === $scope.groupConfigData.activeTab ) {
                $scope.updateGroupSummary();
            } else if ( 'ACCOUNT' === $scope.groupConfigData.activeTab ) {
                $scope.$broadcast( 'UPDATE_ACCOUNT_SUMMARY' );
            };

            $state.go( resolvedBackBtn.name, resolvedBackBtn.param );
        }

        // function to set Back Navigation params
        var setBackNavigation = function() {
            $rootScope.setPrevState = {
                'title'    : resolvedBackBtn.title,
                'callback' : 'updateAndBack',
                'scope'    : $scope
            };

            // setting title and things
            setTitle();
        };




        /**
         * When we recieve the error message from its child controllers, we have to show them
         * @param  {Object} event
         * @param  {String} errorMessage)
         * @return undefined
         */
        $scope.$on('showErrorMessage', function(event, errorMessage) {
            $scope.errorMessage = errorMessage;
            runDigestCycle();
        });


        $scope.parseCurrency = function(value) {
            if (!!value) {
                return $rootScope.currencySymbol + $filter('number')(value, 2);
            } else {
                return ""
            }
        };

        /**
         * to set the active left side menu
         * @return {undefined}
         */
        var setActiveLeftSideMenu = function () {
            var activeMenu = ($scope.isInAddMode()) ? "menuCreateGroup": "menuManageGroup";
            $scope.$emit("updateRoverLeftMenu", activeMenu);
        };

        /**
         * function to initialize things for group config.
         * @return - None
         */
        var initGroupConfig = function() {

            //forming the data model if it is in add mode or populating the data if it is in edit mode
            $scope.initializeDataModelForSummaryScreen();

            //auto completion things
            initializeAutoCompletions();

            //back navigation
            setBackNavigation();

            //updating the left side menu
            setActiveLeftSideMenu();
        };

        initGroupConfig();
    }
]);